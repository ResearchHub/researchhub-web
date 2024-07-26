import { StyleSheet, css } from "aphrodite";
import BaseModal from "../Modals/BaseModal";
import colors from "~/config/themes/colors";
import { useState } from "react";
import ProgressStepper, {
  ProgressStepperStep,
} from "../shared/ProgressStepper";
import Button from "../Form/Button";
import IconButton from "~/components/Icons/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faInfoCircle as faInfoCircleLight,
} from "@fortawesome/pro-light-svg-icons";
import { submitRewardsClaim } from "./lib/api";
import useCurrentUser from "~/config/hooks/useCurrentUser";
import { ID } from "~/config/types/root_types";

interface Props {
  isOpen: boolean;
  paperId: ID;
  closeModal: () => void;
}

export type STEP =
  | "INTRO"
  | "OPEN_ACCESS"
  | "OPEN_DATA"
  | "PREREGRISTRATION"
  | "CLAIM_SUBMITTED";

export const ORDERED_STEPS: STEP[] = [
  "INTRO",
  "OPEN_ACCESS",
  "OPEN_DATA",
  "PREREGRISTRATION",
  "CLAIM_SUBMITTED",
];

const stepperSteps: ProgressStepperStep[] = [
  {
    title: "Open Access",
    number: 1,
    value: "OPEN_ACCESS",
  },
  {
    title: "Open Data",
    number: 2,
    value: "OPEN_DATA",
  },
  {
    title: "Preregistration",
    number: 3,
    value: "PREREGRISTRATION",
  },
];

const ClaimRewardsModal = ({ paperId, isOpen, closeModal }: Props) => {
  const [step, setStep] = useState<STEP>("INTRO");
  const currentUser = useCurrentUser()

  const handleSubmitClaim = () => {

    if (!currentUser) {
      return;
    }

    // @ts-ignore Temporarily ignoring due to hard-coding 
    submitRewardsClaim({
      paperId,
      authorshipId: 1762,
      userId: currentUser.id,
    })
  };

  const currentStepPos = ORDERED_STEPS.indexOf(step);
  return (
    <BaseModal
      isOpen={isOpen}
      hideClose={false}
      closeModal={closeModal}
      zIndex={1000000}
      modalContentStyle={styles.modalStyle}
    >
      <div>
        {step !== "CLAIM_SUBMITTED" && (
          <div className={css(styles.breadcrumbsWrapper)}>
            <ProgressStepper selected={step} steps={stepperSteps} />
          </div>
        )}

        {currentStepPos > 0 && (
          <IconButton overrideStyle={styles.backButton}>
            <FontAwesomeIcon
              icon={faArrowLeft}
              onClick={() => {
                const prevStep = ORDERED_STEPS[currentStepPos - 1];
                setStep(prevStep);
              }}
            />
          </IconButton>
        )}

        {step === "INTRO" && (
          <>
            <div className={css(styles.slide)}>Intro placeholder</div>
            <Button
              fullWidth
              onClick={() => setStep("OPEN_ACCESS")}
              theme="solidPrimary"
              style={{ width: 200, margin: "20px auto" }}
            >
              Start
            </Button>
          </>
        )}
        {step === "OPEN_ACCESS" && (
          <>
            <div className={css(styles.slide)}>Open Access placeholder</div>
            <Button
              fullWidth
              onClick={() => setStep("OPEN_DATA")}
              theme="solidPrimary"
              style={{ width: 200, margin: "20px auto" }}
            >
              Next
            </Button>
          </>
        )}
        {step === "OPEN_DATA" && (
          <>
            <div className={css(styles.slide)}>Open data placeholder</div>
            <Button
              fullWidth
              onClick={() => setStep("PREREGRISTRATION")}
              theme="solidPrimary"
              style={{ width: 200, margin: "20px auto" }}
            >
              Next
            </Button>
          </>
        )}
        {step === "PREREGRISTRATION" && (
          <>
            <div className={css(styles.slide)}>preregistration placeholder</div>
            <Button
              fullWidth
              onClick={() => handleSubmitClaim()}
              theme="solidPrimary"
              style={{ width: 200, margin: "20px auto" }}
            >
              Submit
            </Button>
          </>
        )}
      </div>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  slide: {
    minHeight: 300,
    textAlign: "center",
    fontSize: 18,
  },
  modalStyle: {
    padding: "20px 20px",
    width: 550,
  },
  modalContentStyle: {
    padding: "10px 20px",
  },
  breadcrumbsWrapper: {
    marginTop: 20,
    marginBottom: 20,
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: 7,
    fontSize: 20,
    cursor: "pointer",
  },
});

export default ClaimRewardsModal;
