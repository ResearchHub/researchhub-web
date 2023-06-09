import { StyleSheet, css } from "aphrodite";
import { RectShape } from "react-placeholder/lib/placeholders";
import colors from "./lib/colors";


const CommentEditorPlaceholder = () => {
  return (
    <div className={css(styles.wrapper) + " show-loading-animation"}>
      <RectShape
        color={colors.placeholder}
        style={{ width: "100%" }}
      />
    </div>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: 226,
  },
});

export default CommentEditorPlaceholder;
