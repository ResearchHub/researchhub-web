import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/pro-solid-svg-icons";
import { faCheckCircle } from "@fortawesome/pro-solid-svg-icons";
import { faQuestion } from "@fortawesome/pro-solid-svg-icons";
import AuthorAvatar from "~/components/AuthorAvatar";
import { AuthorProfile } from "~/config/types/root_types";
import { css, StyleSheet } from "aphrodite";
import { ReactElement } from "react";

import colors from "~/config/themes/colors";
import ReactTooltip from "react-tooltip";
import { ID } from "~/config/types/root_types";

type Props = {
  id: ID;
  status?: "ACCEPTED" | "DECLINED" | "INVITED";
  authorProfile?: AuthorProfile;
};

function PeerReviewPerson({ id, status, authorProfile }: Props): ReactElement {
  const authorName = `${authorProfile?.firstName} ${authorProfile?.lastName}`;
  const tooltipMessage =
    status === "INVITED"
      ? `${authorName} has been invited`
      : status === "ACCEPTED"
      ? `${authorName} accepted invite`
      : status === "DECLINED"
      ? `${authorName} declined invite`
      : null;

  return (
    (<span
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
        {tooltipMessage}
      </ReactTooltip>
      {status == "INVITED" ? (
        <span className={css(styles.statusIcon, styles.questionIcon)}>
          {<FontAwesomeIcon icon={faQuestion}></FontAwesomeIcon>}
        </span>
      ) : status == "ACCEPTED" ? (
        <span className={css(styles.statusIcon, styles.checkIcon)}>
          {<FontAwesomeIcon icon={faCheckCircle}></FontAwesomeIcon>}
        </span>
      ) : status == "DECLINED" ? (
        <span className={css(styles.statusIcon, styles.timesIcon)}>
          {<FontAwesomeIcon icon={faTimesCircle}></FontAwesomeIcon>}
        </span>
      ) : null}
      <div className={css(styles.avatarContainer)}>
        <AuthorAvatar
          author={authorProfile}
          fontSize={15}
          size={30}
          spacing={5}
        />
      </div>
    </span>)
  );
}

const styles = StyleSheet.create({
  PeerReviewPerson: {
    position: "relative",
    marginLeft: 10,
    ":first-child": {
      marginLeft: 0,
    },
  },
  avatarContainer: {
    display: "inline-block",
  },
  statusIcon: {
    position: "absolute",
    background: "white",
    borderRadius: 50,
    height: 17,
    fontSize: 17,
    top: 0,
    right: -6,
    zIndex: 1,
  },
  questionIcon: {
    color: colors.ORANGE(),
  },
  checkIcon: {
    color: colors.GREEN(),
  },
  timesIcon: {
    color: colors.RED(),
  },
});

export default PeerReviewPerson;
