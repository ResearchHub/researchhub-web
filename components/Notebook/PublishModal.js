import BaseModal from "~/components/Modals/BaseModal";
import { StyleSheet, css } from "aphrodite";
import { breakpoints } from "~/config/themes/screen";

const PublishModal = ({ isOpen = false, closeModal }) => {
  const modalBody = (
    <div className={css(styles.body)}>
      <div className={css(styles.formContainer)}>Form</div>
      <div className={css(styles.guidelinesContainer)}>Guidelines</div>
    </div>
  );

  return (
    <BaseModal
      children={modalBody}
      closeModal={closeModal}
      isOpen={isOpen}
      title={"Publish to ResearchHub"}
    />
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: "70%",
  },
  guidelinesContainer: {},
  body: {
    minWidth: 500,
    maxWidth: 800,
    minHeight: 100,
    marginTop: 40,
    display: "flex",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      minWidth: "unset",
      width: "100%",
      boxSizing: "border-box",
      padding: 15,
    },
  },
});

export default PublishModal;
