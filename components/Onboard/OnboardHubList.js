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
  const { onClick, hubs } = props;

  return (
    <div className={css(styles.root)}>
      {(hubs || []).map((hub, index) => (
        <div className={css(styles.cardContainer)}>
          <OnboardHub
            key={`onboardHub-${hub.id}`}
            hub={hub}
            index={index}
            onClick={onClick}
          />
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
    maxWidth: 700,
    width: "100%",
    flexWrap: "wrap",
    "@media only screen and (max-width: 936px)": {
      // width: "100%",
      justifyContent: "center",
    },
  },
  cardContainer: {
    margin: 5,
  },
});

export default OnboardHubList;
