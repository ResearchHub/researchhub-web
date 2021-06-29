import { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import Router from "next/router";
import { connect } from "react-redux";
import NewPostButton from "../NewPostButton";
import PermissionNotificationWrapper from "~/components/PermissionNotificationWrapper";
import Button from "../Form/Button";
import colors from "~/config/themes/colors";
import PropTypes from "prop-types";

const EmptyFeedScreen = (props) => {
  const navigateToPaperUploadPage = () => {
    Router.push(`/paper/upload/info`, `/paper/upload/info`);
  };

  const renderContent = () => {
    const { hubs, title, subTitle } = props;

    const subscribedHubs = hubs.subscribedHubs || [];
    if (props.activeFeed === 0 && !subscribedHubs.length) {
      return null;
    }

    return (
      <Fragment>
        <img
          className={css(styles.emptyPlaceholderImage)}
          src={"/static/background/homepage-empty-state.png"}
          loading="lazy"
          alt="Empty State Icon"
        />
        <span className={css(styles.emptyPlaceholderText)}>{title}</span>
        <span className={css(styles.emptyPlaceholderSubtitle)}>{subTitle}</span>
        <div className={css(styles.row)}>
          <NewPostButton />
        </div>
      </Fragment>
    );
  };
  return <div className={css(styles.column)}>{renderContent()}</div>;
};

const styles = StyleSheet.create({
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },
  row: {
    display: "flex",
    justifyContent: "center",
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
  hubs: state.hubs,
});

EmptyFeedScreen.propTypes = {
  hubs: PropTypes.object,
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired,
};

EmptyFeedScreen.defaultProps = {
  title: "TXXX",
  subTitle: "Click ‘New Post’ button to create a post",
};

export default connect(
  mapStateToProps,
  null
)(EmptyFeedScreen);
