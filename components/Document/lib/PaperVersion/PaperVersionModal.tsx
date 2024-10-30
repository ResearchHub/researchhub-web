import { useEffect, useState } from "react";
import BaseModal from "~/components/Modals/BaseModal";
import { StyleSheet, css } from "aphrodite";
import { fetchDocumentByType } from "../fetchDocumentByType";
import { DocumentVersion, Paper, parsePaper, WORK_TYPE } from "../types";
import Button from "~/components/Form/Button";
import PaperVersionContentStep from "./PaperVersionContentStep";
import { ORDERED_STEPS, STEP } from "./PaperVersionTypes";
import PaperVersionAuthorsAndMetadataStep from "./PaperVersionAuthorsAndMetadataStep";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/pro-solid-svg-icons";
import colors from "~/config/themes/colors";


interface Args {
  isOpen: boolean;
  closeModal: () => void;
  versions: DocumentVersion[];
}

const PaperVersionModal = ({ isOpen, closeModal, versions }: Args) => {
  const [step, setStep] = useState<STEP>("AUTHORS_AND_METADATA");
  const [latestPaper, setLatestPaper] = useState<Paper | null>(null);

  const handleNextStep = () => {
    const currentIndex = ORDERED_STEPS.indexOf(step);
    if (currentIndex + 1 < ORDERED_STEPS.length) {
      setStep(ORDERED_STEPS[currentIndex + 1]);
    }
  };

  const handlePrevStep = () => {
    const currentIndex = ORDERED_STEPS.indexOf(step);
    if (currentIndex - 1 >= 0) {
      setStep(ORDERED_STEPS[currentIndex - 1]);
    }
  };

  useEffect(() => {
    (async () => {
      const latestVersion = versions.filter((version) => version.isLatest)[0];
      const rawPaper = await fetchDocumentByType({
        documentType: "paper",
        documentId: latestVersion.id,
      });
      const parsed = parsePaper(rawPaper);
      setLatestPaper(parsed);
    })();
  }, []);

  const showBackButton = step !== "CONTENT";

  return (
    <BaseModal
      isOpen={isOpen}
      hideClose={false}
      closeModal={() => {
        closeModal();
      }}
      zIndex={1000000}
      title={"Submit new version"}
      modalContentStyle={styles.modalStyle}
    >
      <div className={css(styles.modalBody)}>
        {step === "CONTENT" && <PaperVersionContentStep paper={latestPaper} />}
        {step === "AUTHORS_AND_METADATA" && <PaperVersionAuthorsAndMetadataStep paper={latestPaper} />}
      </div>


      <div className={css(styles.buttonWrapper, showBackButton && styles.buttonWrapperWithBack )}>
        {showBackButton && (
          <Button
            onClick={() => handlePrevStep()}
            variant="text"
          >
            <div className={css(styles.buttonWithIcon, styles.backButton)}>
              <FontAwesomeIcon icon={faArrowLeft} />
              Back
            </div>
          </Button>
        )}
        <Button
          label={"Next"}
          onClick={() => handleNextStep()}
          theme="solidPrimary"
        />
      </div>

    </BaseModal>
  );
};



const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
  },
  inputWrapper: {},
  textArea: {
    maxHeight: 300,
    minHeight: 100,
  },
  buttonWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
  },
  buttonWithIcon: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  buttonWrapperWithBack: {
    justifyContent: "space-between",
  },
  backButton: {
    color: colors.MEDIUM_GREY2()
  },
  modalBody: {
    width: "100%",
  },
  modalStyle: {
    width: 650,
    minHeight: 500,
  },
});

export default PaperVersionModal;
