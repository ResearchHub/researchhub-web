import React, { useEffect, useState } from "react";
import PersonaReact from "persona-react";
import useCurrentUser from "~/config/hooks/useCurrentUser";

type InterfaceProps = {
  onComplete: ({ status, inquiryId }) => void;
};

const VerificationWithPersonaStep = ({
  onComplete,
}: InterfaceProps): JSX.Element => {
  const [isPersonaLoaded, setIsPersonaLoaded] = useState(false);
  const currentUser = useCurrentUser();

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

  if (!currentUser) {
    // @ts-ignore
    return null;
  }

  return (
    <PersonaReact
      templateId={process.env.WITH_PERSONA_TEMPLATE_ID}
      environmentId={process.env.WITH_PERSONA_ENVIRONMENT_ID}
      referenceId={`${currentUser!.id}`}
      onLoad={() => {
        setIsPersonaLoaded(true);
      }}
      onComplete={({ inquiryId, status }) => {
        // FIXME: Remove temporary console logging
        console.log(`Finished inquiry ${inquiryId} with status ${status}`);
        onComplete({ status, inquiryId });
      }}
    />
  );
};

export default VerificationWithPersonaStep;
