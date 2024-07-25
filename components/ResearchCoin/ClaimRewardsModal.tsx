import { StyleSheet, css } from "aphrodite";
import BaseModal from "../Modals/BaseModal";
import colors from "~/config/themes/colors";
import { useState } from "react";
import { STEP } from "./ClaimRewardsForm";
import ProgressStepper, {
  ProgressStepperStep,
} from "../shared/ProgressStepper";

interface Props {
  isOpen: boolean;
  closeModal: () => void;
}

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
    value: "PREREGISTRATION",
  },
];

const ClaimRewardsModal = ({ isOpen, closeModal }: Props) => {
  const [step, setStep] = useState<STEP>("INTRO");

  return (
    <BaseModal
      isOpen={isOpen}
      hideClose={false}
      closeModal={closeModal}
      zIndex={1000000}
      modalContentStyle={styles.modalStyle}
    >
      {step !== "CLAIM_SUBMITTED" && (
        <div className={css(styles.breadcrumbsWrapper)}>
          <ProgressStepper selected={step} steps={stepperSteps} />
        </div>
      )}
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  modalStyle: {
    padding: "20px 20px",
    width: 550,
  },
  modalContentStyle: {
    padding: "10px 20px",
  },
  breadcrumbsWrapper: {
    marginTop: 20,
  },
});

export default ClaimRewardsModal;
