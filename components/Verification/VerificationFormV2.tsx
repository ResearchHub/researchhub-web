import { useState } from "react";
import { VERIFICATION_STEP } from "./lib/types";
import VerificationFormDoiStep from "./VerificationFormDoiStep";
import VerificationFormSuccessStep from "./VerificationFormSuccessStep";

interface VerificationFormProps {
  onStepSelect?: (step: "PROVIDER_STEP" | "PROFILE_STEP") => void;
}

const VerificationForm = ({ onStepSelect }: VerificationFormProps) => {
  const [step, setStep] = useState<VERIFICATION_STEP>("DOI_STEP");

  return (
    <div>
      {step === "DOI_STEP" && <VerificationFormDoiStep />}
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
