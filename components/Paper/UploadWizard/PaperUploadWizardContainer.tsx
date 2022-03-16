import { css, StyleSheet } from "aphrodite";
import { Fragment, ReactElement, useMemo, useState } from "react";
import { WizardBodyTypes } from "./types/PaperUploadWizardTypes";
import PaperUploadWizardHeader from "./PaperUploadWizardHeader";
import PaperUploadWizardURLBody from "./PaperUploadWizardURLBody";
import PaperUploadWizardStandbyBody from "./PaperUploadWizardStandbyBody";

type Props = {};
type State = {
  currentStep: WizardBodyTypes;
};
type WizardBodyElement = ReactElement<typeof PaperUploadWizardURLBody>;

function getWizardBody({
  currentStep,
  setCurrentStep,
}: {
  currentStep: WizardBodyTypes;
  setCurrentStep: (step: WizardBodyTypes) => void;
}): WizardBodyElement {
  switch (currentStep) {
    case "pdf_upload":
    case "standby":
      return <PaperUploadWizardStandbyBody />;
    case "url_upload":
    default:
      return <PaperUploadWizardURLBody setCurrentStep={setCurrentStep} />;
  }
}

export default function PaperUploadWizardContainer({}: Props): ReactElement<Props> {
  const [{ currentStep }, setComponentState] = useState<State>({
    currentStep: "url_upload",
  });

  const wizardBody = useMemo(
    (): WizardBodyElement =>
      getWizardBody({
        currentStep,
        setCurrentStep: (step: WizardBodyTypes): void =>
          setComponentState({ currentStep: step }),
      }),
    [currentStep]
  );

  return (
    <div className={css(styles.paperUploadWizardContainer)}>
      <div className={css(styles.contentWrap)}>
        <PaperUploadWizardHeader currentStep={currentStep} />
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
  },
  bodyWrap: {
    paddingTop: 32,
  },
  contentWrap: {
    maxWidth: 720,
    width: "100%",
  },
});
