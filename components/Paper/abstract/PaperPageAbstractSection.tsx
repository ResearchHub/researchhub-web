import { css, StyleSheet } from "aphrodite";
import { ReactElement, useEffect, useState } from "react";
import SimpleEditor from "~/components/CKEditor/SimpleEditor";
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
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isUpdatingAbstract, setIsUpdatingAbstract] = useState<boolean>(false);
  
  useEffectParseAbstract({ paper, setAbstractSrc, setHasNoAbstract });

  return (
    <div className={css(styles.paperPageAbstractSection)}>
      <h2>{"Abstract"}</h2>
      {isEditMode ? (
        <div className={css(styles.editorWrap)}>
          <SimpleEditor
            editing
            disabled={isUpdatingAbstract}
            initialData={abstractSrc}
            isBalloonEditor
            noTitle
            onChange={(_, editorSrcValue: string): void => {
              setAbstractSrc(editorSrcValue);
            }}
          />
          <div className={css(styles.editButtonRow)}>
            <Button
              disabled={isUpdatingAbstract}
              isWhite
              label={"Cancel"}
              onClick={(): void => setIsEditMode(false)}
              size={"small"}
            />
            <Button
              disabled={isUpdatingAbstract}
              label={"Save"}
              onClick={(): void => {
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
          <SimpleEditor
            initialData={abstractSrc}
            isBalloonEditor
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

  editorWrap: {},
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

  tab: {
    padding: "4px 12px",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    marginRight: 8,
    color: "rgba(36, 31, 58, 0.6)",
    borderRadius: 4,
    ":hover": {
      color: colors.NEW_BLUE(),
    },
    "@media only screen and (max-width: 967px)": {
      marginRight: 0,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
});
