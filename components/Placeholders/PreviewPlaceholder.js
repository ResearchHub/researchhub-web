import { StyleSheet, css } from "aphrodite";
import { RectShape } from "react-placeholder/lib/placeholders";
import colors from "../../config/themes/colors";

const PreviewPlaceholder = ({
  color,
  hideAnimation,
  previewStyles,
  width = 80,
  height = 90,
}) => {
  var animate = " show-loading-animation";
  if (hideAnimation) {
    animate = " ";
  }

  return (
    <div className={css(styles.placeholderContainer) + animate}>
      <RectShape
        style={{ width: width, height: height }}
        className={css(previewStyles)}
        color={color}
      />
    </div>
  );
};

const styles = StyleSheet.create({
  placeholderContainer: {
    borderRadius: 3,
    // border: `1px solid ${colors.LIGHT_GREY_BACKGROUND}`,
    background: colors.WHITE(),
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
