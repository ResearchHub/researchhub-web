import React, { useEffect, useState } from "react";
import PersonaReact from "persona-react";

type InterfaceProps = {
  nextStep: () => void;
};

const VerificationWithPersonaStep = ({
  nextStep,
}: InterfaceProps): JSX.Element => {
  const [isPersonaLoaded, setIsPersonaLoaded] = useState(false);

  useEffect(() => {
    const applyIframeStyles = () => {
      const iframe = document.querySelector("iframe");
      if (iframe) {
        iframe.style.minHeight = "650px";
        iframe.style.minWidth = "400px";
      }
    };
    if (isPersonaLoaded) {
      applyIframeStyles();
    }
  }, [isPersonaLoaded]);

  return (
    <PersonaReact
      templateId={process.env.WITH_PERSONA_TEMPLATE_ID}
      environmentId={process.env.WITH_PERSONA_ENVIRONMENT_ID}
      referenceId="my-reference-id-1"
      onLoad={() => {
        setIsPersonaLoaded(true);
      }}
      onComplete={({ inquiryId, status }) => {
        // FIXME: Remove temporary console logging
        console.log(`Finished inquiry ${inquiryId} with status ${status}`);
        nextStep();
      }}
    />
  );
};

export default VerificationWithPersonaStep;
