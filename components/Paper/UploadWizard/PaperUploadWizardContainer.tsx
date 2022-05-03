import { breakpoints } from "~/config/themes/screen";
import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { ID } from "~/config/types/root_types";
import {
  NewPostButtonContext,
  NewPostButtonContextType,
} from "~/components/contexts/NewPostButtonContext";
import { nullthrows } from "~/config/utils/nullchecks";
import { ReactElement, useContext } from "react";
import { ROUTES as WS_ROUTES } from "~/config/ws";
import { WizardBodyTypes } from "./types/PaperUploadWizardTypes";
import PaperUploadWizardDOIBody from "./PaperUploadWizardDOIBody";
import PaperUploadWizardHeader from "./PaperUploadWizardHeader";
import PaperUploadWizardPDFUpload from "./PaperUploadWizardPDFUpload";
import PaperUploadWizardUpdatePaper from "./PaperUploadWizardUpdatePaper";
import PaperUploadWizardUrlOrDOIBody from "./PaperUploadWizardUrlOrDOIBody";

type Props = { userRedux: any; /* redux */ onExit: () => void };
type WizardBodyElement = ReactElement<typeof PaperUploadWizardUrlOrDOIBody>;

function getWizardBody({
  currentStep,
  currentUserID,
  onExit,
}: {
  currentStep: WizardBodyTypes;
  currentUserID: ID;
  onExit: () => void;
}): WizardBodyElement {
  switch (currentStep) {
    case "async_updated":
    case "posted_paper_update":
    case "standby":
      return (
        // @ts-ignore legacy socket hook
        <PaperUploadWizardUpdatePaper
          onExit={onExit}
          wsAuth
          wsUrl={WS_ROUTES.PAPER_SUBMISSION(currentUserID)}
        />
      );
    case "doi_upload":
      return <PaperUploadWizardDOIBody onExit={onExit} />;
    case "pdf_upload":
      return <PaperUploadWizardPDFUpload onExit={onExit} />;
    case "url_or_doi_upload":
    default:
      return <PaperUploadWizardUrlOrDOIBody onExit={onExit} />;
  }
}

function PaperUploadWizardContainer({
  userRedux,
  onExit,
}: Props): ReactElement<Props> {
  const currentUserID = userRedux?.id ?? null;
  const {
    values: { wizardBodyType },
  } = useContext<NewPostButtonContextType>(NewPostButtonContext);
  const wizardBody = getWizardBody({
    currentStep: nullthrows(
      wizardBodyType,
      `Unrecognized wizardBodyType: ${wizardBodyType}`
    ),
    currentUserID,
    onExit,
  });

  return (
    <div className={css(styles.paperUploadWizardContainer)}>
      <div className={css(styles.contentWrap)}>
        <PaperUploadWizardHeader
          currentStep={nullthrows(
            wizardBodyType,
            `Unrecognized wizardBodyType: ${wizardBodyType}`
          )}
          currentUserID={nullthrows(
            currentUserID,
            "User must be present to upload a paper"
          )}
          onExit={onExit}
        />
        <div className={css(styles.bodyWrap)}>{wizardBody}</div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  userRedux: state.auth.user,
});

export default connect(mapStateToProps, {})(PaperUploadWizardContainer);

const styles = StyleSheet.create({
  paperUploadWizardContainer: {
    alignItems: "center",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "center",
    minWidth: "600px",
    width: "100%",
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      minWidth: "unset",
      padding: "16px",
    },
  },
  bodyWrap: {},
  contentWrap: {
    maxWidth: 720,
    width: "100%",
  },
});
