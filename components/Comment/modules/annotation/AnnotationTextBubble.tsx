import { truncateText } from "~/config/utils/string";
import { css, StyleSheet } from "aphrodite";
import colors from "../../lib/colors";

const AnnotationTextBubble = ({ text }) => {
  const _text = truncateText(text || "", 350);
  return (
    <div className={css(styles.annotationText)}>
      <div>{_text}</div>
    </div>
  );
};

const styles = StyleSheet.create({
  annotationText: {
    background: colors.annotation.unselected,
    padding: "15px 20px",
    borderRadius: "0 4px 4px 0",
    marginBottom: 15,
    fontStyle: "italic",
    fontSize: 15,
    borderLeft: "2px solid rgb(255, 212, 0)",
  },
});

export default AnnotationTextBubble;
