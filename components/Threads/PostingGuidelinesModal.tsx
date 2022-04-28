import { ReactElement } from "react";
import BaseModal from "~/components/Modals/BaseModal";
import { css, StyleSheet } from "aphrodite";
import { breakpoints } from "~/config/themes/screen";

type Props = {
  isOpen: Boolean;
  closeModal: Function;
};
  
function PostingGuidelinesModal({
  isOpen,
  closeModal,
}: Props): ReactElement {

  const handleClose = () => {
    closeModal();
  }

  return (
    <BaseModal
      closeModal={handleClose}
      isOpen={isOpen}
      modalStyle={styles.modalStyle}
      title="Posting Guidelines"
    >
      <div className={css(styles.rootContainer)}>
        <ul className={css(styles.guidelinesContent)}>
          <li>Stick to academically appropriate topics</li>
          <li>
            Focus on presenting objective results and remain unbiased in your
            commentary
          </li>
          <li>
            Be respectful of differing opinions, viewpoints, and experiences
          </li>
          <li>Do not plagiarize any content, keep it original</li>
        </ul>
      </div>
    </BaseModal>
  )
}

const styles = StyleSheet.create({
  "rootContainer": {
    width: "100%",
    textAlign: "left",
  },
  "modalStyle": {
    minWidth: 600,
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      minWidth: "unset",
    },
  },
  guidelinesContent: {
    color: "#241F3A",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "normal",
    lineHeight: "24px",
    marginBottom: 20,
    marginTop: 30,
    maxWidth: 400,
  },
});

export default PostingGuidelinesModal;
