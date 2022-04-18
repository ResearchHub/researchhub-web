import { ReactElement, useState } from "react";
import { PeerReviewRequest } from "~/config/types/peerReview";
import { css, StyleSheet } from "aphrodite";
import ALink from "~/components/ALink";
import AuthorAvatar from "~/components/AuthorAvatar";
import colors from "~/config/themes/colors";
import { getUrlToUniDoc } from "~/config/utils/routing";
import { timeSince } from "~/config/utils/dates";
import DropdownButton from "~/components/Form/DropdownButton";
import { ID } from "~/config/types/root_types";
import PeerReviewRequestModal from "./PeerReviewInviteModal";
import PeerReviewPerson from "./PeerReviewPerson";


type Props = {
  peerReviewRequest: PeerReviewRequest;
  fetchReviewRequests: Function;
};

function PeerReviewRequestCard({
  peerReviewRequest,
  fetchReviewRequests,
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
  const invites = peerReviewRequest?.invites ?? [];

  return (
    <div className={css(styles.PeerReviewRequestCard)}>
      <PeerReviewRequestModal
        peerReviewRequest={peerReviewRequest}
        isOpen={isInviteModalOpen}
        closeModal={() => setsIsInviteModalOpen(false)}
        fetchReviewRequests={fetchReviewRequests}
      />
      <div className={css(styles.detailsContainer)}>
        <span className={css(styles.avatarContainer)}>
          <AuthorAvatar
            author={(peerReviewRequest?.requestedByUser ?? {})["authorProfile"]}
            fontSize={16}
            size={35}
            spacing={5}
          />
        </span>
        <div>
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
          {invites.length > 0 &&
            <div className={css(styles.invitedRow)}>
              {invites.map((invite) => (
                <PeerReviewPerson
                  id={invite?.id}
                  status={invite?.status}
                  authorProfile={invite?.recipient?.authorProfile}
                />
              ))}
            </div>
          }
        </div>
      </div>
      <div className={css(styles.manageButtonContainer)}>
        <DropdownButton
          opts={opts}
          label={`Manage`}
          isOpen={manageDropdownOpenFor === peerReviewRequest.id}
          onClick={() => setManageDropdownOpenFor(peerReviewRequest.id)}
          dropdownClassName="managePeerReview"
          positions={["bottom", "right"]}
          customButtonClassName={styles.manageButton}
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
    fontSize: 16,
    marginBottom: 16,
  },
  "manageButtonContainer": {
    alignSelf: "flex-start",
  },
  "detailsContainer": {
    display: "flex",
    alignItems: "center",
  },
  "manageButton": {
    background: colors.BLUE(),
    color: "white",
    borderRadius: "4px",
    ":hover": {
      background: colors.BLUE(),
      opacity: 0.9,  
    }
  },
  "mainTextRow": {
    lineHeight: "20px",
  },
  "dateRow": {
    color: colors.BLACK(0.5),
    fontWeight: 400,
    fontSize: 14,
  },
  "invitedRow": {
    marginTop: 15,
  },
  "avatarContainer": {
    display: "inline-block",
    alignSelf: "flex-start",
    marginRight: 10,
  }
})

export default PeerReviewRequestCard;
