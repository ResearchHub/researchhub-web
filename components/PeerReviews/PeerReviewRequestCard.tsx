import { ReactElement } from "react";
import { PeerReviewRequest } from "./config/PeerReviewTypes";
import { css, StyleSheet } from "aphrodite";
import ALink from "~/components/ALink";
import AuthorAvatar from "~/components/AuthorAvatar";
import colors from "~/config/themes/colors";
import { getUrlToUniDoc } from "~/config/utils/routing";
import { timeSince } from "~/config/utils/dates";


type Props = {
  peerReviewRequest: PeerReviewRequest;
};

function PeerReviewRequestCard({
  peerReviewRequest
}: Props): ReactElement {

  return (
    <div className={css(styles.PeerReviewRequestCard)}>
      <div className={css(styles.mainTextRow)}>
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
        <span>has requested a peer review on </span>
        <ALink href={getUrlToUniDoc(peerReviewRequest?.unifiedDocument)}>
          {peerReviewRequest?.unifiedDocument?.document?.title}
        </ALink>
      </div>
      <div className={css(styles.dateRow)}>
        {timeSince(peerReviewRequest.createdDate)}
      </div>
    </div>
  )
}

const styles = StyleSheet.create({
  "PeerReviewRequestCard": {
    backgroundColor: "white",
    padding: "30px 30px",
    border: `1px solid ${colors.GREY(0.5)}`,
    borderRadius: "2px",
  },
  "mainTextRow": {

  },
  "dateRow": {

  },
  "avatarContainer": {
    display: "inline-block",
  }
})

export default PeerReviewRequestCard;
