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
      reveal: false,
    };
  }

  componentDidMount = async () => {
    if (this.props.hubsList) {
      await this.setState({ hubs: hubsList });
      setTimeout(() => this.setState({ reveal: true }), 400);
    } else {
      this.fetchHubs();
    }
  };

  componentWillUnmount() {
    this.setState({ reveal: false });
  }

  fetchHubs = () => {
    return fetch(API.HUB({}), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then(async (resp) => {
        await this.setState({ hubs: resp.count > 0 ? [...resp.results] : [] });
        setTimeout(() => this.setState({ reveal: true }), 400);
      });
  };

  renderHubEntry = () => {
    return this.state.hubs.map((hub, i) => {
      let { name, id } = hub;
      function nameToUrl(name) {
        let arr = name.split(" ");
        return arr.length > 1
          ? arr.join("-").toLowerCase()
          : name.toLowerCase();
      }

      if (name !== this.props.exclude) {
        return (
          <Link href={"/hub/[hubName]"} as={`/hub/${nameToUrl(name)}`}>
            <div key={`${hub.id}-${i}`} className={css(styles.hubEntry)}>
              {name}
            </div>
          </Link>
        );
      }
    });
  };

  render() {
    let { overrideStyle, label } = this.props;

    return (
      <div className={css(styles.container, overrideStyle && overrideStyle)}>
        <div className={css(styles.hubsListContainer)}>
          <div className={css(styles.listLabel)}>
            {label ? label : "Top Hubs"}
          </div>
          <div
            className={css(styles.hubsList, this.state.reveal && styles.reveal)}
          >
            {this.renderHubEntry()}
          </div>
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
    cursor: "default",
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
  hubsList: {
    opacity: 0,
    transition: "all ease-in-out 0.2s",
  },
  reveal: {
    opacity: 1,
  },
});
