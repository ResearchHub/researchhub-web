import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";
import { ReactElement, useMemo, useState } from "react";
import { ROUTES as WS_ROUTES } from "~/config/ws";
import { WizardBodyTypes } from "./types/PaperUploadWizardTypes";
import PaperUploadWizardHeader from "./PaperUploadWizardHeader";
import PaperUploadWizardStandbyBody from "./PaperUploadWizardStandbyBody";
import PaperUploadWizardURLBody from "./PaperUploadWizardURLBody";
import { NextRouter, useRouter } from "next/router";

type Props = { onExit: () => void };
type State = {
  currentStep: WizardBodyTypes;
};
type WizardBodyElement = ReactElement<typeof PaperUploadWizardURLBody>;

function getWizardBody({
  currentStep,
  onExit,
  setCurrentStep,
  router,
}: {
  currentStep: WizardBodyTypes;
  onExit: () => void;
  setCurrentStep: (step: WizardBodyTypes) => void;
  router: NextRouter;
}): WizardBodyElement {
  switch (currentStep) {
    case "pdf_upload":
    case "standby":
      return (
        // @ts-ignore legacy socket hook
        <PaperUploadWizardStandbyBody
          onExit={onExit}
          wsAuth={true}
          wsUrl={WS_ROUTES.PAPER_SUBMISSION(53)}
        />
      );
    case "url_upload":
    default:
      return (
        <PaperUploadWizardURLBody
          setCurrentStep={setCurrentStep}
          onExit={onExit}
        />
      );
  }
}

export default function PaperUploadWizardContainer({
  onExit,
}: Props): ReactElement<Props> {
  const router = useRouter();
  const [{ currentStep }, setComponentState] = useState<State>({
    currentStep: "url_upload",
  });

  const wizardBody = useMemo(
    (): WizardBodyElement =>
      getWizardBody({
        currentStep,
        setCurrentStep: (step: WizardBodyTypes): void =>
          setComponentState({ currentStep: step }),
        onExit,
        router,
      }),
    [currentStep, router.query]
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
    height: "100%",
    minWidth: "600px",
    [`@media only screen and (max-width: ${breakpoints.small})`]: {
      minWidth: "0",
      padding: "16px 0 0",
    },
  },
  bodyWrap: {},
  contentWrap: {
    maxWidth: 720,
    width: "100%",
  },
});
