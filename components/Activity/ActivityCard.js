import React, { useState, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";
import Ripples from "react-ripples";
import PropTypes from "prop-types";
import Link from "next/link";

// Components
import TextEditor from "~/components/TextEditor"; // QuillTextEditor
import ActivityUserLine from "./ActivityUserLine";
import { TimeStamp } from "~/components/Notifications/NotificationHelpers";
import { ClampedText } from "~/components/Typography";
import HubTag from "~/components/Hubs/HubTag";

import colors from "~/config/themes/colors";

const ActivityCard = (props) => {
  const { activity, last } = props;
  const { created_date: createdDate, comment, paper } = activity;
  const { id: paperId, slug: paperName } = paper;

  const formatProps = (type) => {
    switch (type) {
      case "timestamp":
        return {
          date: createdDate,
          removeIcon: true,
        };
      case "hub":
        const hub = paper.hubs[0]; // we only show one hub tag (first)
        return {
          tag: hub,
          last: true,
        };
    }
  };

  const renderComment = () => {
    const { plain_text } = comment;
    // QUILL IMPLEMENTATION
    // if (typeof paper.text !== "string") {
    //   return (
    //     <TextEditor
    //     // classNames={[styles.commentEditor]}
    //     // commentStyles={this.props.commentStyles && this.props.commentStyles}
    //       readOnly={true}
    //       initialValue={paper.text}
    //     />
    //   )
    // }

    // PLAIN TEXT
    return (
      <ClampedText lines={3} textStyles={styles.text}>
        {plain_text}
      </ClampedText>
    );
  };

  return (
    <Link
      href={"/paper/[paperId]/[paperName]"}
      as={`/paper/${paperId}/${paperName}`}
    >
      <a className={css(styles.link)}>
        <Ripples className={css(styles.root)}>
          <ActivityUserLine {...props} />
          {renderComment()}
          <div className={css(styles.row, last && styles.noBorderBottom)}>
            <TimeStamp {...formatProps("timestamp")} />
            <HubTag {...formatProps("hub")} />
          </div>
        </Ripples>
      </a>
    </Link>
  );
};

const styles = StyleSheet.create({
  root: {
    display: "flex",
    flexDirection: "column",
    padding: "10px 20px 0px 17px", // 3px removed from left to offset border hover
    boxSizing: "border-box",
    width: "100%",
    borderLeft: `3px solid #FFF`,
    ":hover": {
      cursor: "pointer",
      background: "#FAFAFA",
      borderLeft: `3px solid ${colors.NEW_BLUE()}`,
      transition: "all ease-in-out 0.2s",
    },
  },
  link: {
    textDecoration: "unset",
    color: "unset",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingBottom: 20,
    borderBottom: `1px solid ${colors.BLACK(0.2)}`,
  },
  noBorderBottom: {
    borderBottom: "none",
  },
  text: {
    color: colors.BLACK(0.8),
    fontSize: 14,
    margin: "10px 0",
    lineHeight: 1.3,
  },
});

export default ActivityCard;
