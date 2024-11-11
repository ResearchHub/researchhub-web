import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/pro-solid-svg-icons";
import { ReactElement } from "react";
import { PeerReviewScoreSummary } from "~/config/types/peerReview";
import { StyleSheet, css } from "aphrodite";
import { breakpoints } from "~/config/themes/screen";
import colors from "~/config/themes/colors";

type Props = {
  summary: PeerReviewScoreSummary;
  docUrl: string;
};

export default function PeerReviewSummary({
  summary,
  docUrl = "",
}: Props): ReactElement {
  return (
    (<div className={css(styles.reviewContainer)}>
      <div className={css(styles.starContainer)}>
        {<FontAwesomeIcon icon={faStar}></FontAwesomeIcon>}
      </div>
      <span className={css(styles.reviewScoreContainer)}>
        <span className={css(styles.reviewScore)}>
          {(summary?.avg || 0).toFixed(1)}
        </span>
      </span>
    </div>)
  );
}

const styles = StyleSheet.create({
  reviewContainer: {
    display: "flex",
    alignItems: "center",
  },
  reviewScoreContainer: {
    color: colors.BLACK(),
    fontSize: 14,
  },
  starContainer: {
    color: "#E8B504",
    fontSize: 11,
    marginRight: 3,
  },
  reviewScore: {
    color: colors.BLACK(0.6),
    fontSize: 14,
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      fontSize: 14,
    },
  },
  reviewCountContainer: {
    display: "flex",
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      display: "none",
    },
  },
  reviewCount: {
    fontSize: 14,
    paddingTop: 1,
    color: colors.BLACK(0.5),
    fontWeight: 400,
  },
  overrideReviewBar: {
    width: 16,
  },
  scoreContainer: {
    display: "flex",
    alignItems: "center",
    [`@media only screen and (max-width: ${breakpoints.xxxsmall.str})`]: {
      display: "none",
    },
  },
  dot: {
    fontSize: 18,
    color: colors.GREY(),
    marginRight: 8,
    marginLeft: 8,
  },
});
