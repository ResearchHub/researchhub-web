import { useState } from "react";
import {
  VERIFICATION_STEP,
  VerificationPaperResult as VerificationPaperResultType,
} from "./lib/types";
import VerificationFormDoiStep from "./VerificationFormDoiStep";
import VerificationFormEmailSentStep from "./VerificationFormEmailSentStep";
import VerificationFormIntroStep from "./VerificationFormIntroStep";
import VerificationFormSelectAuthorStep from "./VerificationFormSelectAuthorStep";

interface VerificationFormProps {
  currentStep: VERIFICATION_STEP;
  onStepSelect?: (step: VERIFICATION_STEP) => void;
  onClose: Function;
}

const VerificationForm = ({
  currentStep,
  onStepSelect,
  onClose,
}: VerificationFormProps) => {
  const [authoredPaper, setAuthoredPaper] =
    useState<VerificationPaperResultType | null>(null);
  const [paperDoi, setPaperDoi] = useState<string | null>(null);

  return (
    <div>
      {currentStep === "INTRO_STEP" && (
        <VerificationFormIntroStep
          nextStep={() => {
            onStepSelect && onStepSelect("DOI_STEP");
          }}
        />
      )}
      {currentStep === "DOI_STEP" && (
        <VerificationFormDoiStep
          setAuthoredPaper={setAuthoredPaper}
          authoredPaper={authoredPaper}
          paperDoi={paperDoi}
          setPaperDoi={setPaperDoi}
          nextStep={() => {
            onStepSelect && onStepSelect("AUTHOR_STEP");
          }}
        />
      )}
      {currentStep === "AUTHOR_STEP" && (
        <VerificationFormSelectAuthorStep
          authoredPaper={authoredPaper}
          nextStep={() => {
            onStepSelect && onStepSelect("EMAIL_SENT_STEP");
          }}
        />
      )}

      {currentStep === "EMAIL_SENT_STEP" && (
        <VerificationFormEmailSentStep onClose={onClose} />
      )}
    </div>
  );
};

export default VerificationForm;
