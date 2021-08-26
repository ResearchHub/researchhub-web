import { useState } from "react";
import { StyleSheet, css } from "aphrodite";

// Components
import { ClampedText } from "~/components/Typography";

import { convertDeltaToText } from "~/config/utils/editor";
import colors from "~/config/themes/colors";

const ActivityBody = (props) => {
  const { activity } = props;

  const [isHidden, setIsHidden] = useState(false);

  /**
   * converts Quill Rich Text to Plain Text (only for type commentor)
   */
  const renderBodyText = () => {
    try {
      const { source, contribution_type: contributionType } = activity;
      const { text } = source;
      if (contributionType === "COMMENTER") {
        return convertDeltaToText(text);
      } else if (contributionType === "SUBMITTER") {
        return source.abstract;
      } else {
        // return contributionType;
      }
    } catch {
      !isHidden && setIsHidden(true);
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

export default ActivityBody;
