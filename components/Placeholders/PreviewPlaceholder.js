import { StyleSheet, css } from "aphrodite";
import { RectShape } from "react-placeholder/lib/placeholders";

const PreviewPlaceholder = ({ color, hideAnimation, previewStyles }) => {
  var animate = " show-loading-animation";
  if (hideAnimation) {
    animate = " ";
  }

  return (
    <div className={css(styles.placeholderContainer) + animate}>
      <RectShape
        style={{ width: 80, height: 90 }}
        className={css(previewStyles)}
        color={color}
      />
    </div>
  );
};

const styles = StyleSheet.create({
  placeholderContainer: {
    borderRadius: 3,
    border: "1px solid rgb(237, 237, 237)",
    background: "#fff",
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    boxSizing: "border-box",
    marginLeft: "auto",
  },
  textRow: {
    marginTop: 5,
  },
  space: {},
  label: {},
});

export default PreviewPlaceholder;
