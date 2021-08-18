import { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";

import { TextBlock, RoundShape } from "react-placeholder/lib/placeholders";

const NotificationPlaceholder = ({ color }) => (
  <Fragment>
    <div
      className={css(styles.placeholderContainer) + " show-loading-animation"}
    >
      <div className={css(styles.row)}>
        <RoundShape className={css(styles.round)} color={color} />
        <TextBlock
          className={css(styles.textRow)}
          rows={1}
          color={color}
          style={{ width: "70%" }}
        />
      </div>
    </div>
  </Fragment>
);

const styles = StyleSheet.create({
  placeholderContainer: {
    borderRadius: 3,
    // border: "1px solid rgb(237, 237, 237)",
    padding: 8,
    background: "#fff",
    boxSizing: "border-box",
    width: "100%",
    margin: "0 auto",
  },
  round: {
    height: 30,
    width: 30,
    marginRight: 16,
  },
  row: {
    display: "flex",
  },
  textRow: {
    marginBottom: 16,
    marginTop: 8,
  },
  space: {},
  label: {},
});

export default NotificationPlaceholder;
