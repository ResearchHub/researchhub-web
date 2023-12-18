import { useState } from "react";
import { VERIFICATION_STEP } from "./lib/types";
import VerificationFormDoiStep from "./VerificationFormDoiStep";
import VerificationFormSuccessStep from "./VerificationFormSuccessStep";
import { VerificationPaperResult as VerificationPaperResultType } from "./lib/types";
import VerificationFormSelectAuthorStep from "./VerificationFormSelectAuthorStep";

interface VerificationFormProps {
  onStepSelect?: (step: VERIFICATION_STEP) => void;
}

const VerificationForm = ({ onStepSelect }: VerificationFormProps) => {
  const [step, setStep] = useState<VERIFICATION_STEP>("DOI_STEP");
  const [authoredPaper, setAuthoredPaper] = useState<VerificationPaperResultType|null>(null);

  return (
    <div>
      {step === "DOI_STEP" && <VerificationFormDoiStep setAuthoredPaper={setAuthoredPaper} authoredPaper={authoredPaper} nextStep={() => {
        setStep("AUTHOR_STEP");
        onStepSelect && onStepSelect("AUTHOR_STEP");
      }} />}
      {step === "AUTHOR_STEP" && <VerificationFormSelectAuthorStep authoredPaper={authoredPaper} />}
      {/* {step === "ERROR_STEP" && (
        <VerificationFormErrorStep
          error={error}
          onPrevClick={() => setStep("PROVIDER_STEP")}
        />
      )} */}
      {step === "SUCCESS_STEP" && <VerificationFormSuccessStep />}
    </div>
  );
};

export default VerificationForm;
