import BaseModal from "../Modals/BaseModal";
import { useState } from "react";
import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";
import IconButton from "../Icons/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/pro-light-svg-icons";
import { CloseIcon } from "~/config/themes/icons";
import AddPublicationsForm, {
  STEP,
  ORDERED_STEPS,
} from "../Author/Profile/AddPublicationsForm";
import { authorProfileContext } from "../Author/lib/AuthorProfileContext";
import { ROUTES as WS_ROUTES } from "~/config/ws";
import { useSelector } from "react-redux";

const AddPublicationModal = ({ children }) => {
  const [step, setStep] = useState<STEP>("DOI");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { setIsLoadingPublications } = authorProfileContext();
  const auth = useSelector((state: any) => state.auth);

  const handleStepChange = ({ step }) => {
    setStep(step);
    if (step === "FINISHED") {
      setIsLoadingPublications(true);
      handleModalClose();
    }
  };

  const handleModalClose = () => {
    setIsOpen(false);
    setStep("DOI");
  };

  return (
    <>
      <div onClick={() => setIsOpen(!isOpen)}>{children}</div>
      <BaseModal
        isOpen={isOpen}
        hideClose={true}
        closeModal={() => setIsOpen(false)}
        zIndex={1000000001}
        modalContentStyle={styles.modalStyle}
        titleStyle={styles.modalTitle}
        title={
          <div className={css(styles.titleWrapper)}>
            {step == "RESULTS" ||
              (step == "NEEDS_AUTHOR_CONFIRMATION" && (
                <IconButton overrideStyle={styles.backButton}>
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    onClick={() => {
                      const indexOfCurrentStep = ORDERED_STEPS.indexOf(step);
                      if (indexOfCurrentStep > 0) {
                        setStep(ORDERED_STEPS[indexOfCurrentStep - 1]);
                      }
                    }}
                  />
                </IconButton>
              ))}
            <span>Add Publications</span>
            <CloseIcon
              // @ts-ignore
              overrideStyle={styles.close}
              color={colors.MEDIUM_GREY()}
              onClick={() => handleModalClose()}
            />
          </div>
        }
      >
        <div className={css(styles.body)}>
          {step === "RESULTS" && (
            <div>
              <div className={css(styles.additionalResults)}>
                We found some additional publications that might belong to you.
              </div>
            </div>
          )}
          {/* @ts-ignore legacy */}
          <AddPublicationsForm
            onStepChange={handleStepChange}
            // @ts-ignore legacy
            wsUrl={WS_ROUTES.NOTIFICATIONS(auth?.user?.id)}
            // @ts-ignore legacy
            wsAuth
          />
        </div>
      </BaseModal>
    </>
  );
};

const styles = StyleSheet.create({
  additionalResults: {
    marginTop: 15,
    marginBottom: 30,
  },
  body: {
    width: 550,
    padding: "0px 25px 25px 25px",
  },
  modalStyle: {
    padding: 0,
  },
  modalContentStyle: {
    padding: 0,
  },
  modalTitle: {
    height: "auto",
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: 7,
    fontSize: 20,
    cursor: "pointer",
  },
  close: {
    position: "absolute",
    right: 10,
    top: 7,
    cursor: "pointer",
  },
  titleWrapper: {
    marginBottom: 15,
    padding: 15,
    justifyContent: "center",
    position: "relative",
    flexDirection: "row",
    display: "flex",
    fontSize: 16,
    borderBottom: `1px solid ${colors.LIGHT_GREY()}`,
  },
  titleWrapperWithBorder: {
    borderBottom: `1px solid ${colors.LIGHT_GREY()}`,
  },
});

export default AddPublicationModal;
