import { ReactElement, useState } from "react";
import { css, StyleSheet } from "aphrodite";
import { PeerReviewRequest } from "./config/PeerReviewTypes";
import BaseModal from "~/components/Modals/BaseModal";

type Props = {
  peerReviewRequest: PeerReviewRequest;
  isOpen: Boolean;
  closeModal: Function;
};

function PeerReviewRequestModal({ peerReviewRequest, isOpen, closeModal }: Props): ReactElement {

  console.log(peerReviewRequest?.unifiedDocument?.document?.title)  

  return (
    <BaseModal
      closeModal={closeModal}
      isOpen={isOpen}
      modalStyle={styles.modalStyle}
      title="Invite Peer Reviewers"
    >
      <div className={css(styles.rootContainer)}>
        <div className={css(styles.reviewDetails)}>
          {peerReviewRequest?.unifiedDocument?.document?.title}
        </div>
        <form>
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
})

export default PeerReviewRequestModal;
