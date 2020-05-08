import { StyleSheet, css } from "aphrodite";
import { useState } from "react";
import { useStore } from "react-redux";

import FormTextArea from "../Form/FormTextArea";
import AuthorAvatar from "../AuthorAvatar";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

const SummaryBulletPoint = ({ data, manage }) => {
  const store = useStore();
  let { text, plain_text, created_by } = data;
  let userId = store.getState().auth.user.id;
  const [hovered, toggleHover] = useState(false);
  const [editable, setEditable] = useState(userId === created_by.id);

  let authorProfile = created_by && created_by.author_profile;

  const setHover = (state) => {
    if (hovered !== state) {
      toggleHover(state);
    }
  };

  return (
    // <Ripples className={css(styles.bulletpoint, manage && styles.cursorMove)}>
    <div
      className={css(styles.bulletpoint, manage && styles.cursorMove)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {editable && hovered && (
        <div className={css(styles.editButton)}>{icons.pencil}</div>
      )}
      <div className={css(styles.topRow)}>
        <div className={css(styles.bulletpointIcon)}>
          <i class="fas fa-dot-circle" />
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
    position: "relative",
    cursor: "pointer",
    "@media only screen and (max-width: 415px)": {
      padding: 8,
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
    "@media only screen and (max-width: 415px)": {
      marginRight: 5,
    },
  },
  bulletpointText: {
    color: "#241F3A",
    fontWeight: 400,
    fontSize: 15,
    width: "100%",
    paddingTop: 4,
    boxSizing: "border-box",
    "@media only screen and (max-width: 767px)": {
      fontSize: 14,
      width: "100%",
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
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
  editButton: {
    position: "absolute",
    cursor: "pointer",
    fontSize: 12,
    top: 6,
    right: 8,
    color: "#241F3A",
  },
});

export default SummaryBulletPoint;
