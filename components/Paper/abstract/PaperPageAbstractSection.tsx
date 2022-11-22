import { css, StyleSheet } from "aphrodite";
import dynamic from "next/dynamic";
import { ReactElement, useEffect, useState } from "react";
import Button from "~/components/Form/Button";
import PermissionNotificationWrapper from "~/components/PermissionNotificationWrapper";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import { breakpoints } from "~/config/themes/screen";
import { NullableString } from "~/config/types/root_types";
import {
  emptyFncWithMsg,
  isEmpty,
  silentEmptyFnc,
} from "~/config/utils/nullchecks";
import { postUpdatePaperAbstract } from "./api/postUpdatePaperAbstract";

const SimpleEditor = dynamic(
  () => import("~/components/CKEditor/SimpleEditor")
);
const DynamicCKEditor = dynamic(
  () => import("~/components/CKEditor/SimpleEditor")
);

type Props = {
  paper: any;
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

export default function PaperPageAbstractSection({ paper }): ReactElement {
  const [abstractSrc, setAbstractSrc] = useState<NullableString>(null);
  const [hasNoAbstract, setHasNoAbstract] = useState<boolean>(true);
  const [isEditMode, setIsEditMode] = useState<boolean>(true);
  const [isUpdatingAbstract, setIsUpdatingAbstract] = useState<boolean>(false);
  useEffectParseAbstract({ paper, setAbstractSrc, setHasNoAbstract });

  return (
    <div className={css(styles.paperPageAbstractSection)}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>{"Abstract"}</h2>
        {(!isEditMode || hasNoAbstract) && (
          <PermissionNotificationWrapper
            modalMessage="propose abstract edit"
            onClick={(): void => setIsEditMode(true)}
            loginRequired
          >
            <span className={css(styles.pencilIcon)}>{icons.pencil}</span>
          </PermissionNotificationWrapper>
        )}
      </div>
      {isEditMode ? (
        <div className={css(styles.editorWrap)}>
          <SimpleEditor
            editing
            initialData={abstractSrc}
            onChange={(_, editorSrcValue: string): void => {
              setAbstractSrc(editorSrcValue);
            }}
          />
          <div className={css(styles.editButtonRow)}>
            <Button
              isWhite
              label={"Cancel"}
              onClick={(): void => setIsEditMode(false)}
              size={"small"}
            />
            <Button
              label={"Save"}
              onClick={(event): void => {
                event.preventDefault();
                setIsUpdatingAbstract(true);
                postUpdatePaperAbstract({
                  onError: (error: Error): void => {
                    emptyFncWithMsg(error);
                    setIsEditMode(false);
                    setIsUpdatingAbstract(false);
                  },
                  onSuccess: (): void => {
                    setIsEditMode(false);
                    setIsUpdatingAbstract(false);
                  },
                  paperPayload: {
                    /* NOTE: we no longer update abstract in attempt to depreciate this legacy field.
                    All proceeding updates make changes to abstract_src */
                    ...paper,
                    abstractSrc,
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
            {icons.file}
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
            {"Be the first person to add an abstract to this paper."}
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
        <div className={css(styles.editorWrapReadOnly)}>
          <DynamicCKEditor
            initialData={abstractSrc}
            isBalloonEditor /* removes toolbar */
            noBorder
            noTitle
            onChange={silentEmptyFnc}
            readOnly
          />
        </div>
      )}
    </div>
  );
}

const styles = StyleSheet.create({
  paperPageAbstractSection: {
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "column",
    "@media only screen and (max-width: 500px)": {
      marginTop: 15,
    },
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
    backgroundColor: colors.LIGHTER_GREY_BACKGROUND,
    border: `1px solid #F0F0F0`,
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

  editorWrap: { marginTop: 12 },
  editorWrapReadOnly: { marginLeft: -12 /* matching ck editor padding */ },
  editButtonRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 10,
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
