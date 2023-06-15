import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faPencil } from "@fortawesome/pro-solid-svg-icons";
import { css, StyleSheet } from "aphrodite";
import dynamic from "next/dynamic";
import { ReactElement, useEffect, useState } from "react";
import Button from "~/components/Form/Button";
import PermissionNotificationWrapper from "~/components/PermissionNotificationWrapper";
import colors from "~/config/themes/colors";

import { breakpoints } from "~/config/themes/screen";
import { NullableString } from "~/config/types/root_types";
import {
  emptyFncWithMsg,
  isEmpty,
  silentEmptyFnc,
} from "~/config/utils/nullchecks";
import { postUpdatePaperAbstract } from "./api/postUpdatePaperAbstract";
import AbstractPlaceholder from "~/components/Placeholders/AbstractPlaceholder";
import { htmlStringToPlainString } from "~/config/utils/htmlStringToPlainString";
import { useRouter } from "next/router";
import { ClipLoader } from "react-spinners";

const DynamicCKEditor = dynamic(
  () => import("~/components/CKEditor/SimpleEditor")
);

type Props = {
  paper: any;
  onUpdate?: Function;
  isEditMode?: boolean;
  // Always show "edit" mode. Useful in some contexts
  permanentEdit?: boolean;
};

const useEffectParseAbstract = ({
  paper,
  setAbstractSrc,
  setHasNoAbstract,
}: {
  paper: any;
  setAbstractSrc: (src: NullableString) => void;
  setHasNoAbstract: (flag: boolean) => void;
}): void => {
  const { abstract, abstract_src_markdown, id } = paper;
  useEffect(
    (): void => {
      /* abstract is a legacy pure string while abstract_src_markdown is a text editor version of it. 
         we prioritize as below to support both legacy and new */
      !isEmpty(abstract_src_markdown)
        ? setAbstractSrc(abstract_src_markdown)
        : setAbstractSrc(abstract);
      setHasNoAbstract(isEmpty(abstract_src_markdown) && isEmpty(abstract));
    },
    [abstract, abstract_src_markdown, id] /* intentional explicit check */
  );
};

