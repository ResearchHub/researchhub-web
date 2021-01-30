import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import Router from "next/router";
import { connect } from "react-redux";
import Ripples from "react-ripples";

// Config
import colors from "../../config/themes/colors";
import icons from "~/config/themes/icons";

// Redux
import { HubActions } from "~/redux/hub";

const DEFAULT_TRANSITION_TIME = 400;

class FeedList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // activeFeed: this.props.feed,
      reveal: true,
    };

    this.feeds = [
      {
        label: "My Hubs",
        icon: (
          <img
            src={"/static/ResearchHubIcon.png"}
            className={css(styles.rhIcon)}
          />
        ),
        href: "/",
        as: "/",
      },
      {
        label: "All",
        icon: icons.squares,
        href: "/all",
        as: "/all",
      },
    ];
  }

  onClick = async ({ href, as }, index) => {
    const { onFeedSelect } = this.props;
    await Router.push(href, as, { shallow: true });
    onFeedSelect(index);
  };

  renderFeedList = () => {
    const { activeFeed } = this.props;
    return this.feeds.map((feed, i) => {
      const { label, icon, href, as } = feed;

      return (
        <Ripples
          className={css(
            styles.listItem,
            i === activeFeed && styles.activeListItem,
            i === 1 && styles.lastItem
          )}
          key={`${label}-${i}`}
          onClick={() => this.onClick({ href, as }, i)}
        >
          <div className={css(styles.link)}>
            <span className={css(styles.icon)}>{icon}</span>
            <span style={{ opacity: 1 }} className={"clamp1"}>
              {label}
            </span>
          </div>
        </Ripples>
      );
    });
  };

  render() {
    const { overrideStyle } = this.props;

    return (
      <div className={css(styles.container, overrideStyle && overrideStyle)}>
        <div className={css(styles.hubsListContainer)}>
          <h5 className={css(styles.listLabel)}>ResearchHub Feeds</h5>
          <div
            className={css(styles.hubsList, this.state.reveal && styles.reveal)}
          >
            {this.renderFeedList()}
          </div>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 15,
    backgroundColor: "#FFF",
    border: "1px solid #ededed",
    borderRadius: 4,
    boxSizing: "border-box",
    width: "100%",
    marginTop: 30,
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
    textAlign: "left",
    color: "#a7a6b0",
    transition: "all ease-out 0.1s",
    width: "100%",
    boxSizing: "border-box",
    margin: 0,
    padding: 0,
    paddingLeft: 20,
    marginBottom: 10,
  },
  topIcon: {
    color: colors.RED(),
    marginLeft: 6,
    fontSize: 13,
  },
  listItem: {
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
    borderLeft: "3px solid #fff",
    borderBottom: "1px solid #F0F0F0",
    padding: "10px 15px",
    color: colors.BLACK(0.6),
    ":hover": {
      borderLeft: `3px solid ${colors.NEW_BLUE()}`,
      backgroundColor: "#FAFAFA",
    },
  },
  activeListItem: {
    color: colors.NEW_BLUE(),
    background:
      "linear-gradient(90deg, rgba(57, 113, 255, 0.1) 0%, rgba(57, 113, 255, 0) 100%)",
    borderLeft: `3px solid ${colors.NEW_BLUE()}`,
  },
  lastItem: {
    borderBottom: "none",
  },
  hubImage: {
    height: 35,
    width: 35,
    borderRadius: 4,
    objectFit: "cover",
    marginRight: 10,
    background: "#EAEAEA",
  },
  link: {
    textDecoration: "none",
    width: "100%",
    display: "flex",
    alignItems: "center",
    fontWeight: 500,
    color: "unset",
  },
  current: {
    borderColor: "rgb(237, 237, 237)",
    backgroundColor: "#FAFAFA",
    ":hover": {
      borderColor: "rgb(227, 227, 227)",
      backgroundColor: "#EAEAEA",
    },
  },
  icon: {
    fontSize: 22,
    marginRight: 10,
    opacity: 1,
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
  rhIcon: {
    // height: 30,
    width: 15,
    marginLeft: 5,
    marginRight: 2,
  },
  space: {
    height: 50,
  },
  subscribedIcon: {
    marginLeft: "auto",
    color: colors.DARK_YELLOW(),
    fontSize: 11,
  },
  // link: {
  //   textDecoration: "none",
  //   color: "rgba(78, 83, 255)",
  //   fontWeight: 300,
  //   textTransform: "capitalize",
  //   fontSize: 16,
  //   marginTop: 20,
  //   ":hover": {
  //     color: "rgba(78, 83, 255, .5)",
  //     textDecoration: "underline",
  //   },
  // },
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
)(FeedList);
