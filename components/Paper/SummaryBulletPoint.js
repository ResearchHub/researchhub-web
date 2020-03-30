import { StyleSheet, css } from "aphrodite";
import Ripples from "react-ripples";

import FormTextArea from "../Form/FormTextArea";
import AuthorAvatar from "../AuthorAvatar";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "~/config/themes/colors";

const SummaryBulletPoint = ({ data, editable, manage }) => {
  let { text, plain_text, created_by } = data;
  let authorProfile = created_by && created_by.author_profile;

  return (
    // <Ripples className={css(styles.bulletpoint, manage && styles.cursorMove)}>
    <div className={css(styles.bulletpoint, manage && styles.cursorMove)}>
      <div className={css(styles.topRow)}>
        <div className={css(styles.bulletpointIcon)}>
          <i class="fad fa-scrubber" />
        </div>
        <div className={css(styles.bulletpointText)}>
          {plain_text && plain_text}
        </div>
      </div>
      {/* {authorProfile && (
        <div className={css(styles.bottomRow)}>
          <span className={css(styles.contributorText)}>Contributors</span>
          <AuthorAvatar author={authorProfile} size={25} />
        </div>
      )} */}
    </div>
    // </Ripples>
  );
};

const styles = StyleSheet.create({
  bulletpoint: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#FBFBFD",
    alignItems: "flex-start",
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
  topRow: {
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
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
    paddingTop: 4,
  },
  bottomRow: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    paddingLeft: 50,
    marginTop: 5,
  },
  contributorText: {
    color: "rgba(36, 31, 58, 0.4)",
    fontStyle: "italic",
    fontSize: 14,
    marginRight: 8,
  },
  cursorMove: {
    cursor: "move",
  },
});

export default SummaryBulletPoint;
