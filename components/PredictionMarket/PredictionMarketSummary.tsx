import { StyleSheet, css } from "aphrodite";
import { useMemo } from "react";
import { PredictionMarketDetails as PredictionMarketSummaryType } from "~/components/PredictionMarket/lib/types";
import colors from "../../config/themes/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/pro-solid-svg-icons";
import predMarketUtils from "./lib/util";

type PredictionMarketSummaryProps = {
  summary: PredictionMarketSummaryType;
};

const PredictionMarketSummary = ({ summary }: PredictionMarketSummaryProps) => {
  const pcnt = useMemo(
    () => predMarketUtils.computeProbability(summary.votes)?.toFixed(0),
    [summary]
  );

  return (
    <div className={css(styles.container)}>
      <div className={css(styles.title)}>
        <span className={css(styles.titlePercentage)}>{pcnt}%</span>
        User-Voted Chance of Replication
      </div>
      <div
        className={css([
          styles.voteBar,
          pcnt === undefined && styles.voteBarEmptyState,
        ])}
      >
        <div
          className={css(styles.voteBarYes)}
          style={{ width: `${pcnt || 0}%` }}
        ></div>
      </div>
      <div className={css(styles.voteDetails)}>
        <div className={css(styles.voteDetailsTotal)}>
          {summary?.votes?.total || 0} Vote{summary?.votes?.total !== 1 && "s"}
        </div>
        <div className={css(styles.voteDetailsDot)}>·</div>
        <div className={css(styles.voteDetailsYes)}>
          {summary?.votes?.yes || 0} Yes&nbsp;&nbsp;
          <FontAwesomeIcon
            icon={faCaretUp}
            style={{ transform: "translateY(1.2px)" }}
          />
        </div>
        <div className={css(styles.voteDetailsDot)}>·</div>
        <div className={css(styles.voteDetailsNo)}>
          {summary?.votes?.no || 0} No&nbsp;&nbsp;
          <FontAwesomeIcon icon={faCaretDown} />
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 40,
  },
  title: {
    fontSize: 12,
    fontWeight: 500,
    marginBottom: 16,
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    lineheight: 1,
  },
  titlePercentage: {
    fontSize: 20,
    weight: 500,
  },
  voteBar: {
    width: "100%",
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.PASTEL_RED(),
    overflow: "hidden",
    marginBottom: 12,
  },
  voteBarEmptyState: {
    backgroundColor: colors.LIGHT_GREY(),
  },
  voteBarYes: {
    height: "100%",
    backgroundColor: colors.PASTEL_GREEN(),
  },
  // vote details
  voteDetails: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    fontSize: 12,
    fontWeight: 400,
  },
  voteDetailsTotal: {
    color: colors.MEDIUM_GREY2(),
  },
  voteDetailsDot: {
    color: colors.MEDIUM_GREY2(),
    fontWeight: 500,
  },
  voteDetailsYes: {
    color: colors.PASTEL_GREEN(),
  },
  voteDetailsNo: {
    color: colors.PASTEL_RED(),
  },
});

export default PredictionMarketSummary;
