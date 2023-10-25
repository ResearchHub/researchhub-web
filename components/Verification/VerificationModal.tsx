import BaseModal from "../Modals/BaseModal";
import { css, StyleSheet } from "aphrodite";
import VerificationForm from "./VerificationForm";


const VerificationModal = ({ isModalOpen = true, handleModalClose }) => {
  return (
    <BaseModal
      offset={"0px"}
      isOpen={isModalOpen}
      hideClose={false}
      closeModal={handleModalClose}
      zIndex={1000000001}
      modalStyle={styles.modalStyle}
      modalContentStyle={styles.modalContentStyle}
    >
      <div className={css(styles.formWrapper)}>
        <VerificationForm />
      </div>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  formWrapper: {
    width: 540,
    height: "100%",
  },
  modalStyle: {},
  modalTitleStyleOverride: {},
  modalContentStyle: {
    position: "relative",
    minHeight: 560,
    padding: "50px 25px ",
  },
  prevActionWrapper: {
    position: "absolute",
    top: 12,
    left: 10,
  },
});

export default VerificationModal;
