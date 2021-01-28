import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import { connect } from "react-redux";
import Ripples from "react-ripples";
import ReactPlaceholder from "react-placeholder/lib";

// Component
import HubEntryPlaceholder from "../Placeholders/HubEntryPlaceholder";

// Config
import colors from "../../config/themes/colors";
import icons from "~/config/themes/icons";

// Redux
import { HubActions } from "~/redux/hub";

const DEFAULT_TRANSITION_TIME = 400;

class HubsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hubs:
        this.props.initialHubList && this.props.initialHubList.results
          ? this.props.initialHubList.results
          : [],
      reveal: true,
    };
  }

  componentDidMount() {
    let { auth } = this.props;
    if (this.props.hubs.length) {
      this.setState({ hubs: [...this.props.hubs] });
    }

    if (auth.isLoggedIn) {
      this.updateTopHubs();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.current !== this.props.current) {
      this.setState({
        hubs: this.props.hubs,
      });
    }
    if (prevProps.hubs !== this.props.hubs) {
      this.setState({ hubs: [...this.props.hubs] });
    }
    if (prevProps.auth.isLoggedIn !== this.props.auth.isLoggedIn) {
      this.updateTopHubs();
    }
    if (prevProps.auth.user !== this.props.auth.user) {
      this.updateTopHubs();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.revealTimeout);
    this.setState({ reveal: false });
  }

  fetchHubs = async () => {
    if (!this.props.hubs.length > 0) {
      await this.props.getTopHubs(this.props.auth);
    }
    this.setState({ hubs: this.props.hubs }, () => {
      this.revealTransition();
    });
  };

  isCurrentHub(current, hubId) {
    if (current && current.id) {
      return hubId === current.id;
    }
  }

  updateTopHubs = (state) => {
    let hubState = this.props.hubState;
    if (this.props.auth.isLoggedIn) {
      let subscribed = hubState.subscribedHubs ? hubState.subscribedHubs : [];
      let subscribedHubs = {};
      subscribed.forEach((hub) => {
        subscribedHubs[hub.id] = true;
      });

      let updatedTopHubs = this.props.hubs.map((hub) => {
        if (subscribedHubs[hub.id]) {
          hub.user_is_subscribed = true;
        }
        return hub;
      });

      this.props.updateTopHubs(updatedTopHubs);
    } else {
      let updatedTopHubs = this.props.hubs.map((hub) => {
        hub.user_is_subscribed = false;
        return hub;
      });

      this.props.updateTopHubs(updatedTopHubs);
    }
  };

  revealTransition = () => {
    setTimeout(() => this.setState({ reveal: true }), DEFAULT_TRANSITION_TIME);
  };

  renderHubEntry = (hubs) => {
    return hubs.map((hub, i) => {
      const { name, id, hub_image, user_is_subscribed } = hub;
      return (
        <Ripples
          className={css(
            styles.hubEntry,
            this.isCurrentHub(this.props.current, id) && styles.current,
            i === hubs.length - 1 && styles.last
          )}
          onClick={this.props.onHubSelect}
          key={`${id}-${i}`}
        >
          <Link
            href={{
              pathname: "/hubs/[slug]",
              query: {
                name: `${hub.name}`,

                slug: `${encodeURIComponent(hub.slug)}`,
              },
            }}
            as={`/hubs/${encodeURIComponent(hub.slug)}`}
          >
            <a className={css(styles.hubLink)}>
              <img
                className={css(styles.hubImage)}
                src={
                  hub_image
                    ? hub_image
                    : "/static/background/hub-placeholder.svg"
                }
                alt={hub.name}
              />
              <span className={"clamp1"}>{name}</span>
            </a>
          </Link>
        </Ripples>
      );
    });
  };

  render() {
    const { overrideStyle } = this.props;
    const subscribedHubs = this.props.hubState.subscribedHubs
      ? this.props.hubState.subscribedHubs
      : [];

    if (subscribedHubs.length) {
      return (
        <div className={css(styles.container, overrideStyle && overrideStyle)}>
          <div className={css(styles.hubsListContainer)}>
            <h5 className={css(styles.listLabel)}>
              <span>Your Hubs</span>
              <Link href={"/user/settings"} as={"/user/settings"}>
                <a className={css(styles.link, styles.cogButton)}>
                  {icons.cog}
                </a>
              </Link>
            </h5>
            <div
              className={css(
                styles.hubsList,
                this.state.reveal && styles.reveal
              )}
            >
              <ReactPlaceholder
                showLoadingAnimation
                ready={this.state.hubs && this.state.hubs.length}
                customPlaceholder={
                  <HubEntryPlaceholder color="#efefef" rows={9} />
                }
              >
                {this.renderHubEntry(subscribedHubs)}
              </ReactPlaceholder>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "15px 0 1px",
    backgroundColor: "#FFF",
    border: "1px solid #ededed",
    boxSizing: "border-box",
    width: "100%",
    marginTop: 20,
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
  },
  listLabel: {
    textTransform: "uppercase",
    fontWeight: 500,
    fontSize: 12,
    letterSpacing: 1.2,
    display: "flex",
    justifyContent: "space-between",
    color: "#a7a6b0",
    transition: "all ease-out 0.1s",
    width: "100%",
    boxSizing: "border-box",
    margin: 0,
    padding: "0px 15px 0px 20px",
    marginBottom: 10,
  },
  cogButton: {
    color: "#a7a6b0",
    opacity: 0.7,
    fontSize: 14,
    cursor: "pointer",
    ":hover": {
      opacity: 1,
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
    boxSizing: "border-box",
    width: "100%",
    transition: "all ease-out 0.1s",
    borderRadius: 3,
    borderBottom: "1px solid #F0F0F0",
    borderLeft: "3px solid #FFF",
    ":hover": {
      color: colors.NEW_BLUE(),
      background:
        "linear-gradient(90deg, rgba(57, 113, 255, 0.1) 0%, rgba(57, 113, 255, 0) 100%)",
      borderLeft: `3px solid ${colors.NEW_BLUE()}`,
    },
  },
  last: {
    borderBottom: "none",
  },
  hubImage: {
    height: 35,
    width: 35,
    minWidth: 35,
    maxWidth: 35,
    borderRadius: 4,
    objectFit: "cover",
    marginRight: 10,
    background: "#EAEAEA",
    border: "1px solid #ededed",
  },
  hubLink: {
    textDecoration: "none",
    color: "#111",
    width: "100%",
    display: "flex",
    alignItems: "center",
    fontWeight: 500,
    padding: "10px 20px",
  },
  current: {
    color: colors.NEW_BLUE(),
    background:
      "linear-gradient(90deg, rgba(57, 113, 255, 0.1) 0%, rgba(57, 113, 255, 0) 100%)",
    borderLeft: `3px solid ${colors.NEW_BLUE()}`,
  },
  hubsList: {
    opacity: 0,
    width: "100%",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  reveal: {
    opacity: 1,
  },
  space: {
    height: 10,
  },
  subscribedIcon: {
    marginLeft: "auto",
    color: colors.DARK_YELLOW(),
    fontSize: 11,
  },
  link: {
    textDecoration: "none",
  },
});

const mapStateToProps = (state) => ({
  hubState: state.hubs,
  hubs: state.hubs.topHubs,
  auth: state.auth,
});

const mapDispatchToProps = {
  updateCurrentHubPage: HubActions.updateCurrentHubPage,
  getTopHubs: HubActions.getTopHubs,
  updateTopHubs: HubActions.updateTopHubs,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HubsList);
