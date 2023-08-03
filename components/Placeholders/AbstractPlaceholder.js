import { StyleSheet, css } from "aphrodite";

import { TextBlock, TextRow } from "react-placeholder/lib/placeholders";
import colors from "../../config/themes/colors";

const AbstractPlaceholder = ({ color }) => (
  <div className={"show-loading-animation"}>
    <TextBlock
      className={css(styles.textRow)}
      rows={15}
      color={color}
      style={{ width: "100%" }}
    />
    <TextRow
      className={css(styles.textRow)}
      color={color}
      style={{ width: "80%" }}
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

export default AbstractPlaceholder;
