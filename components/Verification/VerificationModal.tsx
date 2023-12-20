import BaseModal from "../Modals/BaseModal";
import { css, StyleSheet } from "aphrodite";
import VerificationForm from "./VerificationFormV2";
import { breakpoints } from "~/config/themes/screen";
import { useEffect, useState } from "react";
import colors from "~/config/themes/colors";
import { faArrowLeft } from "@fortawesome/pro-light-svg-icons";
import { CloseIcon } from "~/config/themes/icons";
import IconButton from "../Icons/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { VERIFICATION_STEP, ORDERED_VERIFICATION_STEPS } from "./lib/types";

const VerificationModal = ({ isModalOpen = true, handleModalClose }) => {
  const [step, setStep] = useState<VERIFICATION_STEP>("INTRO_STEP");

  useEffect(() => {
    if (isModalOpen) {
      // Reset
      setStep("INTRO_STEP");
    }
  }, []);

  return (
    <BaseModal
      offset={"0px"}
      isOpen={isModalOpen}
      hideClose={step !== "EMAIL_SENT_STEP"}
      closeModal={handleModalClose}
      zIndex={1000000001}
      modalStyle={styles.modalStyle}
      modalContentStyle={styles.modalContentStyle}
      titleStyle={styles.modalTitleStyleOverride}
      title={
        step == "DOI_STEP" || step == "AUTHOR_STEP" ? (
          <div
            className={css(styles.titleWrapper, styles.titleWrapperWithBorder)}
          >
            {step === "DOI_STEP"
              ? "Enter DOI"
              : step === "AUTHOR_STEP"
              ? "Select Author"
              : ""}

            <IconButton overrideStyle={styles.backButton}>
              <FontAwesomeIcon
                icon={faArrowLeft}
                onClick={() => {
                  const indexOfCurrentStep =
                    ORDERED_VERIFICATION_STEPS.indexOf(step);
                  if (indexOfCurrentStep > 0) {
                    setStep(ORDERED_VERIFICATION_STEPS[indexOfCurrentStep - 1]);
                  }
                }}
              />
            </IconButton>
            <CloseIcon
              // @ts-ignore
              overrideStyle={styles.close}
              color={colors.MEDIUM_GREY()}
              onClick={handleModalClose}
            />
          </div>
        ) : null
      }
    >
      <div className={css(styles.formWrapper)}>
        <VerificationForm currentStep={step} onStepSelect={setStep} />
      </div>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  formWrapper: {
    width: 540,
    padding: "25px 25px 0px 25px",
    height: "100%",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: "100%",
    },
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      width: "90%",
    },
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
  titleWrapperWithBorder: {
    borderBottom: `1px solid ${colors.LIGHT_GREY()}`,
  },
  modalStyle: {},
  modalTitleStyleOverride: {
    height: "auto",

    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: "100%",
    },
  },
  modalContentStyle: {
    position: "relative",
    minHeight: 560,
    padding: "0px 0px 25px 0px",
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      height: "100%",
    },
    display: "block",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: "100%",
      padding: 0,
    },
  },
  prevActionWrapper: {
    position: "absolute",
    top: 12,
    left: 10,
  },
});

export default VerificationModal;
