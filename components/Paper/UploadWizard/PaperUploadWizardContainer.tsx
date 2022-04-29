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
import PaperUploadWizardHeader from "./PaperUploadWizardHeader";
import PaperUploadWizardStandbyBody from "./PaperUploadWizardStandbyBody";
import PaperUploadWizardUpdatePaper from "./PaperUploadWizardUpdatePaper";
import PaperUploadWizardUrlOrDOIBody from "./PaperUploadWizardUrlOrDOIBody";
import PaperUploadWizardPDFUpload from "./PaperUploadWizardPDFUpload";
import PaperUploadWizardDOIBody from "./PaperUploadWizardDOIBody";

type Props = { user: any; /* redux */ onExit: () => void };
type WizardBodyElement = ReactElement<typeof PaperUploadWizardUrlOrDOIBody>;

function getWizardBody({
  currentStep,
  onExit,
}: {
  currentStep: WizardBodyTypes;
  onExit: () => void;
}): WizardBodyElement {
  switch (currentStep) {
    case "async_updated":
    case "posted_paper_update":
    case "standby":
      return <PaperUploadWizardUpdatePaper onExit={onExit} />;
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
  user,
  onExit,
}: Props): ReactElement<Props> {
  const {
    values: { wizardBodyType },
  } = useContext<NewPostButtonContextType>(NewPostButtonContext);
  const wizardBody = getWizardBody({
    currentStep: nullthrows(
      wizardBodyType,
      `Unrecognized wizardBodyType: ${wizardBodyType}`
    ),
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
            user?.id,
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
  user: state.auth.user,
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
