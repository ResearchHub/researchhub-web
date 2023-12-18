import BaseModal from "~/components/Modals/BaseModal";
import { Post } from "./types";
import { StyleSheet } from "aphrodite";
import AskQuestionForm from "~/components/Question/AskQuestionForm";

interface Props {
  post: Post;
  isOpen: boolean;
  handleClose: () => void;
}

const EditQuestionModal = ({ post, handleClose, isOpen }: Props) => {
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
          onExit={handleClose}
          post={post}
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

export default EditQuestionModal;
