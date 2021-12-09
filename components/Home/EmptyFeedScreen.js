import { connect } from "react-redux";
import { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import NewPostButton from "../NewPostButton";

import PropTypes from "prop-types";
import Router from "next/router";

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
  title: "There are no posts found for this criteria",
  subTitle: "Click ‘New Post’ button to create a post",
};

export default connect(mapStateToProps, null)(EmptyFeedScreen);
