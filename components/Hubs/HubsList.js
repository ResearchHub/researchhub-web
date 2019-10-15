import React from "react";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import colors from "../../config/themes/colors";

const HubsList = (props) => {
  let { hubs } = props;

  function renderHubEntry(hubs) {
    return hubs.map((hub, i) => {
      let { link, name, id } = hub;
      return (
        <Link>
          <div className={css(styles.hubEntry)}>{name}</div>
        </Link>
      );
    });
  }

  return (
    <div className={css(styles.hubsListContainer)}>
      <div className={css(styles.listLabel)}>Top Hub</div>
      <div className={css(styles.hubsList)}>{renderHubEntry(hubs)}</div>
    </div>
  );
};

export default HubsList;

const styles = StyleSheet.create({
  hubsListContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: "calc(100% * .1875)",
  },
  text: {
    fontFamily: "Roboto",
  },
  listLabel: {
    fontWeight: "bold",
    textDecorate: "uppercase",
    fontSize: 12,
    letterSpacing: 1.2,
    color: "#a7a6b0",
  },
  hubEntry: {
    fontSize: 16,
    fontWeight: 300,
    cursor: "pointer",
    ":hover": {
      color: colors.BLUE(1),
    },
  },
});
