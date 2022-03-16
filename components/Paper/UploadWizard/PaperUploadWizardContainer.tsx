import { Element, ReactElement, useMemo, useState } from "react";
import PaperUploadURLBody from "./PaperUploadURLBody";

type Props = {};
type State = {
  currentStep: WizardBodyTypes;
};
type WizardBodyTypes = "pdf_upload" | "standby" | "url_upload";
type WizardBodyElements = ReactElement<typeof PaperUploadURLBody>;

function getWizardBody(currentStep: WizardBodyTypes): WizardBodyElements {
  switch (currentStep) {
    case "url_upload":
    default:
      return <PaperUploadURLBody />;
  }
}

export default function PaperUploadWizardContainer({}: Props): Element<Props> {
  const [{ currentStep }, setCurrentStep] = useState<State>({
    currentStep: "url_upload",
  });

  const wizardBody = useMemo(() => getWizardBody(currentStep), [currentStep]);

  return <div>{wizardBody}</div>;
}
