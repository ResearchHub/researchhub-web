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

const DEFAULT_TRANSITION_TIME = 400;

class HubsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hubs: [],
      reveal: false,
    };
  }

  componentDidMount() {
    if (this.props.hubs) {
      this.setState({ hubs: this.props.hubs }, () => {
        setTimeout(() => this.setState({ reveal: true }), 400);
      });
    } else {
      this.fetchHubs();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.exclude !== this.props.exclude) {
      this.setState(
        {
          reveal: false,
          hubs: this.props.hubs,
        },
        () => {
          setTimeout(() => this.setState({ reveal: true }), 400);
        }
      );
    }
    if (prevProps.hubs !== this.props.hubs) {
      this.setState({ hubs: this.props.hubs }, () => {
        setTimeout(() => this.setState({ reveal: true }), 400);
      });
    }
  }

  componentWillUnmount() {
    this.setState({ reveal: false });
  }

  fetchHubs = async () => {
    if (!this.props.hubs.length > 0) {
      await this.props.getTopHubs();
    }
    this.setState({ hubs: this.props.hubs }, () => {
      this.revealTransition();
    });
  };

  revealTransition = () => {
    setTimeout(() => this.setState({ reveal: true }), DEFAULT_TRANSITION_TIME);
  };

  renderHubEntry = () => {
    let selectedHubs =
      this.state.hubs.length > 9
        ? this.state.hubs.slice(0, 9)
        : this.state.hubs;
    return selectedHubs.map((hub, i) => {
      let { name, id, user_is_subscribed } = hub;
      return (
        <Fragment key={`${id}-${i}`}>
          <Ripples
            className={css(styles.hubEntry)}
            onClick={() => this.handleClick(hub)}
          >
            {name}
            {user_is_subscribed && (
              <span className={css(styles.subscribedIcon)}>
                <i className="fas fa-star" />
              </span>
            )}
          </Ripples>
          <div className={css(styles.space)} />
        </Fragment>
      );
    });
  };

  handleClick = (hub) => {
    function nameToUrl(name) {
      let arr = name.split(" ");
      return arr.length > 1 ? arr.join("-").toLowerCase() : name.toLowerCase();
    }

    if (this.props.livefeed) {
      this.props.setHub(hub);
    } else {
      this.props.updateCurrentHubPage(hub);
      Router.push("/hubs/[hubname]", `/hubs/${nameToUrl(hub.name)}`);
    }
  };

  render() {
    let { overrideStyle } = this.props;

    return (
      <div className={css(styles.container, overrideStyle && overrideStyle)}>
        <div className={css(styles.hubsListContainer)}>
          <div className={css(styles.listLabel)} id={"hubListTitle"}>
            {"Top Hubs"}
            <span className={css(styles.topIcon)}>
              {/* <i class="fad fa-flame"></i> */}
              {/* <i class="fal fa-chart-line"></i> */}
              {/* <i class="fad fa-fire-alt"></i> */}
            </span>
          </div>
          <div
            className={css(styles.hubsList, this.state.reveal && styles.reveal)}
          >
            {this.renderHubEntry()}
            <Link href={"/hubs"} as={"/hubs"}>
              <a className={css(styles.link)}>View all hubs</a>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // width: "calc(100% * .625)",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
  },
  hubsListContainer: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    textAlign: "left",
    cursor: "default",
    ":hover #hubListTitle": {
      color: colors.BLACK(),
    },
  },
  text: {
    fontFamily: "Roboto",
  },
  listLabel: {
    // fontWeight: "bold",
    textTransform: "uppercase",
    fontWeight: 500,
    fontSize: 13,
    letterSpacing: 1.2,
    marginBottom: 15,
    textAlign: "left",
    color: "#a7a6b0",
    transition: "all ease-in-out 0.2s",
    // color: '#241F3A',
    // textAlign: 'center',
    width: "90%",
    paddingLeft: 35,
    boxSizing: "border-box",
    ":hover": {
      color: colors.BLACK(),
    },
  },
  topIcon: {
    color: colors.RED(),
    marginLeft: 6,
    fontSize: 13,
  },
  hubEntry: {
    fontSize: 16,
    fontWeight: 300,
    cursor: "pointer",
    textTransform: "capitalize",
    display: "flex",
    alignItems: "center",
    padding: "3px 5px",
    boxSizing: "border-box",
    width: "100%",
    transition: "all ease-out 0.2s",
    borderRadius: 3,
    ":hover": {
      color: colors.BLUE(1),
      backgroundColor: "#FAFAFA",
    },
  },
  hubsList: {
    opacity: 0,
    width: "90%",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: "0px 30px",
  },
  reveal: {
    opacity: 1,
    transition: "all ease-in-out 0.2s",
  },
  space: {
    height: 10,
  },
  subscribedIcon: {
    marginLeft: 3,
    color: colors.DARK_YELLOW(),
    fontSize: 11,
  },
  link: {
    textDecoration: "none",
    color: "rgba(78, 83, 255)",
    fontWeight: 300,
    textTransform: "capitalize",
    fontSize: 16,
    padding: "3px 5px",
    ":hover": {
      color: "rgba(78, 83, 255, .5)",
      textDecoration: "underline",
    },
  },
});

const mapStateToProps = (state) => ({
  hubs: state.hubs.topHubs,
});

const mapDispatchToProps = {
  updateCurrentHubPage: HubActions.updateCurrentHubPage,
  getHubs: HubActions.getHubs,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HubsList);
