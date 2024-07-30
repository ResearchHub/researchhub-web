import React, { useEffect, useRef, useState } from "react";
import PersonaReact from "persona-react";
import useCurrentUser from "~/config/hooks/useCurrentUser";

type InterfaceProps = {};

const VerificationWithPersonaStep = ({}: InterfaceProps): JSX.Element => {
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
  console.log(process.env.WITH_PERSONA_ENVIRONMENT_ID);
  return (
    <div ref={personaWrapperRef}>
      <PersonaReact
        templateId={process.env.WITH_PERSONA_TEMPLATE_ID}
        environmentId={process.env.WITH_PERSONA_ENVIRONMENT_ID}
        referenceId={`${currentUser!.id}`}
        fields={{
          nameFirst: currentUser!.firstName,
          nameLast: currentUser!.lastName,
        }}
        onLoad={() => {
          setIsPersonaLoaded(true);
        }}
      />
    </div>
  );
};

export default VerificationWithPersonaStep;
