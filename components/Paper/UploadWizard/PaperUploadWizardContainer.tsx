import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";
import { ReactElement, useContext } from "react";
import { ROUTES as WS_ROUTES } from "~/config/ws";
import { WizardBodyTypes } from "./types/PaperUploadWizardTypes";
import PaperUploadWizardHeader from "./PaperUploadWizardHeader";
import PaperUploadWizardStandbyBody from "./PaperUploadWizardStandbyBody";
import PaperUploadWizardUpdatePaper from "./PaperUploadWizardUpdatePaper";
import PaperUploadWizardURLBody from "./PaperUploadWizardURLBody";
import PaperUploadWizardPDFUpload from "./PaperUploadWizardPDFUpload";
import {
  NewPostButtonContext,
  NewPostButtonContextType,
} from "~/components/contexts/NewPostButtonContext";
import PaperUploadWizardDOIBody from "./PaperUploadWizardDOIBody";

type Props = { onExit: () => void };
type WizardBodyElement = ReactElement<typeof PaperUploadWizardURLBody>;

function getWizardBody({
  currentStep,
  onExit,
}: {
  currentStep: WizardBodyTypes;
  onExit: () => void;
}): WizardBodyElement {
  switch (currentStep) {
    case "doi_upload":
      return <PaperUploadWizardDOIBody onExit={onExit} />;
    case "pdf_upload":
      return <PaperUploadWizardPDFUpload onExit={onExit} />;
    case "posted_paper_update":
      return <PaperUploadWizardUpdatePaper onExit={onExit} />;
    case "standby":
      return (
        // @ts-ignore legacy socket hook
        <PaperUploadWizardStandbyBody
          onExit={onExit}
          wsAuth
          wsUrl={WS_ROUTES.PAPER_SUBMISSION(1)}
        />
      );
    case "url_upload":
    default:
      return <PaperUploadWizardURLBody onExit={onExit} />;
  }
}

export default function PaperUploadWizardContainer({
  onExit,
}: Props): ReactElement<Props> {
  const {
    values: { wizardBodyType },
  } = useContext<NewPostButtonContextType>(NewPostButtonContext);
  const wizardBody = getWizardBody({
    currentStep: wizardBodyType,
    onExit,
  });

  return (
    <div className={css(styles.paperUploadWizardContainer)}>
      <div className={css(styles.contentWrap)}>
        <PaperUploadWizardHeader currentStep={wizardBodyType} />
        <div className={css(styles.bodyWrap)}>{wizardBody}</div>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  paperUploadWizardContainer: {
    alignItems: "center",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "32px 0",
    width: "100%",
    height: "100%",
    minWidth: "600px",
    [`@media only screen and (max-width: ${breakpoints.small})`]: {
      minWidth: "0",
      padding: "16px 0 0",
    },
  },
  bodyWrap: {},
  contentWrap: {
    maxWidth: 720,
    width: "100%",
  },
});
