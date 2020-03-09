import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import Ripples from "react-ripples";

// Component
import LiveFeedNotification from "./LiveFeedNotification";
import Loader from "~/components/Loader/Loader";

// Config
import colors from "../../config/themes/colors";
import API from "../../config/api";
import { Helpers } from "@quantfive/js-web-config";

// Redux
import { NotificationActions } from "~/redux/notification";
import icons from "../../config/themes/icons";

const DEFAULT_PING_REFRESH = 5000; // 1 minute
const DEFAULT_LOADING = 400; //

class LiveFeed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      intervalPing: null,
      newNotification: true,
      loading: true,
      hideFeed: false,
      notifications: [],
      liveMode: false,
    };
    // this.liveButton = React.createRef();
  }

  componentDidMount() {
    if (process.browser) {
      let { livefeed, currentHub, home } = this.props;
      let hubId = home ? 0 : currentHub.id;
      if (!livefeed.hubs[hubId]) {
        this.fetchLiveFeed(hubId);
      } else {
        this.setState({ loading: false });
      }
      if (this.state.liveMode) {
        this.setLivefeedInterval(this, hubId);
      }
    }
  }

  setLivefeedInterval = (master, hubId) => {
    if (this.state.liveMode) {
      let intervalPing = setInterval(() => {
        let { getLivefeed, livefeed } = master.props;
        getLivefeed(livefeed.hubs, hubId);
        this.liveButton && this.liveButton.click();
      }, DEFAULT_PING_REFRESH);
      this.setState({
        intervalPing: intervalPing,
      });
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.currentHub) {
      if (prevProps.currentHub.id !== this.props.currentHub.id) {
        clearInterval(this.state.intervalPing);
        this.transitionWrapper(() => {
          let { livefeed, currentHub } = this.props;
          if (!livefeed.hubs[currentHub.id]) {
            this.fetchLiveFeed(currentHub.id);
          } else {
            this.setState({ loading: false });
          }
          if (this.state.liveMode) {
            this.setLivefeedInterval(this, this.props.currentHub.id);
          }
        });
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalPing);
  }

  fetchLiveFeed = (hubId) => {
    this.setState({ loading: true }, async () => {
      let { getLivefeed, livefeed } = this.props;
      await getLivefeed(livefeed.hubs, hubId);
      this.setState({ loading: false });
    });
  };

  transitionWrapper = (func) => {
    this.setState({ loading: true }, () => {
      func();
      setTimeout(() => {
        this.setState({ loading: false });
      }, DEFAULT_LOADING);
    });
  };

  toggleLiveMode = (e) => {
    if (e.target.id !== "syntheticClick") {
      this.setState(
        {
          liveMode: !this.state.liveMode,
        },
        () => {
          this.state.liveMode
            ? this.setLivefeedInterval(this, 0)
            : clearInterval(this.state.intervalPing);
        }
      );
    }
  };

  renderNotifications = () => {
    let { livefeed, currentHub, home } = this.props;
    let currentHubId = home ? 0 : currentHub.id;
    let currentHubNotifications = livefeed && livefeed.hubs[currentHubId];

    if (currentHubNotifications) {
      if (!currentHubNotifications.length) {
        return (
          <div className={css(styles.emptyState)}>
            No notifications for this hub.
          </div>
        );
      } else {
        return currentHubNotifications.map((notification, i) => {
          return (
            <LiveFeedNotification
              notification={notification}
              key={`liveFeedNotif-${currentHubId}-${i}`}
            />
          );
        });
      }
    } else {
      return (
        <div className={css(styles.emptyState)}>
          No notifications for this hub.
        </div>
      );
    }
  };

  toggleFeedView = () => {
    this.setState({ hideFeed: !this.state.hideFeed });
  };

  showRipples = () => {
    this.toggleLiveMode;
  };

  render() {
    let { livefeed, currentHub, home } = this.props;
    let hubId = home ? 0 : currentHub.id;
    return (
      <div className={css(styles.livefeedComponent)}>
        <div className={css(styles.listLabel)}>
          <div className={css(styles.text, styles.feedTitle)}>
            {this.props.home
              ? "ResearchHub Live"
              : `${this.props.currentHub.name} LiveFeed`}
          </div>
          <div className={css(styles.feedRow)}>
            <Ripples
              className={css(styles.toggleLive)}
              onClick={this.toggleLiveMode}
              during={1500}
            >
              <div
                ref={(ref) => (this.liveButton = ref)}
                id={"syntheticClick"}
              ></div>
              <i
                className={
                  css(styles.toggleIcon) +
                  ` ${this.state.liveMode ? "fas fa-stop" : "fas fa-play"}`
                }
              />
              Live Update
            </Ripples>
            {/* <div
              className={css(styles.refreshIcon)}
              onClick={() => this.fetchLiveFeed(hubId)}
            >
              <i className="fad fa-sync" />
            </div> */}
          </div>
        </div>
        {!this.state.hideFeed && (
          <div className={css(styles.container)}>
            <div className={css(styles.livefeed)}>
              {this.state.loading ? (
                <span className={css(styles.loaderWrapper)}>
                  <Loader loading={true} size={20} />
                </span>
              ) : (
                this.renderNotifications()
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

const styles = StyleSheet.create({
  listLabel: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    fontWeight: "bold",
    position: "-webkit-sticky",
    position: "sticky",
    top: 80,
    boxSizing: "border-box",
    letterSpacing: 1.2,
    zIndex: 2,
    background: "#FCFCFC",
    width: "100%",
    padding: "20px 40px",
    cursor: "default",
    "@media only screen and (max-width: 768px)": {
      marginTop: 40,
    },
  },
  text: {
    color: "#FFF",
    cursor: "default",
  },
  feedTitle: {
    display: "flex",
    alignItems: "flex-start",
    color: "#000",
    fontWeight: 500,
    fontSize: 33,
    width: "100%",
    flexWrap: "wrap",
    whiteSpace: "pre-wrap",
    marginRight: 10,
    "@media only screen and (max-width: 1343px)": {
      fontSize: 25,
    },
    "@media only screen and (max-width: 1149px)": {
      fontSize: 20,
    },
    "@media only screen and (max-width: 665px)": {
      fontSize: 22,
      fontWeight: 500,
      marginBottom: 10,
    },
    "@media only screen and (max-width: 416px)": {
      fontWeight: 400,
      fontSize: 20,
    },
    "@media only screen and (max-width: 321px)": {
      width: 280,
      textAlign: "center",
    },
  },
  feedRow: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    fontWeight: 400,
    // color: colors.GREY(),
    marginTop: 10,
  },
  toggleLive: {
    padding: "8px 12px",
    display: "flex",
    alignItems: "center",
    borderRadius: 3,
    border: `1px solid ${colors.BLUE()}`,
    backgroundColor: colors.BLUE(),
    color: "#fff",
    fontSize: 14,
    ":hover": {
      cursor: "pointer",
      backgroundColor: "#3E43E8",
    },
  },
  toggleIcon: {
    fontSize: 13,
    color: "#fff",
    // color: colors.BLACK(),
    marginRight: 6,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    transition: "all ease-in-out 0.2s",
  },
  livefeed: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    paddingTop: 10,
    overscrollBehavior: "contain",
    transition: "all ease-in-out 0.2s",
  },
  notifCount: {
    textTransform: "unset",
    fontWeight: 300,
    fontSize: 10,
    color: "#FFF",
    backgroundColor: colors.RED(),
    height: 15,
    width: 15,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  refreshIcon: {
    color: colors.GREEN(0.6),
    cursor: "pointer",
    ":hover": {
      cursor: "pointer",
      color: colors.GREEN(),
    },
    fontSize: 20,

    "@media only screen and (max-width: 1343px)": {
      fontSize: 20,
    },
    "@media only screen and (max-width: 1149px)": {
      fontSize: 18,
    },
    "@media only screen and (max-width: 665px)": {
      fontSize: 20,
    },
    "@media only screen and (max-width: 416px)": {
      fontSize: 18,
    },
  },
  loaderWrapper: {
    padding: "10px 0 15px",
  },
  emptyState: {
    padding: "10px 0 15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontSize: 13,
    fontWeight: 400,
  },
  livefeedComponent: {
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    background: "#FCFCFC",
    // padding: '80px 20px 0px 20px',
    // boxSizing: 'border-box'
  },
});

const mapStateToProps = (state) => ({
  livefeed: state.livefeed,
});

const mapDispatchToProps = {
  getLivefeed: NotificationActions.getLivefeed,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LiveFeed);
