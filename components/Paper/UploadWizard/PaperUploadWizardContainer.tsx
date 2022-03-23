import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";
import { ID } from "~/config/types/root_types";
import { ReactElement, useMemo, useState } from "react";
import { ROUTES as WS_ROUTES } from "~/config/ws";
import { WizardBodyTypes } from "./types/PaperUploadWizardTypes";
import PaperUploadWizardHeader from "./PaperUploadWizardHeader";
import PaperUploadWizardStandbyBody from "./PaperUploadWizardStandbyBody";
import PaperUploadWizardUpdatePaper from "./PaperUploadWizardUpdatePaper";
import PaperUploadWizardURLBody from "./PaperUploadWizardURLBody";

type Props = { onExit: () => void };
type State = {
  currentStep: WizardBodyTypes;
};
type WizardBodyElement = ReactElement<typeof PaperUploadWizardURLBody>;

function getWizardBody({
  currentStep,
  onExit,
  postedPaperID,
  setPostedPaperID,
  setWizardStep,
}: {
  currentStep: WizardBodyTypes;
  postedPaperID: ID;
  onExit: () => void;
  setPostedPaperID: (id: ID) => void;
  setWizardStep: (step: WizardBodyTypes) => void;
}): WizardBodyElement {
  switch (currentStep) {
    case "pdf_upload":
    case "posted_paper_update":
      return (
        <PaperUploadWizardUpdatePaper onExit={onExit} paperID={postedPaperID} />
      );
    case "standby":
      return (
        // @ts-ignore legacy socket hook
        <PaperUploadWizardStandbyBody
          onExit={onExit}
          setPostedPaperID={setPostedPaperID}
          setWizardStep={setWizardStep}
          wsAuth
          wsUrl={WS_ROUTES.PAPER_SUBMISSION(1)}
        />
      );
    case "url_upload":
    default:
      return (
        <PaperUploadWizardURLBody
          onExit={onExit}
          setWizardStep={setWizardStep}
        />
      );
  }
}

export default function PaperUploadWizardContainer({
  onExit,
}: Props): ReactElement<Props> {
  const [{ currentStep }, setComponentState] = useState<State>({
    currentStep: "url_upload",
  });
  const [postedPaperID, setPostedPaperID] = useState<ID>(null);

  const wizardBody = useMemo(
    (): WizardBodyElement =>
      getWizardBody({
        currentStep,
        onExit,
        postedPaperID,
        setPostedPaperID,
        setWizardStep: (step: WizardBodyTypes): void =>
          setComponentState({ currentStep: step }),
      }),
    [currentStep]
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
