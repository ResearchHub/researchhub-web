import React from "react";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";

// Config
import colors from "../../config/themes/colors";
import API from "../../config/api";
import { Helpers } from "@quantfive/js-web-config";

export default class HubsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hubs: [],
    };
  }

  componentDidMount() {
    if (this.props.hubsList) {
      this.setState({ hubs: hubsList });
    } else {
      this.fetchHubs();
    }
  }

  fetchHubs = () => {
    return fetch(API.HUB({}), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((resp) => {
        this.setState({ hubs: resp.count > 0 ? [...resp.results] : [] });
      });
  };

  renderHubEntry = () => {
    return this.state.hubs.map((hub, i) => {
      let { name, id } = hub;
      return (
        <Link href={"/hub/[hubname]/"} as={`/hub/${name}/`}>
          <div key={`${hub.id}-${i}`} className={css(styles.hubEntry)}>
            {name}
          </div>
        </Link>
      );
    });
  };

  render() {
    return (
      <div className={css(styles.container)}>
        <div className={css(styles.hubsListContainer)}>
          <div className={css(styles.listLabel)}>Top Hubs</div>
          <div className={css(styles.hubsList)}>{this.renderHubEntry()}</div>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "calc(100% * .625)",
    // height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  hubsListContainer: {
    maxWidth: 203,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    textAlign: "left",
  },
  text: {
    fontFamily: "Roboto",
  },
  listLabel: {
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 12,
    letterSpacing: 1.2,
    color: "#a7a6b0",
    marginBottom: 20,
  },
  hubEntry: {
    fontSize: 16,
    fontWeight: 300,
    cursor: "pointer",
    textTransform: "capitalize",
    marginBottom: 15,
    ":hover": {
      color: colors.BLUE(1),
    },
  },
});