export default function PaperPageAbstractSection({
  paper,
  onUpdate,
  isEditMode = false,
  permanentEdit = false,
}: Props): ReactElement {
  const [abstractSrc, setAbstractSrc] = useState<NullableString>(null);
  const [hasNoAbstract, setHasNoAbstract] = useState<boolean>(false);
  const [_isEditMode, setIsEditMode] = useState<boolean>(
    isEditMode || permanentEdit
  );
  const [isUpdatingAbstract, setIsUpdatingAbstract] = useState<boolean>(false);
  const router = useRouter();

  useEffectParseAbstract({ paper, setAbstractSrc, setHasNoAbstract });

  return (
    <div className={css(styles.paperPageAbstractSection)}>
      <div>
        <div style={{ position: "relative", display: "inline-flex" }}>
          {!_isEditMode && <h2 style={{ display: "inline" }}>{"Abstract"}</h2>}
          <div style={{ position: "absolute", right: -30, top: 5 }}>
            {(!_isEditMode || hasNoAbstract) && (
              <PermissionNotificationWrapper
                modalMessage="propose abstract edit"
                onClick={(): void => setIsEditMode(true)}
                loginRequired
              >
                <span className={css(styles.pencilIcon)}>
                  {<FontAwesomeIcon icon={faPencil}></FontAwesomeIcon>}
                </span>
              </PermissionNotificationWrapper>
            )}
          </div>
        </div>

        {_isEditMode ? (
          <div className={css(styles.editorWrap)}>
            <div style={{ minHeight: 300 }}>
              <DynamicCKEditor
                editing
                initialData={abstractSrc}
                onChange={(_, editorSrcValue: string): void => {
                  setAbstractSrc(editorSrcValue);
                }}
              />
            </div>
            <div className={css(styles.editButtonRow)}>
              {!permanentEdit && (
                <Button
                  isWhite
                  variant={"text"}
                  label={"Cancel"}
                  onClick={(): void => setIsEditMode(false)}
                  size={"small"}
                />
              )}
              <Button
                label={
                  isUpdatingAbstract ? (
                    <ClipLoader
                      color={colors.LIGHT_GREY()}
                      key="abstract-submit-loader"
                      loading
                      size={14}
                    />
                  ) : (
                    "Save"
                  )
                }
                onClick={(event): void => {
                  event.preventDefault();
                  setIsUpdatingAbstract(true);
                  postUpdatePaperAbstract({
                    onError: (error: Error): void => {
                      emptyFncWithMsg(error);
                      if (!permanentEdit) {
                        setIsEditMode(false);
                      }
                      setIsUpdatingAbstract(false);
                    },
                    onSuccess: (response): void => {
                      if (!permanentEdit) {
                        setIsEditMode(false);
                      }
                      setIsUpdatingAbstract(false);
                      setAbstractSrc(abstractSrc);
                      setHasNoAbstract(isEmpty(abstractSrc));
                      onUpdate && onUpdate(abstractSrc);
                    },
                    paperPayload: {
                      /* NOTE: Manually overriding legacy "abstract" field since it's being used as a preview text in home feed
                      All proceeding updates make changes to abstract_src */
                      id: paper.id,
                      hubs: paper?.hubs.map((hub) => hub.id),
                      abstract_src: abstractSrc,
                      abstract: htmlStringToPlainString(abstractSrc, 2000),
                      abstract_src_type: "CK_EDITOR",
                    },
                  });
                }}
                size={"small"}
              />
            </div>
          </div>
        ) : hasNoAbstract ? (
          <div className={css(styles.emptyStateSummary)}>
            <div
              style={{
                color: colors.NEW_BLUE(1),
                fontSize: 50,
                height: 50,
              }}
            >
              {<FontAwesomeIcon icon={faFile}></FontAwesomeIcon>}
            </div>
            <h2 className={css(styles.noSummaryTitle)}>
              {"Add an abstract to this paper"}
            </h2>
            <div
              style={{
                alignItems: "center",
                color: colors.BLACK(0.8),
                display: "flex",
                fontSize: 16,
                margin: "0 0 20px",
                textAlign: "center",
              }}
            >
              {
                "Help us improve the quality of this page by adding an abstract."
              }
            </div>
            <PermissionNotificationWrapper
              loginRequired
              modalMessage="propose a summary"
              onClick={(): void => setIsEditMode(true)}
              permissionKey="ProposeSummaryEdit"
            >
              <button className={css(styles.button)}>{"Add Abstract"}</button>
            </PermissionNotificationWrapper>
          </div>
        ) : (
          <div>
            <p
              dangerouslySetInnerHTML={{
                __html: paper.abstract_src_markdown || paper.abstract,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  paperPageAbstractSection: {
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "column",
  },
  button: {
    background: colors.NEW_BLUE(1),
    border: "1px solid",
    borderRadius: 5,
    color: "#fff",
    cursor: "pointer",
    fontSize: 16,
    height: 45,
    outline: "none",
    padding: "8px 32px",
    ":hover": {
      backgroundColor: "#3E43E8",
    },
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      padding: "6px 24px",
      fontSize: 12,
    },
  },
  centerColumn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  emptyStateSummary: {
    alignItems: "center",
    borderRadius: 3,
    boxSizing: "border-box",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: "25px 0",
    width: "100%",
    ":hover": {
      borderColor: colors.NEW_BLUE(),
    },
  },

  editorWrap: {
    marginTop: 12,
  },
  editButtonRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 10,
    columnGap: "15px",
  },
  noSummaryTitle: {
    color: colors.BLACK(1),
    fontSize: 20,
    fontWeight: 500,
    textAlign: "center",
    marginTop: 20,
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      width: 280,
      fontSize: 16,
    },
  },
  pencilIcon: {
    alignSelf: "center",
    color: colors.LIGHT_GREY_TEXT,
    cursor: "pointer",
    display: "flex",
    fontSize: 14,
    marginLeft: 8,
    padding: "3px 5px",
    paddingRight: 0,
    transition: "all ease-out 0.1s",
    ":hover": {
      color: colors.NEW_BLUE(1),
      opacity: 1,
      textDecoration: "underline",
    },
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      padding: 0,
    },
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      fontSize: 12,
    },
  },
});
