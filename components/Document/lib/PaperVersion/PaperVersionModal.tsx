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
import VerifyIdentityBreadcrumbs, {
  ProgressStepperStep,
} from "~/components/shared/ProgressStepper";
import PaperVersionDeclarationStep from "./PaperVersionDeclarationStep";
import { CloseIcon } from "~/config/themes/icons";


interface Args {
  isOpen: boolean;
  closeModal: () => void;
  versions: DocumentVersion[];
}

const stepperSteps: ProgressStepperStep[] = [
  {
    title: "Content",
    number: 1,
    value: "CONTENT",
  },
  {
    title: "Authors",
    number: 2,
    value: "AUTHORS_AND_METADATA",
  },
  {
    title: "Declarations",
    number: 3,
    value: "DECLARATION",
  },
  {
    title: "Preview",
    number: 4,
    value: "PREVIEW",
  },
];

const PaperVersionModal = ({ isOpen, closeModal, versions }: Args) => {
  const alert = useAlert();

  // General State
  const [step, setStep] = useState<STEP>("PREVIEW");
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
      email?: string;
      department?: string;
    }>
  >([]);

  // File upload state
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<Error | null>(null);

  // License state
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedLicense, setAcceptedLicense] = useState(false);
  const [acceptedAuthorship, setAcceptedAuthorship] = useState(false);
  const [acceptedOriginality, setAcceptedOriginality] = useState(false);

  // Add to form state section
  const [changeDescription, setChangeDescription] = useState<string>("");

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

  // Handlers
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
        changeDescription,
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
      case "DECLARATION":
        return (
          acceptedTerms &&
          acceptedLicense &&
          acceptedAuthorship &&
          acceptedOriginality
        );
      default:
        return false;
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      hideClose={true}
      closeModal={() => {
        closeModal();
      }}
      titleStyle={styles.modalTitleStyle}
      zIndex={1000000}
      title={
        <>
          <div className={css(styles.headerContainer)}>
            <span className={css(styles.modalTitle)}>Submit new version</span>
            <CloseIcon
              overrideStyle={styles.closeIcon}
              color={colors.MEDIUM_GREY()}
              onClick={() => closeModal()}
            />
          </div>
          <div className={css(styles.divider)} />
        </>
      }
      modalContentStyle={styles.modalStyle}
    >
      <div className={css(styles.breadcrumbsWrapper)}>
        <VerifyIdentityBreadcrumbs selected={step} steps={stepperSteps} />
      </div>

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
              setUploadError(null);
            }}
            onFileUploadError={(error) => {
              setUploadError(error);
            }}
            fileUploadError={uploadError}
          />
        )}
        {step === "AUTHORS_AND_METADATA" && (
          <PaperVersionAuthorsAndMetadataStep
            authorsAndAffiliations={authorsAndAffiliations}
            setAuthorsAndAffiliations={setAuthorsAndAffiliations}
          />
        )}
        {step === "PREVIEW" && (
          <PaperVersionPreviewStep 
            paper={latestPaper}
            title={title}
            abstract={abstract}
            selectedHubs={selectedHubs}
            authorsAndAffiliations={authorsAndAffiliations}
            changeDescription={changeDescription}
            setChangeDescription={setChangeDescription}
          />
        )}
        {step === "DECLARATION" && (
          <PaperVersionDeclarationStep
            acceptedTerms={acceptedTerms}
            setAcceptedTerms={setAcceptedTerms}
            acceptedLicense={acceptedLicense}
            setAcceptedLicense={setAcceptedLicense}
            acceptedAuthorship={acceptedAuthorship}
            setAcceptedAuthorship={setAcceptedAuthorship}
            acceptedOriginality={acceptedOriginality}
            setAcceptedOriginality={setAcceptedOriginality}
          />
        )}
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
            disabled={ false/*!isCurrentStepValid()*/}
          />
        </div>
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
    marginTop: 35,
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
    padding: 25,
    boxSizing: "border-box",
  },
  modalStyle: {
    width: 650,
    minHeight: 500,
    padding: 0,
  },
  breadcrumbsWrapper: {
    marginTop: 20,
    marginBottom: 20,
  },
  modalTitleStyle: {
    height: "auto",
  },
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 10px",
    marginTop: 0,
    width: "100%",
    textAlign: "center",
    position: "relative",
  },
  modalTitle: {
    fontSize: 20,
    color: "#2A2B2B",
    width: "100%",
    fontWeight: 400,
  },
  closeIcon: {
    cursor: "pointer",
    marginRight: 20,
    position: "absolute",
    right: 20,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#E9EAEB",
  },
});

export default PaperVersionModal;
