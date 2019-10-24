import React from "react";
import Link from "next/link";
import { StyleSheet, css } from "aphrodite";

// Components
import VotingWidget from "../VoteWidget";
import AuthorAvatar from "~/components/AuthorAvatar";
import HubTag from "./HubTag";
import TextEditor from "../TextEditor/index";

// Utility
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import { convertNumToMonth } from "~/config/utils/options";

const PaperEntryCard = ({ paper, index, hubName }) => {
  const {
    id,
    authors,
    discussion,
    doi,
    file,
    hubs,
    paper_publish_date,
    publication_type,
    title,
    summary,
    tagline,
  } = paper;

  function convertDate() {
    let dateArr = paper_publish_date.split("-");
    dateArr[1] = convertNumToMonth[dateArr[1]];
    if (dateArr.length > 2) {
      return `Published: ${dateArr[0]} ${dateArr[1]}, ${dateArr[2]}`;
    } else {
      return `Published: ${dateArr[1]}, ${dateArr[2]}`;
    }
  }

  return (
    <Link href={"/paper/[paperId]/[tabName]"} as={`/paper/${id}/summary`}>
      <div className={css(styles.papercard)} key={`${id}-${index}-${title}`}>
        <div className={css(styles.column)}>
          <span className={css(styles.voting)}>
            <VotingWidget />
          </span>
        </div>
        <div className={css(styles.column, styles.metaData)}>
          <div className={css(styles.title, styles.text)}>{title && title}</div>
          <div className={css(styles.publishDate, styles.text)}>
            {convertDate()}
          </div>
          <div className={css(styles.summary, styles.text)}>
            {/* <TextEditor readOnly={true} /> */}
            {tagline
              ? tagline
              : "Carbonic anhydrase IX (CAIX) is a membrane spanning protein involved in the enzymatic regulation of tumoracid-base balance. CAIX has been shown to be elevated in a number of hypoxic tumor types. The purpose of this study was to determine the efficiency of intact and IgG fragments of cG250."}
          </div>
          <div className={css(styles.bottomBar)}>
            <div className={css(styles.row)}>
              <span
                className={css(
                  styles.avatars,
                  authors.length < 1 && styles.hide
                )}
              >
                {authors.length > 0 &&
                  authors.map((author) => (
                    <AuthorAvatar
                      avatarClassName={css(styles.avatar)}
                      size={30}
                      textSizeRatio={2.5}
                      author={author}
                    />
                  ))}
              </span>
              <Link
                href={"/paper/[paperId]/[tabName]"}
                as={`/paper/${id}/discussion`}
              >
                <div className={css(styles.discussion)}>
                  <span className={css(styles.icon)} id={"discIcon"}>
                    {icons.chat}
                  </span>
                  <span className={css(styles.dicussionCount)} id={"discCount"}>
                    {`${discussion.count}`}{" "}
                    {discussion.count === 1 ? "discussion" : "discussions"}
                  </span>
                </div>
              </Link>
            </div>
            <div className={css(styles.tags, styles.right)}>
              {hubs.length > 0 &&
                hubs.map((tag) => <HubTag tag={tag} hubName={hubName} />)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const styles = StyleSheet.create({
  papercard: {
    width: "95%",
    // width: 1202,
    height: 208,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "27px 15px 27px 15px",
    cursor: "pointer",
    ":hover": {
      backgroundColor: "#FAFAFA",
    },
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: "100%",
    position: "relative",
  },
  title: {
    maxWidth: "95%",
    fontSize: 22,
    fontWeight: 500,
  },
  publishDate: {
    maxWidth: "100%",
    fontSize: 14,
    fontWeight: 400,
    color: "#918F9B",
    marginTop: 10,
  },
  summary: {
    minWidth: "100%",
    maxWidth: "100%",
    height: 90,
    maxHeight: 90,
    whiteSpace: "pre-wrap",
    color: "#4e4c5f",
    fontSize: 16,
    marginTop: 15,
    overflow: "hidden",
  },
  text: {
    fontFamily: "Roboto",
  },
  voting: {
    marginTop: -21,
    width: 48,
  },
  bottomBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    left: 0,
    bottom: 10,
    width: "100%",
  },
  icon: {
    color: "#C1C1CF",
  },
  discussion: {
    cursor: "pointer",
    ":hover #discIcon": {
      color: colors.BLUE(1),
    },
    ":hover #discCount": {
      color: colors.BLUE(1),
    },
  },
  dicussionCount: {
    color: "#918f9b",
    marginLeft: 7,
  },
  tags: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  row: {
    display: "flex",
    alignItems: "center",
    height: 30,
  },
  avatars: {
    display: "flex",
    justifyContent: "flex-start",
    marginRight: 27,
    // width: 105
  },
  avatar: {
    marginRight: 5,
  },
  hide: {
    display: "none",
    marginRight: 0,
  },
  metaData: {
    width: "calc(100% - 48px)",
  },
});

export default PaperEntryCard;
