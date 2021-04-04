import React, { useState } from "react";
import { StyleSheet, css } from "aphrodite";
import PropTypes from "prop-types";
import Link from "next/link";

import { ClampedText } from "~/components/Typography";

import colors from "~/config/themes/colors";
import { getAuthorName } from "~/config/utils/";

const ActivityDescription = (props) => {
  const [lines, setLines] = useState(2);
  const { activity, author, contributionType, username } = props;
  const { source, paper, content_type: contentType } = activity;
  const { id: authorId } = author;
  const paperTitle = paper["paper_title"] || paper["title"];

  const renderUsername = () => {
    return (
      <Link
        href={"/user/[authorId]/[tabName]"}
        as={`/user/${authorId}/contributions`}
      >
        <a className={css(styles.link)}>
          <span className={css(styles.text)}>{username}</span>
        </a>
      </Link>
    );
  };

  const updateClampStyle = (amount) => {
    if (amount !== lines) {
      setLines(amount);
    }
  };

  const renderTitle = () => {
    /**
     *  linking to paper page is already handled by the parent component
     *  adding link is redundant
     * */

    return <span className={css(styles.text)}>{paperTitle}</span>;
  };

  /**
   * handles the transformation from metadata to user readable string
   */
  const renderActionString = () => {
    console.log("called renderActionString ", contributionType);

    switch (contributionType) {
      case "CURATOR":
        return handleCuratorString();
      case "UPVOTER":
        return handleUpvoterString();
      case "SUPPORTER":
        return handleSupporterString();
      case "SUBMITTER":
        return " submitted ";
      case "COMMENTER":
        return " commented on ";
      case "VIEWER":
        return " viewed ";
      default:
        return null;
    }
  };

  const handleCuratorString = () => {
    const key = contentType["app_label"];

    const keyToString = {
      bullet_point: "key takeaway",
      summary: " summary",
    };

    updateClampStyle(3);
    return ` added a ${keyToString[key]} for `;
  };

  const handleUpvoterString = () => {
    const key = contentType["app_label"];
    const voteType = source["vote_type"];

    const voteTypeToString = {
      1: " upvoted",
      2: " downvoted",
    };

    const keyToString = {
      paper: " ",
      summary: " the summary for ",
      discusison: " a comment for ",
      bullet_point: " a key takeaway for ",
    };

    const action = voteTypeToString[voteType];
    const object = keyToString[key];

    updateClampStyle(3);

    return action + object;
  };

  const handleSupporterString = () => {
    const { amount } = source;
    updateClampStyle(3);
    return ` supported (${amount} RSC) `;
  };

  const renderHeader = () => {
    return (
      <span onClick={(e) => e.stopPropagation()}>
        {renderUsername()}
        {renderActionString()}
        {renderTitle()}
      </span>
    );
  };

  return (
    <ClampedText lines={lines} textStyles={styles.textContainer}>
      {renderHeader()}
    </ClampedText>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    color: colors.BLACK(0.6),
    paddingLeft: 5,
    fontSize: 14,
    lineHeight: 1.3,
  },
  link: {
    textDecoration: "unset",
    cursor: "pointer",
    color: "unset",
  },
  text: {
    fontWeight: 500,
    color: colors.BLACK(0.8),
    ":hover": {
      color: colors.BLUE(),
    },
  },
});

export default ActivityDescription;
