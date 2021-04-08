import React, { useState, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";
import PropTypes from "prop-types";

// Components
import { ClampedText } from "~/components/Typography";

import { convertDeltaToText } from "~/config/utils";
import colors from "~/config/themes/colors";

const ActivityBodyText = (props) => {
  const { activity } = props;

  const [isHidden, setIsHidden] = useState(false);

  /**
   * converts Quill Rich Text to Plain Text (only for type commentor)
   */
  const renderBodyText = () => {
    const { source, contribution_type: contributionType } = activity;
    const { text } = source;

    if (contributionType === "COMMENTER") {
      try {
        return convertDeltaToText(text);
      } catch {
        setIsHidden(true);
      }
    } else if (contributionType === "SUBMITTER") {
      return source.abstract;
    } else {
      return contributionType;
    }
  };

  return (
    <div className={css(styles.textContainer, isHidden && styles.hidden)}>
      <ClampedText lines={3} textStyles={styles.text}>
        {renderBodyText()}
      </ClampedText>
    </div>
  );
};

const styles = StyleSheet.create({
  textContainer: {},
  text: {
    color: colors.BLACK(0.8),
    fontSize: 14,
    margin: "10px 0",
    lineHeight: 1.3,
  },
  hidden: {
    display: "none",
  },
});

export default ActivityBodyText;
