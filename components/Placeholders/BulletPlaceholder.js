import { StyleSheet, css } from "aphrodite";

import { TextBlock, TextRow } from "react-placeholder/lib/placeholders";
import colors from "../../config/themes/colors";

const BulletPlaceholder = ({ color }) => (
  <div className={css(styles.placeholderContainer) + " show-loading-animation"}>
    <TextBlock
      className={css(styles.textRow)}
      rows={1}
      color={color}
      style={{ width: "100%" }}
    />
    <TextRow
      className={css(styles.textRow)}
      color={color}
      style={{ width: "70%" }}
    />
  </div>
);

const styles = StyleSheet.create({
  placeholderContainer: {
    borderRadius: 3,
    border: `1px solid ${colors.LIGHT_GREY_BACKGROUND}`,
    padding: "23px 15px",
    paddingLeft: 80,
    background: colors.WHITE(),
  },
  textRow: {
    marginBottom: 16,
  },
  space: {},
  label: {},
});

export default BulletPlaceholder;
