import { StyleSheet, css } from "aphrodite";
import Router from "next/router";
import { connect } from "react-redux";

import PermissionNotificationWrapper from "~/components/PermissionNotificationWrapper";
import Button from "../Form/Button";
import colors from "~/config/themes/colors";

const CreateFeedBanner = (props) => {
  const navigateToPaperUploadPage = () => {
    Router.push(`/paper/upload/info`, `/paper/upload/info`);
  };

  const navigateToUserOnnboardPage = () => {
    const { user } = props.auth;
    const authorId = user.author_profile.id;

    Router.push("/user/[authorId]/onboard", `/user/${authorId}/onboard`);
  };

  return (
    <div className={css(styles.column)}>
      <div className={css(styles.banner)}>
        <div className={css(styles.contentContainer)}>
          <h1 className={css(styles.title)}>
            {props.message
              ? props.message
              : "Follow areas of Research that you care about. Create your personalized feed by subscribing to the hubs you wish to follow."}
          </h1>
          <PermissionNotificationWrapper
            onClick={navigateToUserOnnboardPage}
            modalMessage="create your feed"
            loginRequired={true}
            permissionKey="CreatePaper"
          >
            <Button
              isWhite={true}
              hideRipples={true}
              label={"Get Started"}
              customButtonStyle={styles.button}
              customLabelStyle={styles.buttonLabel}
            />
          </PermissionNotificationWrapper>
        </div>
        <img
          draggable={false}
          src={"/static/icons/hubs-feed.svg"}
          className={css(styles.bannerImage)}
        />
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },
  banner: {
    display: "flex",
    justifyContent: "space-between",
    height: "min-content",
    width: "100%",
    backgroundColor: colors.NEW_BLUE(),
    margin: 0,
    boxSizing: "border-box",
    borderRadius: 4,
    border: "1px solid #ededed",
    boxShadow: "0px 0x 20px rgba(0, 0, 0, 0.25)",
    "@media only screen and (max-width: 767px)": {
      height: "min-content",
    },
  },
  contentContainer: {
    paddingLeft: 25,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: 30,
    "@media only screen and (max-width: 767px)": {
      padding: 20,
    },
  },
  title: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: 400,
    margin: 0,
    padding: 0,
    lineHeight: 1.3,
    "@media only screen and (max-width: 767px)": {
      fontSize: 22,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 18,
    },
  },
  bannerImage: {
    width: 270,
    objectFit: "contain",
    "@media only screen and (max-width: 1200px)": {
      display: "none",
    },
    "@media only screen and (max-width: 990px)": {
      display: "flex",
      width: "30%",
    },
    "@media only screen and (max-width: 767px)": {
      display: "none",
    },
  },
  button: {
    marginTop: 30,
    width: 200,
    ":hover": {
      color: "#fff",
      backgroundColor: "#FAFAFA",
      background: "#FAFAFA",
    },
    "@media only screen and (max-width: 767px)": {
      marginTop: 20,
      width: "unset",
    },
  },
  buttonLabel: {
    fontSize: 18,
    color: colors.NEW_BLUE(),
    "@media only screen and (max-width: 767px)": {
      fontSize: 16,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  hubs: state.hubs,
});
export default connect(
  mapStateToProps,
  null
)(CreateFeedBanner);
