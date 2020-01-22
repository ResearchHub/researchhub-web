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

const DEFAULT_PING_REFRESH = 10000; // 1 minute
const DEFAULT_LOADING = 400; //

class LiveFeed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      intervalPing: null,
      newNotification: true,
      loading: false,
      hideFeed: false,
    };
  }

  componentDidMount() {
    let { livefeed, currentHub } = this.props;
    if (!livefeed.hubs[currentHub.id]) {
      this.fetchLiveFeed();
    }
    this.setLivefeedInterval(this);
  }

  setLivefeedInterval = (master) => {
    let intervalPing = setInterval(() => {
      let { getLivefeed, livefeed, currentHub } = master.props;
      getLivefeed(livefeed.hubs, currentHub.id);
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
            this.fetchLiveFeed();
          }
          this.setLivefeedInterval(this);
        });
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalPing);
  }

  fetchLiveFeed = () => {
    this.setState({ loading: true }, async () => {
      let { getLivefeed, livefeed, currentHub } = this.props;
      await getLivefeed(livefeed.hubs, currentHub.id);
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
    let { livefeed, currentHub } = this.props;
    let currentHubId = currentHub.id;
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
              key={`liveFeedNotif-${currentHub.id}-${i}`}
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
    return (
      <Fragment>
        <div
          className={css(styles.listLabel)}
          // onClick={this.toggleFeedView}
        >
          {"Activity on Hub"}
          <div className={css(styles.refreshIcon)} onClick={this.fetchLiveFeed}>
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
    // backgroundColor: "#FCFCFC",
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
