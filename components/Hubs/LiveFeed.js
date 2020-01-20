import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";

// Component
import LiveFeedNotification from "./LiveFeedNotification";

// Config
import colors from "../../config/themes/colors";
import API from "../../config/api";
import { Helpers } from "@quantfive/js-web-config";

// Redux
import { NotificationActions } from "~/redux/notification";

class LiveFeed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      intervalPing: null,
      newNotification: true,
      notifications: [],
    };
  }

  componentDidMount() {
    this.fetchLiveFeed();
    let that = this;
    let intervalPing = setInterval(() => {
      let { getLivefeed, livefeed, currentHub } = that.props;
      getLivefeed(livefeed.hubs, currentHub.id);
    }, 60000);
    this.setState({
      intervalPing: intervalPing,
    });
  }

  componentDidUpdate(prevProps) {}

  componentWillUnmount() {
    clearInterval(this.state.intervalPing);
  }

  fetchLiveFeed = () => {
    let { getLivefeed, livefeed, currentHub } = this.props;
    getLivefeed(livefeed.hubs, currentHub.id);
  };

  getNotificationCount = () => {};

  renderNotifications = () => {
    let { livefeed, currentHub } = this.props;
    let currentHubId = currentHub.id;
    let currentHubNotifications = livefeed.hubs[currentHubId];

    return (
      currentHubNotifications &&
      currentHubNotifications.map((notification, i) => {
        return <LiveFeedNotification notification={notification} />;
      })
    );
  };

  render() {
    return (
      <Fragment>
        <div className={css(styles.listLabel)}>
          {"Activity on Hub"}
          {/* <div className={css(styles.notifCount)}></div> */}
        </div>
        <div className={css(styles.container)}>
          <div className={css(styles.livefeed)}>
            {this.renderNotifications()}
          </div>
        </div>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "90%",
    border: "1px solid rgb(237, 237, 237)",
  },
  listLabel: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 12,
    letterSpacing: 1.2,
    color: "#a7a6b0",
    marginTop: 60,
    paddingBottom: 10,
    width: 140,
    height: 18,
  },
  livefeed: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: 150,
    overflowY: "scroll",
    backgroundColor: "#FCFCFC",
    paddingTop: 10,
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
