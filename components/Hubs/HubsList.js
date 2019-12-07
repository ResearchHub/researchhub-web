import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import Router from "next/router";
import { connect } from "react-redux";
import Ripples from "react-ripples";

// Config
import colors from "../../config/themes/colors";
import API from "../../config/api";
import { Helpers } from "@quantfive/js-web-config";

// Redux
import { HubActions } from "~/redux/hub";

class HubsList extends React.Component {
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

  componentDidUpdate = async (prevProps) => {
    if (prevProps.exclude !== this.props.exclude) {
      await this.setState({ reveal: false });
      setTimeout(() => this.setState({ reveal: true }), 400);
    }
  };

  componentWillUnmount() {
    this.setState({ reveal: false });
  }

  fetchHubs = async () => {
    if (!this.props.hubs.length > 0) {
      await this.props.getHubs();
    }
    await this.setState({ hubs: this.props.hubs });
    setTimeout(() => this.setState({ reveal: true }), 400);
  };

  renderHubEntry = () => {
    let selectedHubs =
      this.state.hubs.length > 9
        ? this.state.hubs.slice(0, 9)
        : this.state.hubs;
    return selectedHubs.map((hub, i) => {
      let { name, id } = hub;
      if (name !== this.props.exclude) {
        return (
          <Fragment key={`${id}-${i}`}>
            <Ripples onClick={() => this.handleClick(hub)}>
              <div key={`${id}-${i}`} className={css(styles.hubEntry)}>
                {name}
              </div>
            </Ripples>
            <div className={css(styles.space)} />
          </Fragment>
        );
      }
    });
  };

  handleClick = (hub) => {
    function nameToUrl(name) {
      let arr = name.split(" ");
      return arr.length > 1 ? arr.join("-").toLowerCase() : name.toLowerCase();
    }
    this.props.updateCurrentHubPage(hub);
    Router.push("/hubs/[hubname]", `/hubs/${nameToUrl(hub.name)}`);
  };

  render() {
    let { overrideStyle, label } = this.props;

    return (
      <div className={css(styles.container, overrideStyle && overrideStyle)}>
        <div className={css(styles.hubsListContainer)}>
          <div className={css(styles.listLabel)}>{"Top Hubs"}</div>
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
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  hubsListContainer: {
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
    ":hover": {
      color: colors.BLUE(1),
    },
  },
  hubsList: {
    opacity: 0,
  },
  reveal: {
    opacity: 1,
    transition: "all ease-in-out 0.2s",
  },
  space: {
    height: 15,
  },
});

const mapStateToProps = (state) => ({
  hubs: state.hubs.hubs,
});

const mapDispatchToProps = {
  updateCurrentHubPage: HubActions.updateCurrentHubPage,
  getHubs: HubActions.getHubs,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HubsList);
