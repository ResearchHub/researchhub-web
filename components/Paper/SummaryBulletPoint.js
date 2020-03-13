import { StyleSheet, css } from "aphrodite";
import Ripples from "react-ripples";

import FormTextArea from "../Form/FormTextArea";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "~/config/themes/colors";

const SummaryBulletPoint = ({ data, editable, manage }) => {
  let { text, plain_text } = data;
  return (
    <Ripples className={css(styles.bulletpoint, manage && styles.cursorMove)}>
      <div className={css(styles.bulletpointIcon)}>
        <i class="far fa-chevron-down" />
      </div>
      <div className={css(styles.bulletpointText)}>
        {plain_text && plain_text}
      </div>
    </Ripples>
  );
};

const styles = StyleSheet.create({
  bulletpoint: {
    display: "flex",
    backgroundColor: "#FBFBFD",
    alignItems: "center",
    boxSizing: "border-box",
    borderRadius: 3,
    padding: 16,
    marginBottom: 10,
    border: "1px solid #F0F0F0",
    // cursor: "pointer",
    ":hover": {
      // borderColor: "#E0E0E0",
    },
  },
  bulletpointIcon: {
    color: "#3971FF",
    height: 30,
    minHeight: 30,
    maxHeight: 30,
    width: 30,
    minWidth: 30,
    maxWidth: 30,
    borderRadius: "50%",
    boxSizing: "border-box",
    paddingTop: 3,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    border: `1.5px solid #3971FF`,
  },
  bulletpointText: {
    color: "#241F3A",
    fontWeight: 400,
    fontSize: 15,
    width: "calc(100% - 90px)",
  },
  cursorMove: {
    cursor: "move",
  },
});

export default SummaryBulletPoint;
