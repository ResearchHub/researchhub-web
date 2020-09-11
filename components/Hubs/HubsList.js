import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import { connect } from "react-redux";
import Ripples from "react-ripples";
import ReactPlaceholder from "react-placeholder/lib";
import "react-placeholder/lib/reactPlaceholder.css";

// Component
import HubEntryPlaceholder from "../Placeholders/HubEntryPlaceholder";

// Config
import colors from "../../config/themes/colors";

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
    if (this.props.hubs.length) {
      this.setState({ hubs: [...this.props.hubs] });
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
    if (this.props.auth.isLoggedIn) {
      let subscribedHubs = {};

      let subscribed = this.props.auth.user.subscribed
        ? this.props.auth.user.subscribed
        : [];
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

  renderHubEntry = () => {
    let selectedHubs = this.state.hubs;
    return selectedHubs.map((hub, i) => {
      let { name, id, user_is_subscribed } = hub;
      return (
        <Ripples
          className={css(
            styles.hubEntry,
            this.isCurrentHub(this.props.current, id) && styles.current
          )}
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
              {name}
              {user_is_subscribed && (
                <span className={css(styles.subscribedIcon)}>
                  <i className="fas fa-star" />
                </span>
              )}
            </a>
          </Link>
        </Ripples>
      );
    });
  };

  render() {
    let { overrideStyle } = this.props;

    return (
      <div className={css(styles.container, overrideStyle && overrideStyle)}>
        <div className={css(styles.hubsListContainer)}>
          <div className={css(styles.listLabel)} id={"hubListTitle"}>
            Trending Hubs
          </div>
          <div
            className={css(styles.hubsList, this.state.reveal && styles.reveal)}
          >
            {this.state.hubs.length > 0 ? (
              this.renderHubEntry()
            ) : (
              <Fragment>
                <ReactPlaceholder
                  showLoadingAnimation
                  ready={false}
                  customPlaceholder={
                    <HubEntryPlaceholder color="#efefef" rows={9} />
                  }
                />
              </Fragment>
            )}
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
    textTransform: "uppercase",
    fontWeight: 500,
    fontSize: 13,
    letterSpacing: 1.2,
    marginBottom: 15,
    textAlign: "left",
    color: "#a7a6b0",
    transition: "all ease-out 0.1s",
    width: "90%",
    paddingLeft: 35,
    boxSizing: "border-box",
    ":hover": {
      color: colors.BLACK(),
    },
    "@media only screen and (max-width: 1303px)": {
      paddingLeft: 25,
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
    boxSizing: "content-box",
    width: "100%",
    transition: "all ease-out 0.1s",
    borderRadius: 3,
    border: "1px solid #fff",
    marginBottom: 8,
    ":hover": {
      borderColor: "rgb(237, 237, 237)",
      backgroundColor: "#FAFAFA",
    },
  },
  hubLink: {
    textDecoration: "none",
    color: "#111",
    width: "100%",
    display: "flex",
    alignItems: "center",
    padding: "8px",
  },
  current: {
    borderColor: "rgb(237, 237, 237)",
    backgroundColor: "#FAFAFA",
    ":hover": {
      borderColor: "rgb(227, 227, 227)",
      backgroundColor: "#EAEAEA",
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
    "@media only screen and (max-width: 1303px)": {
      padding: "0px 20px",
    },
  },
  reveal: {
    opacity: 1,
    transition: "all ease-in-out 0.2s",
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
