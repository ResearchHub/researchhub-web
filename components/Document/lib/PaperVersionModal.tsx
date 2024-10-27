import { useEffect, useState } from "react";
import BaseModal from "~/components/Modals/BaseModal";
import { StyleSheet, css } from "aphrodite";
import { fetchDocumentByType } from "./fetchDocumentByType";
import { useRouter } from "next/router";
import { Paper, parsePaper } from "./types";

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
  const router = useRouter();
  const [paper, setPaper] = useState<Paper | null>(null);
  const handleNext = () => {

  }

  useEffect(() => {
    const { documentId } = router.query;
    (async () => {
      const rawPaper = await fetchDocumentByType({ documentType: "paper", documentId });
      const parsed = parsePaper(rawPaper);
      setPaper(parsed);
    })();

  }, [])


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