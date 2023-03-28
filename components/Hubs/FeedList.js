import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGrid2 } from "@fortawesome/pro-solid-svg-icons";
import { Component, Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import Router from "next/router";
import { connect } from "react-redux";
import Ripples from "react-ripples";

import SubscribedHubList from "../Home/SubscribedHubList";

// Config
import colors from "../../config/themes/colors";
import { DownIcon, UpIcon } from "~/config/themes/icons";

// Redux
import { HubActions } from "~/redux/hub";

class FeedList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // activeFeed: this.props.feed,
      dropdown: false,
    };

    this.feeds = [
      {
        label: "All",
        icon: <FontAwesomeIcon icon={faGrid2}></FontAwesomeIcon>,
        href: "/",
        as: "/",
      },
      {
        label: "My Hubs",
        icon: (
          <img
            src={"/static/ResearchHubIcon.png"}
            className={css(styles.rhIcon)}
          />
        ),
        href: "/my-hubs",
        as: "/my-hubs",
      },
    ];
  }

  onClick = async ({ href, as }, index) => {
    const { onFeedSelect } = this.props;
    await Router.push(href, as, { shallow: true });
    onFeedSelect(index);
  };

  toggleDropdown = (e) => {
    e && e.stopPropagation();
    this.setState({ dropdown: !this.state.dropdown });
  };

  renderDropdownButton = (i) => {
    const { auth, hubState } = this.props;
    const { dropdown } = this.state;

    if (auth.isLoggedIn && hubState.subscribedHubs.length) {
      return (
        i === 1 && (
          <span
            className={css(styles.dropdownIcon)}
            onClick={this.toggleDropdown}
          >
            {dropdown ? <UpIcon /> : <DownIcon />}
          </span>
        )
      );
    }

    return null;
  };

  renderDropdown = (i) => {
    const { auth, hubState } = this.props;
    const { dropdown } = this.state;

    if (auth.isLoggedIn && hubState.subscribedHubs.length) {
      return (
        i === 1 &&
        dropdown && (
          <div className={css(styles.dropdown)}>
            <SubscribedHubList current={this.props.current} />
          </div>
        )
      );
    }
    return null;
  };

  renderFeedList = () => {
    const { activeFeed } = this.props;

    return this.feeds.map((feed, i) => {
      const { label, icon, href, as } = feed;

      return (
        <Fragment key={`${label}-${i}-container`}>
          <div
            className={css(
              styles.listItemContainer,
              i === activeFeed && styles.activeListItem
            )}
            key={`${label}-${i}`}
          >
            <Ripples
              className={css(styles.listItem)}
              onClick={() => this.onClick({ href, as }, i)}
            >
              <div className={css(styles.link)}>
                <span className={css(styles.icon)}>{icon}</span>
                <span style={{ opacity: 1 }} className={"clamp1"}>
                  {label}
                </span>
                {this.renderDropdownButton(i)}
              </div>
            </Ripples>
          </div>
          {this.renderDropdown(i)}
        </Fragment>
      );
    });
  };

  render() {
    const { overrideStyle } = this.props;

    return (
      <div className={css(styles.container, overrideStyle && overrideStyle)}>
        <div className={css(styles.hubsListContainer)}>
          <h5 className={css(styles.listLabel)}>ResearchHub Feeds</h5>
          <div className={css(styles.hubsList)}>{this.renderFeedList()}</div>
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
  listItemContainer: {
    fontSize: 16,
    fontWeight: 300,
    cursor: "pointer",
    textTransform: "capitalize",
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
    width: "100%",
    transition: "all ease-out 0.1s",
    color: colors.BLACK(0.6),
    borderLeft: "3px solid #fff",
    ":last-child": {
      borderBottom: "none",
      borderRadius: "0px 0px 4px 4px",
    },
    ":hover": {
      borderLeft: `3px solid ${colors.NEW_BLUE()}`,
      backgroundColor: "#FAFAFA",
    },
    ":active": {
      color: colors.NEW_BLUE(),
      background:
        "linear-gradient(90deg, rgba(57, 113, 255, 0.1) 0%, rgba(57, 113, 255, 0) 100%)",
      borderLeft: `3px solid ${colors.NEW_BLUE()}`,
    },
    ":focus": {
      color: colors.NEW_BLUE(),
      background:
        "linear-gradient(90deg, rgba(57, 113, 255, 0.1) 0%, rgba(57, 113, 255, 0) 100%)",
      borderLeft: `3px solid ${colors.NEW_BLUE()}`,
    },
  },
  listItem: {
    width: "100%",
    padding: "10px 15px",
    position: "relative",
  },
  activeListItem: {
    color: colors.NEW_BLUE(),
    background:
      "linear-gradient(90deg, rgba(57, 113, 255, 0.1) 0%, rgba(57, 113, 255, 0) 100%)",
    borderLeft: `3px solid ${colors.NEW_BLUE()}`,
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
    height: 32,
  },
  spacebetween: {
    justifyContent: "space-between",
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
    marginRight: 12,
    marginLeft: 8,
    opacity: 1,
  },
  hubsList: {
    opacity: 1,
    width: "100%",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  rhIcon: {
    height: 26,
    marginLeft: 3,
    marginRight: 2,
    width: 17,
  },
  space: {
    height: 50,
  },
  subscribedIcon: {
    marginLeft: "auto",
    color: colors.DARK_YELLOW(),
    fontSize: 11,
  },
  dropdownIcon: {
    fontSize: 18,
    position: "absolute",
    right: 15,
    color: colors.BLACK(0.6),
    ":hover": {
      cursor: "pointer",
      color: colors.NEW_BLUE(),
    },
  },
  dropdown: {
    width: "100%",
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

export default connect(mapStateToProps, mapDispatchToProps)(FeedList);
