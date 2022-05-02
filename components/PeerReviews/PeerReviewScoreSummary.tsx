import { ReactElement } from "react";
import { PeerReviewScoreSummary } from "~/config/types/peerReview";
import { StyleSheet, css } from "aphrodite";
import { breakpoints } from "~/config/themes/screen";
import ScoreInput from "~/components/Form/ScoreInput";
import ALink from "~/components/ALink";
import colors from "~/config/themes/colors";

type Props = {
  summary: PeerReviewScoreSummary,
  docUrl: string,
  withReviewCount: Boolean,
  withDot: Boolean,
  scoreStyleOverride: any,
};

export default function PeerReviewSummary({
  summary,
  docUrl = "",
  withReviewCount = true,
  withDot = true,
  scoreStyleOverride = null,
}: Props): ReactElement {
  return (
    <div className={css(styles.reviewContainer)}>
      <span className={css(styles.reviewScoreContainer, scoreStyleOverride)}>
        <span className={css(styles.reviewScore)}>{summary?.avg.toFixed(1)}</span>
      </span>
      <div className={css(styles.scoreContainer)}>
        {withDot &&
          <span className={css(styles.dot)}>&bull;</span>
        }
        <ScoreInput
          value={summary?.avg}
          readOnly
          withText={false}
          overrideBarStyle={styles.overrideReviewBar}
        />
      </div>
      {withReviewCount &&
        <div className={css(styles.reviewCountContainer)}>
          <span className={css(styles.dot)}>&bull;</span>
          <ALink href={`${docUrl}#comments`} overrideStyle={styles.reviewCount}>
            {summary?.count} {summary?.count === 1 ? "Review" : "Reviews"}
          </ALink>
        </div>
      }
    </div>
  )
}

const styles = StyleSheet.create({
  reviewContainer: {
    display: "flex",
    alignItems: "center",
  },
  reviewScoreContainer: {
    color: colors.BLACK(),
    fontSize: 14,
    lineHeight: "19px",
  },
  reviewScore: {
    color: colors.NEW_BLUE(),
    fontSize: 16,
    fontWeight: 400,
    marginRight: 3,
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      fontSize: 16,
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
    width: 12,
    height: 8,
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
