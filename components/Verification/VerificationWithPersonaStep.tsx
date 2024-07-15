import React, { useEffect, useRef, useState } from "react";
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
  const personaWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const applyIframeStyles = () => {

      if (!personaWrapperRef.current) {
        return;
      }

      const iframe = personaWrapperRef.current.querySelector("iframe");
      if (iframe) {
        iframe.style.minHeight = "650px";
        iframe.style.minWidth = "400px";
        iframe.style.width = "100%";
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
    <div ref={personaWrapperRef}>
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
    </div>
  );
};

export default VerificationWithPersonaStep;
