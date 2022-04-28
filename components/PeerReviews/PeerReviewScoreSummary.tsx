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
};

function PeerReviewSummary({
  summary,
  docUrl = "",
}: Props): ReactElement {
  return (
    <div className={css(styles.reviewContainer)}>
      <span className={css(styles.reviewScoreContainer)}>
        <span className={css(styles.reviewScore)}>{summary?.avg}</span>/10
      </span>
      <div className={css(styles.scoreContainer)}>
        <span className={css(styles.dot)}>&bull;</span>
        <ScoreInput
          value={summary?.avg}
          readOnly={true}
          withText={false}
          overrideBarStyle={styles.overrideReviewBar}
        />
      </div>
      <div className={css(styles.reviewCountContainer)}>
        <span className={css(styles.dot)}>&bull;</span>
        <ALink href={`${docUrl}#comments`} overrideStyle={styles.reviewCount}>
          {summary?.count} {summary?.count === 1 ? "Review" : "Reviews"}
        </ALink>
      </div>
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
    fontSize: 18,
    fontWeight: 500,
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
    width: 16,
    height: 10,
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

export default PeerReviewSummary;
