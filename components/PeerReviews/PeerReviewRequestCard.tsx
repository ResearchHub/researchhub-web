import { ReactElement, useState } from "react";
import { PeerReviewRequest } from "./config/PeerReviewTypes";
import { css, StyleSheet } from "aphrodite";
import ALink from "~/components/ALink";
import AuthorAvatar from "~/components/AuthorAvatar";
import colors from "~/config/themes/colors";
import { getUrlToUniDoc } from "~/config/utils/routing";
import { timeSince } from "~/config/utils/dates";
import DropdownButton from "~/components/Form/DropdownButton";
import { ID } from "~/config/types/root_types";
import PeerReviewRequestModal from "./PeerReviewInviteModal";


type Props = {
  peerReviewRequest: PeerReviewRequest;
};

function PeerReviewRequestCard({
  peerReviewRequest
}: Props): ReactElement {

  const opts = [{
    label: "Invite",
    value: "invite"
  }, {
    label: "Decline",
    value: "decline"
  }, {
    label: "Close",
    value: "close"    
  }];

  const [manageDropdownOpenFor, setManageDropdownOpenFor] = useState<ID>(null)
  const [isInviteModalOpen, setsIsInviteModalOpen] = useState<Boolean>(false);
  const author = peerReviewRequest?.requestedByUser?.authorProfile

  return (
    <div className={css(styles.PeerReviewRequestCard)}>
      <PeerReviewRequestModal
        peerReviewRequest={peerReviewRequest}
        isOpen={isInviteModalOpen}
        closeModal={() => setsIsInviteModalOpen(false)}
      />
      <div className={css(styles.detailsContainer)}>
        <span className={css(styles.avatarContainer)}>
          <AuthorAvatar
            author={(peerReviewRequest?.requestedByUser ?? {})["authorProfile"]}
            boldName
            fontSize={15}
            size={25}
            spacing={5}
          // withAuthorName
          />
        </span>
        <div className={css(styles.mainTextRow)}>
          <ALink href={getUrlToUniDoc(peerReviewRequest?.unifiedDocument)}>
            {author?.firstName} {author?.lastName}
          </ALink>
          <span> has requested a peer review on </span>
          <ALink href={getUrlToUniDoc(peerReviewRequest?.unifiedDocument)}>
            {peerReviewRequest?.unifiedDocument?.document?.title}
          </ALink>
        </div>
        <div className={css(styles.dateRow)}>
          {timeSince(peerReviewRequest.createdDate)}
        </div>
      </div>
      <div className={css(styles.buttonContainer)}>
        <DropdownButton
          opts={opts}
          label={`Manage`}
          isOpen={manageDropdownOpenFor === peerReviewRequest.id}
          onClick={() => setManageDropdownOpenFor(peerReviewRequest.id)}
          dropdownClassName="managePeerReview"
          positions={["bottom", "right"]}
          customButtonClassName={styles.d}
          overrideTargetStyle={null}
          onSelect={(selected) => {
            if (selected === "invite") {
              setsIsInviteModalOpen(true);
            }
            setManageDropdownOpenFor(null);
          } }
          onClose={() => setManageDropdownOpenFor(null)}
          onClickOutside={() => setManageDropdownOpenFor(null)}
        />        
      </div>
    </div>
  )
}

const styles = StyleSheet.create({
  "PeerReviewRequestCard": {
    backgroundColor: "white",
    padding: "30px 30px",
    border: `1px solid ${colors.GREY(0.5)}`,
    borderRadius: "4px",
    display: "flex",
    maxWidth: 1200,
    boxSizing: "border-box",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 14,
    marginBottom: 16,
  },
  "buttonContainer": {

  },
  "detailsContainer": {
    display: "flex",
    alignItems: "center",
  },
  "d": {
    background: colors.BLUE(),
    color: "white",
    borderRadius: "4px",
    ":hover": {
      background: colors.BLUE(),
      opacity: 0.9,  
    }
  },
  "mainTextRow": {
    marginLeft: 10,
  },
  "dateRow": {

  },
  "avatarContainer": {
    display: "inline-block",
  }
})

export default PeerReviewRequestCard;
