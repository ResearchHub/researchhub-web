import BaseModal from "../Modals/BaseModal";
import { useState } from "react";
import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";
import IconButton from "../Icons/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/pro-light-svg-icons";
import { CloseIcon } from "~/config/themes/icons";
import AddPublicationsForm, { STEP } from "../Author/Profile/AddPublicationsForm";
import { ORDERED_STEPS } from "../Author/Profile/AddPublicationsForm";

const AddPublicationModal = ({ children }) => {
  const [step, setStep] = useState<STEP>("DOI");
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
          step == "RESULTS" || step == "NEEDS_AUTHOR_CONFIRMATION" ? (
            <div
              className={css(
                styles.titleWrapper,
                styles.titleWrapperWithBorder
              )}
            >
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
              <CloseIcon
                // @ts-ignore
                overrideStyle={styles.close}
                color={colors.MEDIUM_GREY()}
                onClick={() => null}
              />
            </div>
          ) : null
        }
      >
        {/* @ts-ignore legacy */}
        <AddPublicationsForm onStepChange={({ step }) => {
          console.log('step changed', step)
        }} />
      </BaseModal>
    </>
  );
};

const styles = StyleSheet.create({
  modalStyle: {
    padding: "20px 20px",
  },
  modalContentStyle: {
    padding: "10px 20px",
  },
  modalTitle: {},
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
    padding: 15,
    marginBottom: 15,
    justifyContent: "center",
    position: "relative",
    flexDirection: "row",
    display: "flex",
    fontSize: 16,
  },
  titleWrapperWithBorder: {
    borderBottom: `1px solid ${colors.LIGHT_GREY()}`,
  },
});

export default AddPublicationModal;
