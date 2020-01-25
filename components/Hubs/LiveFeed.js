import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";

// Component
import LiveFeedNotification from "./LiveFeedNotification";
import Loader from "~/components/Loader/Loader";

// Config
import colors from "../../config/themes/colors";
import API from "../../config/api";
import { Helpers } from "@quantfive/js-web-config";

// Redux
import { NotificationActions } from "~/redux/notification";

const DEFAULT_PING_REFRESH = 60000; // 1 minute
const DEFAULT_LOADING = 400; //

class LiveFeed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      intervalPing: null,
      newNotification: true,
      loading: false,
      hideFeed: false,
      notifications: [],
    };
  }

  componentDidMount() {
    if (process.browser) {
      let { livefeed, currentHub, home } = this.props;
      let hubId = home ? 0 : currentHub.id;
      if (!livefeed.hubs[hubId]) {
        hubId && this.fetchLiveFeed(hubId);
      }
      this.setLivefeedInterval(this, hubId);
    }
  }

  setLivefeedInterval = (master, hubId) => {
    let intervalPing = setInterval(() => {
      let { getLivefeed, livefeed } = master.props;
      getLivefeed(livefeed.hubs, hubId);
    }, DEFAULT_PING_REFRESH);
    this.setState({
      intervalPing: intervalPing,
    });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.currentHub) {
      if (prevProps.currentHub.id !== this.props.currentHub.id) {
        clearInterval(this.state.intervalPing);
        this.transitionWrapper(() => {
          let { livefeed, currentHub } = this.props;
          if (!livefeed.hubs[currentHub.id]) {
            this.fetchLiveFeed(currentHub.id);
          }
          this.setLivefeedInterval(this, this.props.currentHub.id);
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
    }
  };

  toggleFeedView = () => {
    this.setState({ hideFeed: !this.state.hideFeed });
  };

  render() {
    let { livefeed, currentHub, home } = this.props;
    let hubId = home ? 0 : currentHub.id;
    return (
      <Fragment>
        <div
          className={css(styles.listLabel)}
          // onClick={this.toggleFeedView}
        >
          {"Activity on Hub"}
          <div
            className={css(styles.refreshIcon)}
            onClick={() => this.fetchLiveFeed(hubId)}
          >
            <i className="fad fa-sync" />
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
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  listLabel: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 12,
    letterSpacing: 1.2,
    // color: "#a7a6b0",
    marginTop: 80,
    paddingBottom: 10,
    width: 140,
    height: 18,
    cursor: "default",
    "@media only screen and (max-width: 768px)": {
      marginTop: 40,
    },
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "90%",
    border: "1px solid rgb(237, 237, 237)",
    transition: "all ease-in-out 0.2s",
  },
  livefeed: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    maxHeight: 290,
    overflowY: "scroll",
    background: "url(/static/background/background-modal.png) #FCFCFC",
    backgroundSize: "cover",
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
