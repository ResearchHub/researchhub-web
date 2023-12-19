import { useState } from "react";
import {
  VERIFICATION_STEP,
  VerificationPaperResult as VerificationPaperResultType,
} from "./lib/types";
import VerificationFormDoiStep from "./VerificationFormDoiStep";
import VerificationFormSuccessStep from "./VerificationFormSuccessStep";
import VerificationFormSelectAuthorStep from "./VerificationFormSelectAuthorStep";

interface VerificationFormProps {
  currentStep: VERIFICATION_STEP;
  onStepSelect?: (step: VERIFICATION_STEP) => void;
}

const VerificationForm = ({
  currentStep,
  onStepSelect,
}: VerificationFormProps) => {
  const [authoredPaper, setAuthoredPaper] =
    useState<VerificationPaperResultType | null>(null);
  const [paperDoi, setPaperDoi] = useState<string | null>(null);

  return (
    <div>
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
            onStepSelect && onStepSelect("SUCCESS_STEP");
          }}
        />
      )}
      {/* {step === "ERROR_STEP" && (
        <VerificationFormErrorStep
          error={error}
          onPrevClick={() => setStep("PROVIDER_STEP")}
        />
      )} */}
      {/* {step === "SUCCESS_STEP" && <VerificationFormSuccessStep />} */}
    </div>
  );
};

export default VerificationForm;
