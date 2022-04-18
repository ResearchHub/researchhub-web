import AuthorAvatar from "~/components/AuthorAvatar";
import { AuthorProfile, PeerReviewInvite } from "./config/PeerReviewTypes";
import { css, StyleSheet } from "aphrodite";
import { ReactElement } from "react";
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";
import ReactTooltip from "react-tooltip";
import { ID } from "~/config/types/root_types";

type Props = {
  id: ID,
  status?: string,
  authorProfile?: AuthorProfile,
};

function PeerReviewPerson({
  id,
  status,
  authorProfile,
}: Props): ReactElement {
  
  const getTooltipMessage = () => {

    if (status === "INVITED") {
      return `${authorProfile?.firstName} ${authorProfile?.lastName} has been invited`
    }
  }

  return (
    <span
      className={css(styles.PeerReviewPerson)}
      data-for={`person-${id}-${authorProfile?.id}`}
      data-tip
    >
        <ReactTooltip
          place="top"
          effect="solid"
          delayShow={250}
          id={`person-${id}-${authorProfile?.id}`}
        >
          {getTooltipMessage()}
        </ReactTooltip>

        
        {status == "INVITED"
          ? <span
              className={css(styles.status, styles.questionIcon)}>{icons.question}</span>
          : null
        }
        <div
          className={css(styles.avatarContainer)}
        >
          <AuthorAvatar
            author={authorProfile}
            fontSize={15}
            size={25}
            spacing={5}
          />
      </div>
    </span>
  )
}

const styles = StyleSheet.create({
  "PeerReviewPerson": {
    position: "relative",
  },
  "avatarContainer": {
    display: "inline-block",
  },
  "status": {
    position: "absolute",
    top: -16,
    right: -5,
    zIndex: 1,
  },
  "questionIcon": {
    color: colors.ORANGE(),  
  }
});

export default PeerReviewPerson;
