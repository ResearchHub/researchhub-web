import { ReactElement, useRef, useState } from "react";
import { css, StyleSheet } from "aphrodite";
import { PeerReviewRequest } from "~/config/types/peerReview";
import BaseModal from "~/components/Modals/BaseModal";
import FormInput from "~/components/Form/FormInput";
import Button from "~/components/Form/Button";
import { inviteReviewer } from "./config/PeerReviewInviteAPI";
import { MessageActions } from "~/redux/message";
import { connect } from "react-redux";
import Loader from "~/components/Loader/Loader";
import colors from "~/config/themes/colors";

type Props = {
  peerReviewRequest: PeerReviewRequest;
  fetchReviewRequests: Function;
  isOpen: Boolean;
  closeModal: Function;
  setMessage: Function;
  showMessage: Function;
};

function PeerReviewRequestModal({
  peerReviewRequest,
  fetchReviewRequests,
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
        fetchReviewRequests();
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
          <div className={css(styles.attrRow)}>
            <div className={css(styles.attrName)}>Paper</div>
            <div className={css(styles.attrValue)}>{peerReviewRequest?.unifiedDocument?.document?.title}</div>
          </div>
        </div>
        <form
          onSubmit={(e) => handleSubmit(e)}
        >
          <FormInput
            value={email}
            getRef={formInputRef}
            required
            type="email"
            placeholder="Email"
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
    width: "100%",
    textAlign: "center",
  },
  "modalStyle": {
    minWidth: 600,
  },
  "reviewDetails": {
    borderRadius: "4px",
    border: `1px solid ${colors.GREY(0.5)}`,
    textAlign: "left",
    marginTop: 30,
  },
  "attrRow": {
    padding: 15,
    display: "flex",
  },
  "attrName": {
    fontWeight: 500,
    width: "25%",
  },
  "attrValue": {

  }
});

const mapDispatchToProps = {
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,  
}

export default connect(null, mapDispatchToProps)(PeerReviewRequestModal);
