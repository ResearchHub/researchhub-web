import { StyleSheet, css } from "aphrodite";

import { TextBlock, TextRow } from "react-placeholder/lib/placeholders";

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
    border: "1px solid rgb(237, 237, 237)",
    padding: "23px 15px",
    paddingLeft: 80,
    background: "#fff",
  },
  textRow: {
    marginBottom: 16,
  },
  space: {},
  label: {},
});

export default BulletPlaceholder;
