import { css, StyleSheet } from "aphrodite";
import React, { ReactElement } from "react";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import { silentEmptyFnc } from "~/config/utils/nullchecks";
import CitationConsensusItem from "./Citation/table/CitationConsensusItem";

type Props = {
  aggregateCitationConsensus: {
    citationCount: number;
    downCount: number;
    upCount: number;
  };
};

export default function HypothesisCitationConsensusCard({
  aggregateCitationConsensus: { citationCount, downCount, upCount },
}: Props): ReactElement<"div"> | null {
  if (citationCount === 0) {
    return null;
  }

  const sentiment = upCount - downCount;

  return (
    <div className={css(styles.hypothesisCitationConsensusCard)}>
      <div className={css(styles.title)}>{"Current conclusion"}</div>
      <div className={css(styles.body)}>
        <div className={css(styles.consensusTextGroup)}>
          <span
            className={css(
              sentiment > 0
                ? styles.positiveGreen
                : sentiment < 0
                ? styles.negativeRed
                : null
            )}
          >
            <span className={css(styles.icon)}>
              {sentiment > 0 ? (
                <img src="/static/icons/check.svg" />
              ) : sentiment < 0 ? (
                <span>{icons.timesCircle}</span>
              ) : (
                <span>{icons.minusCircle}</span>
              )}
            </span>
            <span>{`Probably ${
              downCount === upCount
                ? "neutral"
                : downCount > upCount
                ? "no"
                : "yes"
            }`}</span>
          </span>
          <span className={css(styles.dot)}>{"\u2022"}</span>
          <span>{`Base on ${citationCount} Sources and ${citationCount} researcher votes.`}</span>
        </div>
        <div className={css(styles.hypoConsensusRightSide)}>
          <CitationConsensusItem
            citationID={null}
            consensusMeta={{
              downCount,
              neutralCount: citationCount - (upCount + downCount),
              upCount,
              userVote: {},
            }}
            disableText
            updateLastFetchTime={silentEmptyFnc}
          />
        </div>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  hypothesisCitationConsensusCard: {
    backgroundColor: "#fff",
    border: "1.5px solid #F0F0F0",
    borderRadius: 4,
    boxShadow: "0px 3px 4px rgba(0, 0, 0, 0.02)",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    fontFamily: "Roboto",
    height: 128,
    marginTop: 30,
    padding: "24px 30px",
    "@media only screen and (max-width: 1024px)": {
      borderBottom: "none",
      borderRadius: "4px 4px 0px 0px",
    },
    "@media only screen and (max-width: 767px)": {
      borderRadius: "0px",
      borderTop: "none",
      padding: 20,
      width: "100%",
    },
  },
  consensusTextGroup: {
    alignItems: "center",
    display: "flex",
    fontSize: 14,
  },
  title: {
    fontSize: 20,
    fontStyle: "normal",
    fontWeight: 500,
    marginBottom: 18,
  },
  body: {
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
  hypoConsensusRightSide: {
    alignItems: "center",
    display: "flex",
    justifyContent: "flex-end",
    width: 172,
  },
  icon: { marginRight: 4 },
  dot: { color: colors.TEXT_GREY(1), margin: "0 8px", fontSize: 20 },
  positiveGreen: {
    color: colors.GREEN(1),
  },
  negativeRed: {
    color: colors.RED(1),
  },
});
