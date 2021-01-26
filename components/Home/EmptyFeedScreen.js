import { StyleSheet, css } from "aphrodite";
import Router from "next/router";

import PermissionNotificationWrapper from "~/components/PermissionNotificationWrapper";
import Button from "../Form/Button";

const EmpytFeedScreen = () => {
  const navigateToPaperUploadPage = () => {
    Router.push(`/paper/upload/info`, `/paper/upload/info`);
  };

  return (
    <div className={css(styles.column)}>
      <img
        className={css(styles.emptyPlaceholderImage)}
        src={"/static/background/homepage-empty-state.png"}
        loading="lazy"
        alt="Empty State Icon"
      />
      <span className={css(styles.emptyPlaceholderText)}>
        There are no academic papers uploaded for this hub.
      </span>
      <span className={css(styles.emptyPlaceholderSubtitle)}>
        Click ‘Upload paper’ button to upload a PDF
      </span>
      <PermissionNotificationWrapper
        onClick={navigateToPaperUploadPage}
        modalMessage="upload a paper"
        loginRequired={true}
        permissionKey="CreatePaper"
      >
        <Button label={"Upload Paper"} hideRipples={true} />
      </PermissionNotificationWrapper>
    </div>
  );
};

const styles = StyleSheet.create({
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  emptyPlaceholderImage: {
    width: 400,
    objectFit: "contain",
    marginTop: 40,
    "@media only screen and (max-width: 415px)": {
      width: "70%",
    },
  },
  emptyPlaceholderText: {
    textAlign: "center",
    fontSize: 22,
    color: "#241F3A",
    marginTop: 20,
    "@media only screen and (max-width: 767px)": {
      fontSize: 16,
    },
    "@media only screen and (max-width: 415px)": {
      width: "85%",
    },
  },
  emptyPlaceholderSubtitle: {
    textAlign: "center",
    fontSize: 18,
    color: "#4e4c5f",
    marginTop: 10,
    marginBottom: 15,
    "@media only screen and (max-width: 767px)": {
      fontSize: 14,
    },
    "@media only screen and (max-width: 415px)": {
      width: "85%",
    },
  },
});

export default EmpytFeedScreen;
