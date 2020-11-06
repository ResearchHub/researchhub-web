import React, { useState, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";

// Redux
import { MessageActions } from "~/redux/message";
import { HubActions } from "~/redux/hub";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import OnboardHub from "./OnboardHub";

const OnboardHubList = (props) => {
  return (
    <div className={css(styles.root)}>
      {(props.hubs.topHubs.slice(0, 9) || []).map((hub, index) => (
        <div className={css(styles.cardContainer)}>
          <OnboardHub key={`onboadrHub-${hub.id}`} hub={hub} index={index} />
        </div>
      ))}
    </div>
  );
};

const styles = StyleSheet.create({
  root: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: 700,
    flexWrap: "wrap",
    "@media only screen and (max-width: 767px)": {
      width: "100%",
      justifyContent: "center",
    },
  },
  cardContainer: {
    margin: 5,
  },
});

const mapStateToProps = (state) => ({
  hubs: state.hubs,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnboardHubList);
