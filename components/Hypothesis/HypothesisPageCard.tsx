import React, { ReactElement, useEffect, useState } from "react";
import { css, StyleSheet } from "aphrodite";
import dayjs from "dayjs";
import ReactHtmlParser from "react-html-parser";
import { formatPublishedDate } from "../../config/utils/dates";
import colors from "../../config/themes/colors";

// Components
import VoteWidget from "../../components/VoteWidget";
import PaperMetadata from "../../components/Paper/PaperMetadata";
import PaperPromotionIcon from "../../components/Paper/PaperPromotionIcon";

const renderMetadata = (hypothesis) => {
  const created_date = hypothesis.created_date;
  const metadata = [
    {
      label: "Published",
      value: (
        <span
          className={css(styles.metadata) + " clamp1"}
          property="datePublished"
        >
          {formatPublishedDate(dayjs(created_date), true)}
        </span>
      ),
      active: created_date,
    },
  ];
  return (
    <div className={css(styles.row)}>
      {metadata.map((props, i) => (
        <PaperMetadata key={`metadata-${i}`} {...props} />
      ))}
    </div>
  );
};

const voteWidget = (horizontalView) => (
  <VoteWidget
    //score={score + post.boost_amount}
    //onUpvote={onUpvote}
    //onDownvote={onDownvote}
    //selected={voteState}
    horizontalView={horizontalView}
    isPaper={false}
    type={"Hypothesis"}
  />
);

export default function HypothesisPageCard({
  hypothesis,
}): ReactElement<"div"> {
  const [showHypothesisEditor, setShowHypothesisEditor] = useState(false);
  const [hypothesisBody, setHypothesisBody] = useState(
    hypothesis.full_markdown
  );

  useEffect(() => {
    setHypothesisBody(hypothesis.full_markdown);
  }, [hypothesis]);

  return (
    <div className={css(styles.hypothesisCard)}>
      <div className={css(styles.voting)}>
        {voteWidget(false)}
        {/* <PaperPromotionIcon hypothesis={null} /> */}
      </div>
      <div className={css(styles.column)}>
        <div className={css(styles.reverseRow)}>
          <div className={css(styles.cardContainer)}>
            <div className={css(styles.metaContainer)}>
              <div className={css(styles.titleHeader)}>
                <div className={css(styles.row)}>
                  <h1 className={css(styles.title)} property={"headline"}>
                    {hypothesis.title}
                  </h1>
                </div>
              </div>
              <div className={css(styles.column)}>
                {renderMetadata(hypothesis)}
              </div>
              <div className="ck-content">
                {showHypothesisEditor ? null : ( //renderHypothesisEditor()
                  <>{hypothesisBody && ReactHtmlParser(hypothesisBody)}</>
                )}
              </div>
            </div>
          </div>
          <div className={css(styles.rightColumn, styles.mobile)}>
            <div className={css(styles.votingMobile)}>
              {voteWidget(true)}
              {/* <PaperPromotionIcon hypothesis={null} /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  hypothesisCard: {
    display: "flex",
    flexDirection: "row",
    border: "1.5px solid #F0F0F0",
    backgroundColor: "#fff",
    boxShadow: "0px 3px 4px rgba(0, 0, 0, 0.02)",
    padding: "20px 30px 30px 20px",
    boxSizing: "border-box",
    borderRadius: 4,
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
  voting: {
    display: "block",
    width: 65,
    fontSize: 16,
    "@media only screen and (max-width: 767px)": {
      display: "none",
    },
  },
  votingMobile: {
    "@media only screen and (min-width: 768px)": {
      display: "none",
    },
    display: "flex",
    alignItems: "center",
  },
  cardContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
  },
  metaContainer: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    height: "100%",
    width: "100%",
    boxSizing: "border-box",
  },
  title: {
    fontSize: 28,
    position: "relative",
    wordBreak: "break-word",
    fontWeight: "unset",
    padding: 0,
    margin: 0,
    display: "flex",

    "@media only screen and (max-width: 760px)": {
      fontSize: 24,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 22,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 20,
    },
  },
  titleHeader: {
    marginTop: 5,
    marginBottom: 23,
  },
  mobile: {
    display: "none",
    "@media only screen and (max-width: 767px)": {
      display: "flex",
      marginLeft: 0,
      justifyContent: "space-between",
      alignItems: "flex-start",
      flexDirection: "row",
      paddingBottom: 10,
    },
  },
  metadata: {
    fontSize: 16,
    color: colors.BLACK(0.7),
    margin: 0,
    padding: 0,
    fontWeight: "unset",
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
  row: {
    display: "flex",
    alignItems: "flex-start",
    width: "100%",
    // minHeight: 25,
    flexWrap: "wrap",

    /**
     * Set the width of the Label ("Paper Title:", "Published:") to align text, but only do so
     * to the first element on each row. This selector is equivalent to row > "first child". */
    ":nth-child(1n) > *:nth-child(1) > div": {
      minWidth: 80,
    },

    "@media only screen and (max-width: 1023px)": {
      flexDirection: "column",
    },
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "100%",
    ":hover .action-bars": {
      opacity: 1,
    },
  },
  rightColumn: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    marginLeft: 20,
    "@media only screen and (max-width: 768px)": {
      width: "100%",
    },
  },
  reverseRow: {
    display: "flex",
    alignItems: "flex-start",
    width: "100%",
    "@media only screen and (max-width: 767px)": {
      flexDirection: "column-reverse",
    },
  },
});
