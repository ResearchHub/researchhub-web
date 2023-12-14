import BaseModal from "~/components/Modals/BaseModal";
import { GenericDocument, Post } from "../lib/types";
import { css, StyleSheet } from "aphrodite";
import AskQuestionForm from "~/components/Question/AskQuestionForm";

interface Props {
  post: GenericDocument;
  isOpen: boolean;
  handleClose: () => void;
}

const EditPostModal = ({ post, handleClose, isOpen }: Props) => {
  return (
    <div>
      <BaseModal
        closeModal={handleClose}
        isOpen={isOpen}
        modalStyle={styles.modalStyle}
        modalContentStyle={styles.modalContentStyle}
        titleStyle={styles.titleStyle}
        textAlign="left"
        hideClose={true}
        title={false}
      >
        <AskQuestionForm
          title={""}
          onExit={handleClose}
          post={post}
          user={null}
        />
      </BaseModal>
    </div>
  );
};

const styles = StyleSheet.create({
  titleStyle: {},
  modalStyle: {},
  modalContentStyle: {},
});

export default EditPostModal;
