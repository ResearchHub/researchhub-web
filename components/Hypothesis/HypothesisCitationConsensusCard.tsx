import { css, StyleSheet } from "aphrodite";
import { silentEmptyFnc } from "~/config/utils/nullchecks";
import { TextRow } from "react-placeholder/lib/placeholders";
import CitationConsensusItem from "./Citation/table/CitationConsensusItem";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import React, { ReactElement } from "react";
import { ID } from "~/config/types/root_types";

type Props = {
  aggregateCitationConsensus: {
    citationCount: number;
    downCount: number;
    neutralCount: number;
    upCount: number;
  };
  hypothesisID: ID;
  isLoading?: boolean;
};

export default function HypothesisCitationConsensusCard({
  aggregateCitationConsensus: {
    citationCount,
    downCount,
    neutralCount,
    upCount,
  },
  hypothesisID,
  isLoading,
}: Props): ReactElement<"div"> | null {
  if (citationCount === 0) {
    return null;
  }

  const sentiment = upCount - downCount;
  const totalVoteCount = downCount + neutralCount + upCount;

  return (
    <div className={css(styles.hypothesisCitationConsensusCard)}>
      <div className={css(styles.title)}>{"Current conclusion"}</div>
      {Boolean(isLoading) ? (
        <div className={css(styles.body)}>
          <TextRow
            color={colors.LIGHT_GREY_BORDER}
            style={{
              width: "100%",
              height: 24,
              margin: "0",
              borderRadius: 4,
            }}
          />
        </div>
      ) : (
        <div className={css(styles.body)}>
          <div className={css(styles.consensusTextGroup)}>
            <div className={css(styles.iconGroup)}>
              <span
                className={css(
                  styles.icon,
                  sentiment > 0
                    ? styles.positiveGreen
                    : sentiment < 0
                    ? styles.negativeRed
                    : null
                )}
              >
                {sentiment > 0 ? (
                  <img src="/static/icons/check.svg" />
                ) : sentiment < 0 ? (
                  icons.timesCircle
                ) : (
                  icons.minusCircle
                )}
              </span>
              <span>
                {`Probably ${
                  downCount === upCount
                    ? "neutral"
                    : downCount > upCount
                    ? "no"
                    : "yes"
                }`}
              </span>
            </div>
            <span className={css(styles.dot)}>{"\u2022"}</span>
            <span>{`Based on ${citationCount} source${
              citationCount > 1 ? "s" : ""
            } and ${totalVoteCount} consensus vote${
              totalVoteCount > 1 ? "s" : ""
            }.`}</span>
          </div>
          <div className={css(styles.hypoConsensusRightSide)}>
            <CitationConsensusItem
              citationID={`${hypothesisID}-citation-placeholder`}
              consensusMeta={{
                downCount,
                neutralCount,
                upCount,
                userVote: {},
              }}
              shouldAllowVote={false}
              updateLastFetchTime={silentEmptyFnc}
            />
          </div>
        </div>
      )}
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
  based: {
    flex: 1,
    "@media only screen and (max-width: 767px)": {
      marginTop: 8,
    },
  },
  consensusTextGroup: {
    alignItems: "center",
    display: "flex",
    fontSize: 14,
    "@media only screen and (max-width: 767px)": {
      flexDirection: "column",
      width: "100%",
      alignItems: "flex-start",
    },
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
    "@media only screen and (max-width: 767px)": {
      flexDirection: "column",
    },
  },
  hypoConsensusRightSide: {
    alignItems: "center",
    display: "flex",
    justifyContent: "flex-end",
    width: 172,
    "@media only screen and (max-width: 767px)": {
      marginTop: 16,
      width: "100%",
    },
  },
  icon: {
    marginRight: 4,
    display: "flex",
  },
  iconGroup: {
    display: "flex",

    "@media only screen and (max-width: 767px)": {
      marginBottom: 16,
    },
  },
  dot: {
    color: colors.TEXT_GREY(1),
    margin: "0 8px",
    fontSize: 20,
    "@media only screen and (max-width: 767px)": {
      display: "none",
    },
  },
  positiveGreen: {
    color: colors.GREEN(1),
  },
  negativeRed: {
    color: colors.RED(1),
  },
});
