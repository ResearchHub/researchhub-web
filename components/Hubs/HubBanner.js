import { useState, useEffect, useRef } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";

// Redux
import { AuthActions } from "~/redux/auth";

const HubBanner = (props) => {
  const { hub } = props;

  if (hub) {
    const { hub_image } = hub;

    return (
      <img
        className={css(styles.hubBanner)}
        src={hub_image ? hub_image : "/static/background/background-home.webp"}
      />
    );
  }
  return null;
};

const styles = StyleSheet.create({
  hubBanner: {
    maxHeight: 100,
    minHeight: 100,
    height: 100,
    width: "100%",
    boxSizing: "border-box",
    borderRadius: 4,
    border: "1px solid #ededed",
    boxShadow: "0px 0x 20px rgba(0, 0, 0, 0.25)",
    objectFit: "cover",
    "@media only screen and (max-width: 760px)": {
      maxHeight: 150,
      minHeight: 150,
      height: 150,
    },
    "@media only screen and (max-width: 415px)": {
      maxHeight: 130,
      minHeight: 130,
      height: 130,
    },
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  hubs: state.hubs,
});

const mapDispatchToProps = {
  googleLogin: AuthActions.googleLogin,
  getUser: AuthActions.getUser,
};

export default connect(
  mapStateToProps,
  null
)(HubBanner);
