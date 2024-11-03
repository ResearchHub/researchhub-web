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
import PaperVersionPreviewStep from "./PaperVersionPreviewStep";
import { createPaperAPI } from "../../api/createPaperAPI";
import { Hub } from "~/config/types/hub";
import { useAlert } from "react-alert";
import {
  SuggestedAuthor,
  SuggestedInstitution,
} from "~/components/SearchSuggestion/lib/types";

interface Args {
  isOpen: boolean;
  closeModal: () => void;
  versions: DocumentVersion[];
}

const PaperVersionModal = ({ isOpen, closeModal, versions }: Args) => {
  const alert = useAlert();

  // State
  const [step, setStep] = useState<STEP>("CONTENT");
  const [latestPaper, setLatestPaper] = useState<Paper | null>(null);

  // Form state
  const [title, setTitle] = useState<null | string>(null);
  const [selectedWorkType, setSelectedWorkType] =
    useState<WORK_TYPE>("article");
  const [abstract, setAbstract] = useState<null | string>(null);
  const [selectedHubs, setSelectedHubs] = useState<Hub[]>([]);
  const [authorsAndAffiliations, setAuthorsAndAffiliations] = useState<
    Array<{
      author: SuggestedAuthor;
      institution: SuggestedInstitution;
      isCorrespondingAuthor: boolean;
    }>
  >([]);

  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);

  useEffect(() => {
    setTitle(latestPaper?.title || null);
    setSelectedWorkType(latestPaper?.workType || "article");
    setAbstract(latestPaper?.abstract || null);
  }, [latestPaper]);

  useEffect(() => {
    (async () => {
      const latestVersion = versions.filter((version) => version.isLatest)[0];
      const rawPaper = await fetchDocumentByType({
        documentType: "paper",
        documentId: latestVersion.paperId,
      });
      const parsed = parsePaper(rawPaper);
      setLatestPaper(parsed);
    })();
  }, []);

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

  const handleSubmit = async () => {
    if (false /* FIXME */) {
      alert.show({
        // @ts-ignore
        text: (
          <div>
            <span style={{ fontSize: 16, marginBottom: 10 }}>
              Please correct the following
            </span>
            <ul style={{ fontSize: 14, paddingLeft: 20 }}>
              {(title || "").length === 0 && <li>Title is missing</li>}
              {(abstract || "").length === 0 && <li>Abstract is missing</li>}
              {selectedHubs.length === 0 && (
                <li>At least one hub is required</li>
              )}
              {authorsAndAffiliations.length === 0 && (
                <li>At least one author is required</li>
              )}
              {!uploadedFileUrl && <li>PDF file is required</li>}
            </ul>
          </div>
        ),
        buttonText: "OK",
      });
      return;
    }

    try {
      await createPaperAPI({
        title,
        abstract,
        previousPaperId: latestPaper?.id,
        hubIds: selectedHubs.map((hub) => hub.id),
        changeDescription: "New version",
        authors: authorsAndAffiliations.map((authorAndAffiliation) => ({
          id: authorAndAffiliation.author.id,
          author_position: "middle",
          institution_id: authorAndAffiliation.institution.id,
          is_corresponding: authorAndAffiliation.isCorrespondingAuthor,
        })),
      });
    } catch (e) {
      alert.show({
        // @ts-ignore
        text: "Failed to submit research paper",
      });
    }
  };

  const showBackButton = step !== "CONTENT";

  const isCurrentStepValid = () => {
    switch (step) {
      case "CONTENT":
        return (
          title && 
          title.length > 0 && 
          abstract && 
          abstract.length > 0 && 
          selectedHubs.length > 0 &&
          uploadedFileUrl
        );
      case "AUTHORS_AND_METADATA":
        return authorsAndAffiliations.length > 0;
      case "PREVIEW":
        return true;
      default:
        return false;
    }
  };

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
        {step === "CONTENT" && (
          <PaperVersionContentStep
            abstract={abstract}
            selectedHubs={selectedHubs}
            title={title}
            selectedWorkType={selectedWorkType}
            setAbstract={setAbstract}
            setSelectedHubs={setSelectedHubs}
            setTitle={setTitle}
            setSelectedWorkType={setSelectedWorkType}
            onFileUpload={(objectKey, absoluteUrl) => {
              setUploadedFileUrl(absoluteUrl);
            }}
          />
        )}
        {step === "AUTHORS_AND_METADATA" && (
          <PaperVersionAuthorsAndMetadataStep
            authorsAndAffiliations={authorsAndAffiliations}
            setAuthorsAndAffiliations={setAuthorsAndAffiliations}
          />
        )}
        {step === "PREVIEW" && <PaperVersionPreviewStep paper={latestPaper} />}
      </div>

      <div
        className={css(
          styles.buttonWrapper,
          showBackButton && styles.buttonWrapperWithBack
        )}
      >
        {showBackButton && (
          <Button onClick={() => handlePrevStep()} variant="text">
            <div className={css(styles.buttonWithIcon, styles.backButton)}>
              <FontAwesomeIcon icon={faArrowLeft} />
              Back
            </div>
          </Button>
        )}
        <Button
          label={step === "PREVIEW" ? "Submit" : "Next"}
          onClick={() =>
            step === "PREVIEW" ? handleSubmit() : handleNextStep()
          }
          theme="solidPrimary"
          disabled={!isCurrentStepValid()}
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
    color: colors.MEDIUM_GREY2(),
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
