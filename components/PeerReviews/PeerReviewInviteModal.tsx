import { ReactElement, useRef, useState } from "react";
import { css, StyleSheet } from "aphrodite";
import { PeerReviewRequest } from "./config/PeerReviewTypes";
import BaseModal from "~/components/Modals/BaseModal";
import FormInput from "~/components/Form/FormInput";
import Button from "~/components/Form/Button";
import { inviteReviewer } from "./config/PeerReviewInviteAPI";
import { MessageActions } from "~/redux/message";
import { connect } from "react-redux";
import Loader from "~/components/Loader/Loader";

type Props = {
  peerReviewRequest: PeerReviewRequest;
  isOpen: Boolean;
  closeModal: Function;
  setMessage: Function;
  showMessage: Function;
};

function PeerReviewRequestModal({
  peerReviewRequest,
  isOpen,
  closeModal,
  setMessage,
  showMessage,
}: Props): ReactElement {
  const formInputRef = useRef();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleKeyDown = (e) => {
    if (e?.key === 13 /*Enter*/) {
      invite();
    }
  };

  const handleSubmit = async (e) => {
    e && e.preventDefault();

    if (email.length > 0) {
      invite();
    }
  }

  const invite = () => {
    setIsLoading(true);
    inviteReviewer({
      peerReviewRequest,
      email,
      onError: () => {
        setIsLoading(false);
        setEmail("");
        setMessage("Failed to invite user");
        return showMessage({ show: true, error: true });
      },
      onSuccess: () => {
        setEmail("");
        setIsLoading(false);
      },
    })
  }

  return (
    <BaseModal
      closeModal={closeModal}
      isOpen={isOpen}
      modalStyle={styles.modalStyle}
      title="Invite Peer Reviewers"
    >
      <div className={css(styles.rootContainer)}>
        <div className={css(styles.reviewDetails)}>
          Paper: {peerReviewRequest?.unifiedDocument?.document?.title}
        </div>
        <form
          onSubmit={(e) => handleSubmit(e)}
        >
          <FormInput
            value={email}
            getRef={formInputRef}
            required
            type="email"
            onKeyDown={handleKeyDown}
            onChange={(id, value) => setEmail(value)}
          />
          {isLoading ? (
            <Loader size={24} />
          ) : (
            <Button
              onClick={handleSubmit}
              label="Invite"
            />
          )}
        </form>
      </div>
    </BaseModal>
  )
}

const styles = StyleSheet.create({
  "rootContainer": {

  },
  "modalStyle": {
    
  },
  "reviewDetails": {

  }
});

const mapDispatchToProps = {
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,  
}

export default connect(null, mapDispatchToProps)(PeerReviewRequestModal);
