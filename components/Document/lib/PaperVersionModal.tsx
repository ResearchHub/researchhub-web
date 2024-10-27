import { useState } from "react";
import BaseModal from "~/components/Modals/BaseModal";
import { StyleSheet, css } from "aphrodite";

interface Args {
  isOpen: boolean;
  closeModal: () => void;
}

export type STEP =
  | "CONTENT"
  | "AUTHORS_AND_METADATA"
  | "DECLARATIONS"
  | "PREVIEW"

  export const ORDERED_STEPS: STEP[] = [
    "CONTENT",
    "AUTHORS_AND_METADATA",
    "DECLARATIONS",
    "PREVIEW",
  ];

const PaperVersionModal = ({ isOpen, closeModal }: Args) => {
  const [step, setStep] = useState<STEP>("CONTENT");
  const handleNext = () => {

  }

  return (
    <BaseModal
      isOpen={isOpen}
      hideClose={false}
      closeModal={() => {
        closeModal();
      }}
      zIndex={1000000}
      modalContentStyle={styles.modalStyle}
    >
      <div>

        {step === "CONTENT" && (
          <ContentStep />
        )}

      </div>
    </BaseModal>
  )
}

const ContentStep = () => {
  return (
    <div>
      Content Step
    </div>
  )
}

const styles = StyleSheet.create({
  modalStyle: {
    
  }
})

export default PaperVersionModal;