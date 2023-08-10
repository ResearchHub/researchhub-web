import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/pro-light-svg-icons";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";
import { formGenericStyles } from "../Upload/styles/formGenericStyles";
import { ID } from "~/config/types/root_types";
import { NewPostButtonContext } from "~/components/contexts/NewPostButtonContext";
import { ReactElement, SyntheticEvent, useContext } from "react";
import { ROUTES as WS_ROUTES } from "~/config/ws";
import { WizardBodyTypes } from "./types/PaperUploadWizardTypes";
import colors from "~/config/themes/colors";

import PaperUploadWizardStandbyBody from "./PaperUploadWizardStandbyBody";

type Props = {
  currentStep?: WizardBodyTypes;
  currentUserID: ID;
  onExit?: () => void;
};

export default function PaperUploadWizardHeader({
  currentStep,
  currentUserID,
  onExit,
}: Props): ReactElement {
  const { values: uploaderContextValues, setValues: setUploaderContextValues } =
    useContext<NewPostButtonContextType>(NewPostButtonContext);
  if (currentStep === "standby") {
    return (
      // @ts-ignore legacy socket hook
      (<PaperUploadWizardStandbyBody
        onExit={onExit}
        wsAuth
        wsUrl={WS_ROUTES.PAPER_SUBMISSION(currentUserID)}
      />)
    );
  } else if (currentStep === "posted_paper_update") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingBottom:
            "16px !important" /* overrides default header padding */,
        }}
      >
        <img
          style={{ width: 60, marginBottom: 16 }}
          src="/static/icons/check.svg"
        />
        <div className={css(styles.title)}>
          {"Your paper was uploaded successfully."}
        </div>
      </div>
    );
  } else {
    return (
      (<div className={css(formGenericStyles.text, styles.header)}>
        <span className={css(styles.close)} onClick={onExit}>
          {<FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>}
        </span>
        {currentStep === "pdf_upload" ? (
          <div
            style={{
              alignItems: "center",
              display: "flex",
            }}
          >
            <span
              className={css(styles.back)}
              onClick={(event: SyntheticEvent): void => {
                event.preventDefault();
                setUploaderContextValues({
                  ...uploaderContextValues,
                  wizardBodyType: "url_or_doi_upload",
                });
              }}
            >
              {<FontAwesomeIcon icon={faArrowLeftLong}></FontAwesomeIcon>}
            </span>
            {"Upload PDF"}
          </div>
        ) : (
          <span style={{ color: colors.PURE_BLACK() }}>"Upload Paper"</span>
        )}
        <a
          className={css(formGenericStyles.authorGuidelines)}
          style={{ color: colors.BLUE(1) }}
          href="https://www.notion.so/researchhub/Paper-Submission-Guidelines-a2cfa1d9b53c431a91c9816e17f212e1"
          target="_blank"
          rel="noreferrer noopener"
        >
          {"Submission Guidelines"}
        </a>
      </div>)
    );
  }
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    borderBottom: `1px solid ${colors.GREY_BORDER}`,
    display: "flex",
    fontSize: 26,
    fontWeight: 500,
    justifyContent: "space-between",
    paddingBottom: 8,
    paddingTop: 20,
    position: "relative",
    width: "100%",
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      fontSize: 18,
    },
  },
  back: {
    cursor: "pointer",
    fontSize: 18,
    left: 0,
    marginRight: 8,
    opacity: 0.6,
    position: "absolute",
    top: -10,
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      top: -28,
    },
  },
  close: {
    cursor: "pointer",
    fontSize: 18,
    position: "absolute",
    right: 0,
    top: -12,
    opacity: 0.6,
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      fontSize: 20,
      top: -32,
    },
  },
  title: {
    display: "flex",
    fontSize: 26,
    fontWeight: 500,
    marginBottom: 16,
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      fontSize: 18,
      marginBottom: 8,
    },
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 500,
    marginBottom: 18,
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      fontSize: 16,
      marginBottom: 8,
    },
  },
});
