import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import Ripples from "react-ripples";
import InfiniteScroll from "react-infinite-scroller";

// Component
import LiveFeedNotification from "./LiveFeedNotification";
import Loader from "~/components/Loader/Loader";
import FormSelect from "~/components/Form/FormSelect";

// Config
import colors from "../../config/themes/colors";
import API from "../../config/api";
import { Helpers } from "@quantfive/js-web-config";

// Redux
import { NotificationActions } from "~/redux/notification";
import icons from "../../config/themes/icons";

const DEFAULT_PING_REFRESH = 10000; // 1 minute
const DEFAULT_LOADING = 400; //

class LiveFeed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      intervalPing: null,
      newNotification: true,
      loading: true,
      hideFeed: false,
      currentHub: { value: 0, label: "All" },
      // Livefeed
      liveMode: false,
      liveFetching: false,
      liveModeResults: [],
    };
    // this.liveButton = React.createRef();
  }

  componentDidMount() {
    if (process.browser) {
      let hubId = this.state.currentHub.value;
      this.fetchInitialFeed(hubId);
      if (this.state.liveMode) {
        this.setLivefeedInterval(this, hubId);
      }
    }
  }

  setLivefeedInterval = (master, hubId) => {
    if (this.state.liveMode) {
      let intervalPing = setInterval(() => {
        this.liveButton && this.liveButton.click();
        this.fetchLivefeed(hubId);
      }, DEFAULT_PING_REFRESH);
      this.setState({
        intervalPing: intervalPing,
      });
    }
  };

  componentDidUpdate(prevProps) {}

  componentWillUnmount() {
    clearInterval(this.state.intervalPing);
  }

  fetchLivefeed = (hubId) => {
    this.setState({ liveFetching: true });
    fetch(API.GET_LIVE_FEED({ hubId }), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        this.detectNewActions([...res.results]);
      });
  };

  detectNewActions = (newList) => {
    let prevList = this.props.livefeed.results;
    let prevMostRecent = new Date(prevList[0].created_date);
    let newUpdates = [];

    for (var i = 0; i < newList.length; i++) {
      let mostRecent = new Date(newList[i].created_date);
      if (prevMostRecent < mostRecent) {
        newUpdates.push(newList[i]);
      } else {
        break;
      }
    }

    this.setState({
      liveModeResults: [...newUpdates, ...this.state.liveModeResults],
      liveFetching: false,
    });
  };

  fetchInitialFeed = (hubId) => {
    this.setState({ loading: true }, async () => {
      let { getLivefeed, livefeed } = this.props;
      let { page } = this.state;
      await getLivefeed(livefeed, hubId, page);
      this.setState({ loading: false });
    });
  };

  fetchNextPage = (page) => {
    let { livefeed, getLivefeed } = this.props;
    if (livefeed.count === livefeed.results.length) {
      return;
    }
    if (!livefeed.grabbedPage || !livefeed.grabbedPage[page]) {
      let hubId = this.state.currentHub.value;
      getLivefeed(livefeed, hubId, page);
    }
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
          let hubId = this.state.currentHub.value;
          this.state.liveMode
            ? this.setLivefeedInterval(this, hubId)
            : clearInterval(this.state.intervalPing);
        }
      );
    }
  };

  handleHubChange = (id, hub) => {
    this.setState(
      {
        currentHub: hub,
      },
      () => {
        this.fetchInitialFeed(this.state.currentHub.value);
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0;
      }
    );
  };

  renderNotifications = () => {
    let { livefeed } = this.props;
    let currentHubId = this.state.currentHub.value;
    let currentHubNotifications = [...this.state.liveModeResults];
    if (livefeed && livefeed.results) {
      currentHubNotifications.push(...livefeed.results);
    }

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

  buildHubOptions = (hubs) => {
    let options =
      hubs &&
      hubs.map((hub) => {
        let hubName = hub.name
          .split(" ")
          .map((el) => {
            return el[0].toUpperCase() + el.slice(1);
          })
          .join(" ");
        return {
          value: hub.id,
          label: hubName,
        };
      });

    options.unshift({ value: 0, label: "All" });
    return options;
  };

  findStartingPage = () => {
    let page = 1;
    let { livefeed } = this.props;
    if (livefeed.grabbedPage) {
      let seenPages = Object.keys(livefeed.grabbedPage);
      page = Math.max(Number(...seenPages)) + 1;
    }
    return page;
  };

  render() {
    let { livefeed } = this.props;

    return (
      <div className={css(styles.livefeedComponent)}>
        <div className={css(styles.content)}>
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
                f
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
              <div className={css(styles.filterContainer)}>
                <div className={css(styles.filterSelect)}>
                  <FormSelect
                    id={"thread-filter"}
                    options={this.buildHubOptions(this.props.allHubs)}
                    placeholder={"Sort By Hubs"}
                    onChange={this.handleHubChange}
                    containerStyle={styles.overrideFormSelect}
                    value={this.state.currentHub}
                    inputStyle={{
                      minHeight: "unset",
                      padding: 0,
                      backgroundColor: "#FFF",
                      fontSize: 14,
                    }}
                  />
                </div>
              </div>
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
                  <InfiniteScroll
                    pageStart={this.findStartingPage()}
                    loadMore={(page) => {
                      this.fetchNextPage(page);
                    }}
                    initialLoad={true}
                    hasMore={livefeed.count > livefeed.results.length}
                    loader={
                      <span className={css(styles.loaderWrapper)}>
                        <Loader loading={true} size={20} />
                      </span>
                    }
                    className={css(styles.infiniteScroll)}
                  >
                    {this.renderNotifications()}
                  </InfiniteScroll>
                )}
              </div>
            </div>
          )}
        </div>
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
    zIndex: 3,
    background: "#FCFCFC",
    width: "100%",
    padding: "20px 40px",
    cursor: "default",
    "@media only screen and (max-width: 416px)": {
      position: "unset",
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

    "@media only screen and (max-width: 665px)": {
      fontSize: 25,
    },
    "@media only screen and (max-width: 321px)": {
      width: 280,
      textAlign: "center",
    },
  },
  feedRow: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: 400,
    marginTop: 5,
    "@media only screen and (max-width: 416px)": {
      boxSizing: "border-box",
    },
    "@media only screen and (max-width: 321px)": {
      flexDirection: "column",
    },
  },
  filterContainer: {
    display: "flex",
    alignItems: "center",
    "@media only screen and (max-width: 416px)": {
      width: "48%",
    },
    "@media only screen and (max-width: 321px)": {
      width: "100%",
    },
  },
  filterSelect: {
    width: 160,
    "@media only screen and (max-width: 416px)": {
      width: "100%",
    },
  },
  overrideFormSelect: {
    marginTop: 0,
    marginBottom: 0,
    backgroundColor: "#FFF",
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
    "@media only screen and (max-width: 416px)": {
      width: "48%",
      boxSizing: "border-box",
    },
    "@media only screen and (max-width: 321px)": {
      width: "100%",
      justifyContent: "center",
      marginBottom: 10,
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
  infiniteScroll: {
    width: "100%",
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
    padding: "10px 40px 30px 40px",
    boxSizing: "border-box",
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
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    background: "#FCFCFC",
  },
  content: {
    width: "100%",
    maxWidth: 1000,
  },
});

const mapStateToProps = (state) => ({
  livefeed: state.livefeed.livefeed,
  allHubs: state.hubs.hubs,
});

const mapDispatchToProps = {
  getLivefeed: NotificationActions.getLivefeed,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LiveFeed);
