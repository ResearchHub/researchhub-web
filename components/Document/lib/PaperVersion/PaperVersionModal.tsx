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
import {
  SuggestedAuthor,
  SuggestedInstitution,
} from "~/components/SearchSuggestion/lib/types";
import VerifyIdentityBreadcrumbs, {
  ProgressStepperStep,
} from "~/components/shared/ProgressStepper";
import PaperVersionDeclarationStep from "./PaperVersionDeclarationStep";
import { CloseIcon } from "~/config/themes/icons";
import { MessageActions } from "~/redux/message";
import PaperVersionPublishInJournalIntroStep from "./PaperVersionPublishInJournalIntroStep";
import PaperVersionSuccessStep from "./PaperVersionSuccessStep";
import ClipLoader from "react-spinners/ClipLoader";
import { ACTION } from "./PaperVersionTypes";
import PaperVersionPublishResearchIntroStep from "./PaperVersionPublishResearchIntroStep";
import { loadStripeCheckout } from "~/config/stripe";
const { setMessage, showMessage } = MessageActions;

interface Args {
  isOpen: boolean;
  closeModal: () => void;
  versions?: DocumentVersion[];
  action?: ACTION;
  journalFee?: number;
}

const PaperVersionModal = ({ isOpen, closeModal, versions = [], action = "PUBLISH_RESEARCH", journalFee = 1000 }: Args) => {

  // General State
  const [step, setStep] = useState<STEP>(
    action === "PUBLISH_RESEARCH" 
      ? "INTRO_PUBLISH_RESEARCH" 
      : action === "PUBLISH_IN_JOURNAL" 
        ? "INTRO_PUBLISH_IN_JOURNAL" 
        : "CONTENT"
  );
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
  const [fileName, setFileName] = useState<string | null>(null);

  // License state
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedLicense, setAcceptedLicense] = useState(false);
  const [acceptedAuthorship, setAcceptedAuthorship] = useState(false);
  const [acceptedOriginality, setAcceptedOriginality] = useState(false);

  // Add to form state section
  const [changeDescription, setChangeDescription] = useState<string>(
    action === "PUBLISH_NEW_VERSION" ? "" : "Initial submission"
  );

  // Add state for tracking field errors
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string | null}>({});

  // Add new state for tracking submission
  const [submittedPaperId, setSubmittedPaperId] = useState<number | null>(null);

  // Add new state for tracking submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add new state for tracking payment
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    setTitle(latestPaper?.title || null);
    setSelectedWorkType(latestPaper?.workType || "article");
    setAbstract(latestPaper?.abstract || null);
  }, [latestPaper]);

  useEffect(() => {

    if (action !== "PUBLISH_NEW_VERSION") {
      return;
    }

    (async () => {
      const latestVersion = versions.filter((version) => version.isLatest)[0];
      const rawPaper = await fetchDocumentByType({
        documentType: "paper",
        documentId: latestVersion.paperId,
      });
      const parsed = parsePaper(rawPaper);
      setLatestPaper(parsed);
    })();
  }, [action]);

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
    ...(action === "PUBLISH_RESEARCH" || action === "PUBLISH_IN_JOURNAL" ? [{
      title: "Declarations",
      number: 3,
      value: "DECLARATION",
    }] : []),
    {
      title: "Preview",
      number: action === "PUBLISH_RESEARCH" ? 4 : 3,
      value: "PREVIEW",
    },
  ];

  // Handlers
  const handleNextStep = () => {

    let steps = ORDERED_STEPS;
    if (action === "PUBLISH_RESEARCH") {
      steps = steps.filter((step) => step !== "INTRO_PUBLISH_IN_JOURNAL");
    } else if (action === "PUBLISH_IN_JOURNAL") {
      steps = steps.filter((step) => step !== "INTRO_PUBLISH_RESEARCH");
    } else if (action === "PUBLISH_NEW_VERSION") {
      steps = steps.filter((step) => step !== "DECLARATION");
    }

    const currentIndex = steps.indexOf(step);
    if (currentIndex + 1 < steps.length) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const handlePrevStep = () => {
    const steps = action === "PUBLISH_RESEARCH" 
      ? ORDERED_STEPS 
      : ORDERED_STEPS.filter((step) => step !== "DECLARATION");

    const currentIndex = steps.indexOf(step);
    if (currentIndex - 1 >= 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // For journal submissions, handle payment first
      if (action === "PUBLISH_IN_JOURNAL") {
        setIsProcessingPayment(true);
        
        // Create paper first to get the ID
        const createPaperResponse = await createPaperAPI({
          title: title || "",
          abstract: abstract || "",
          previousPaperId: latestPaper?.id,
          hubIds: selectedHubs.map((hub) => hub.id),
          changeDescription,
          pdfUrl: uploadedFileUrl || "",
          authors: authorsAndAffiliations.map((authorAndAffiliation, index) => ({
            id: authorAndAffiliation.author.id,
            author_position: index === 0 ? "first" : index === authorsAndAffiliations.length - 1 ? "last" : "middle",
            institution_id: authorAndAffiliation.institution.id,
            is_corresponding: authorAndAffiliation.isCorrespondingAuthor,
          })),
          ...(action === "PUBLISH_IN_JOURNAL" || action === "PUBLISH_RESEARCH" ? {
            declarations: [
              {
                declaration_type: "ACCEPT_TERMS_AND_CONDITIONS", 
                accepted: acceptedTerms,
              },
              {
                declaration_type: "AUTHORIZE_CC_BY_4_0",
                accepted: acceptedLicense,
              },
              {
                declaration_type: "CONFIRM_AUTHORS_RIGHTS",
                accepted: acceptedAuthorship,
              },
              {
                declaration_type: "CONFIRM_ORIGINALITY_AND_COMPLIANCE",
                accepted: acceptedOriginality,
              },
            ],
          } : {}),
        });
        setSubmittedPaperId(createPaperResponse.id);

        // Redirect to Stripe checkout
        const stripe = await loadStripeCheckout();
        const result = await stripe?.redirectToCheckout({
          lineItems: [{
            price: String(journalFee),
            quantity: 1,
          }],
          mode: 'payment',
          successUrl: `${window.location.origin}/papers/${createPaperResponse.id}/payment-success`,
          cancelUrl: `${window.location.origin}/papers/${createPaperResponse.id}/payment-cancelled`,
          clientReferenceId: createPaperResponse.id.toString(),
        });

        if (result?.error) {
          throw new Error(result.error.message);
        }

        return; // Stop here as we're redirecting
      }

      setStep("SUCCESS");
    } catch (e) {
      alert('error')
    } finally {
      setIsSubmitting(false);
      setIsProcessingPayment(false);
    }
  };

  const showBackButton = step !== "CONTENT";

  // Replace isCurrentStepValid with validateCurrentStep
  const validateCurrentStep = (): boolean => {
    switch (step) {
      case "CONTENT":
        const contentErrors = {
          title: !title ? "Title is required" : null,
          abstract: !abstract ? "Abstract is required" : null,
          hubs: selectedHubs.length === 0 ? "Please select at least one hub" : null,
          file: !uploadedFileUrl ? "Please upload a file" : null,
        };
        setFieldErrors(contentErrors);
        return !Object.values(contentErrors).some(Boolean);
        
      case "AUTHORS_AND_METADATA":
        const authorErrors = {
          authors: authorsAndAffiliations.length === 0 
            ? "Add at least one author" 
            : null,
        };
        setFieldErrors(authorErrors);
        return !Object.values(authorErrors).some(Boolean);
        
      case "DECLARATION":
        if (action === "PUBLISH_NEW_VERSION") return true;
        
        const declarationErrors = {
          terms: !acceptedTerms ? "Please accept the terms and conditions" : null,
          license: !acceptedLicense ? "Please accept the license agreement" : null,
          authorship: !acceptedAuthorship ? "Please confirm authorship" : null,
          originality: !acceptedOriginality ? "Please confirm originality" : null,
        };
        setFieldErrors(declarationErrors);
        return !Object.values(declarationErrors).some(Boolean);
        
      case "PREVIEW":
        const previewErrors = {
          changeDescription: !changeDescription?.trim() 
            ? "Please describe the changes made in this version" 
            : null
        };
        setFieldErrors(previewErrors);
        return !Object.values(previewErrors).some(Boolean);
        
      default:
        return false;
    }
  };

  // Update the button click handler
  const handleNextOrSubmit = () => {
    if (validateCurrentStep()) {
      if (step === "PREVIEW") {
        handleSubmit();
      } else {
        handleNextStep();
      }
    }
  };

  // Update handlers to clear errors when fields change
  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (fieldErrors.title) {
      setFieldErrors(prev => ({ ...prev, title: null }));
    }
  };

  const handleAbstractChange = (value: string) => {
    setAbstract(value);
    if (fieldErrors.abstract) {
      setFieldErrors(prev => ({ ...prev, abstract: null }));
    }
  };

  const handleHubsChange = (hubs: Hub[]) => {
    setSelectedHubs(hubs);
    if (fieldErrors.hubs) {
      setFieldErrors(prev => ({ ...prev, hubs: null }));
    }
  };

  const handleFileUpload = (objectKey: string, absoluteUrl: string, fileName: string) => {
    setUploadedFileUrl(absoluteUrl);
    setFileName(fileName);
    setUploadError(null);
    if (fieldErrors.file) {
      setFieldErrors(prev => ({ ...prev, file: null }));
    }
  };

  // Add handlers for each checkbox that clear their respective errors
  const handleTermsChange = (accepted: boolean) => {
    setAcceptedTerms(accepted);
    if (fieldErrors.terms) {
      setFieldErrors(prev => ({ ...prev, terms: null }));
    }
  };

  const handleLicenseChange = (accepted: boolean) => {
    setAcceptedLicense(accepted);
    if (fieldErrors.license) {
      setFieldErrors(prev => ({ ...prev, license: null }));
    }
  };

  const handleAuthorshipChange = (accepted: boolean) => {
    setAcceptedAuthorship(accepted);
    if (fieldErrors.authorship) {
      setFieldErrors(prev => ({ ...prev, authorship: null }));
    }
  };

  const handleOriginalityChange = (accepted: boolean) => {
    setAcceptedOriginality(accepted);
    if (fieldErrors.originality) {
      setFieldErrors(prev => ({ ...prev, originality: null }));
    }
  };

  // Add handler to clear error when description changes
  const handleChangeDescriptionUpdate = (value: string) => {
    setChangeDescription(value);
    if (fieldErrors.changeDescription) {
      setFieldErrors(prev => ({ ...prev, changeDescription: null }));
    }
  };

  // Update button label based on payment state
  const getButtonLabel = () => {
    if (isSubmitting) {
      return (
        <div className={css(styles.loadingContainer)}>
          <ClipLoader size={20} color="#fff" />
        </div>
      );
    }
    if (step === "PREVIEW") {
      return action === "PUBLISH_IN_JOURNAL" 
        ? `Continue to Payment ($${journalFee})` 
        : "Submit";
    }
    return "Continue";
  };

  return (
    <BaseModal
      isOpen={isOpen}
      hideClose={true}
      closeModal={() => {
        closeModal();
      }}
      modalStyle={action === "PUBLISH_IN_JOURNAL" ? styles.journalModalStyle : undefined}
      titleStyle={styles.modalTitleStyle}
      zIndex={100000000}
      title={
        !["INTRO_PUBLISH_IN_JOURNAL", "INTRO_PUBLISH_RESEARCH"].includes(step) && (
        <>
          <div className={css(styles.headerContainer)}>
            <span className={css(styles.modalTitle)}>
              {action === "PUBLISH_RESEARCH" 
                ? "Submit research"
                : action === "PUBLISH_IN_JOURNAL" 
                  ? "Submit to journal" 
                  : "Submit new version"}
            </span>
            <CloseIcon
              // @ts-ignore
              overrideStyle={styles.closeIcon}
              color={colors.MEDIUM_GREY()}
              onClick={() => closeModal()}
            />
            </div>
            <div className={css(styles.divider)} />
          </>
        )
      }
      modalContentStyle={styles.modalStyle}
    >
        {!["INTRO_PUBLISH_IN_JOURNAL", "INTRO_PUBLISH_RESEARCH", "SUCCESS"].includes(step) && (
          <div className={css(styles.breadcrumbsWrapper)}>
            <VerifyIdentityBreadcrumbs selected={step} steps={stepperSteps} />
          </div>
        )}

      <div className={css(styles.modalBody, step === "INTRO_PUBLISH_IN_JOURNAL" && styles.slideIntro)}>
        {step === "INTRO_PUBLISH_IN_JOURNAL" && (
          <PaperVersionPublishInJournalIntroStep onStart={handleNextStep} />
        )}
        {step === "INTRO_PUBLISH_RESEARCH" && (
          <PaperVersionPublishResearchIntroStep onStart={handleNextStep} />
        )}
        {step === "CONTENT" && (
          <PaperVersionContentStep
            fieldErrors={fieldErrors}
            abstract={abstract}
            selectedHubs={selectedHubs}
            title={title}
            fileName={fileName}
            selectedWorkType={selectedWorkType}
            setAbstract={handleAbstractChange}
            setSelectedHubs={handleHubsChange}
            setTitle={handleTitleChange}
            setSelectedWorkType={setSelectedWorkType}
            onFileUpload={handleFileUpload}
            onFileUploadError={(error) => {
              setUploadError(error);
            }}
            fileUploadError={uploadError}
          />
        )}
        {step === "AUTHORS_AND_METADATA" && (
          <PaperVersionAuthorsAndMetadataStep
            authorsAndAffiliations={authorsAndAffiliations}
            setAuthorsAndAffiliations={(authors) => {
              setAuthorsAndAffiliations(authors);
              if (fieldErrors.authors) {
                setFieldErrors(prev => ({ ...prev, authors: null }));
              }
            }}
            error={fieldErrors.authors}
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
            setChangeDescription={handleChangeDescriptionUpdate}
            error={fieldErrors.changeDescription}
          />
        )}
        {step === "DECLARATION" &&  (
          <PaperVersionDeclarationStep
            acceptedTerms={acceptedTerms}
            setAcceptedTerms={handleTermsChange}
            acceptedLicense={acceptedLicense}
            setAcceptedLicense={handleLicenseChange}
            acceptedAuthorship={acceptedAuthorship}
            setAcceptedAuthorship={handleAuthorshipChange}
            acceptedOriginality={acceptedOriginality}
            setAcceptedOriginality={handleOriginalityChange}
            fieldErrors={fieldErrors}
          />
        )}
        {step === "SUCCESS" && submittedPaperId && (
          <PaperVersionSuccessStep
            paperId={submittedPaperId}
            paperTitle={title || ""}
          />
        )}
      </div>
      {step !== "INTRO_PUBLISH_IN_JOURNAL" && step !== "INTRO_PUBLISH_RESEARCH" && step !== "SUCCESS" && (
        <div
          className={css(
            styles.buttonWrapper,
            showBackButton && styles.buttonWrapperWithBack
          )}
        >
          {showBackButton  && (
            <div style={{ marginLeft: -10 }}>
              <Button onClick={() => handlePrevStep()} variant="text">
                <div className={css(styles.buttonWithIcon, styles.backButton)}>
                  <FontAwesomeIcon icon={faArrowLeft} />
                  Back
                </div>
              </Button>
            </div>
          )}
          <Button
            label={getButtonLabel()}
            onClick={handleNextOrSubmit}
            theme="solidPrimary"
            disabled={isSubmitting || isProcessingPayment}
          />
        </div>
      )}
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  slideIntro: {
    background: "#eaf1ff"
  },
  journalModalStyle: {
    borderRadius: 4,
    border: `3px solid ${colors.NEW_BLUE()}`,
  },
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
    padding: "15px 25px",
    boxSizing: "border-box",
    borderTop: `1px solid rgb(202, 202, 203)`,
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
    marginTop: 30,
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
    fontSize: 18,
    color: "#2A2B2B",
    width: "100%",
    fontWeight: 500,
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
    backgroundColor: "rgb(202, 202, 203)",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 26, // Match the height of the text
    width: 60,
  },
});

export default PaperVersionModal;
