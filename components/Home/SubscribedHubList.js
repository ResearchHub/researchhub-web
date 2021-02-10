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
import { ethers } from "ethers";

const DEFAULT_PAGE_SIZE = 5;

class SubscribedHubList extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      hubs: [],
      paginatedLists: {},
      pages: 1,
      page: 1,
      ready: false,
    };
    this.state = {
      ...this.initialState,
    };
  }

  componentDidMount() {
    const { auth } = this.props;
    if (auth.isLoggedIn) {
      this.formatHubList();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.hubs.subscribedHubs !== this.props.hubs.subscribedHubs) {
      this.formatHubList();
    }
    if (prevProps.auth.isLoggedIn !== this.props.auth.isLoggedIn) {
      if (this.props.auth.isLoggedIn) {
        this.formatHubList();
      } else {
        this.setState({ ...this.initialState });
      }
    }
    if (prevProps.auth.user !== this.props.auth.user) {
      this.formatHubList();
    }
  }

  isCurrentHub(current, hubId) {
    if (current && current.id) {
      return hubId === current.id;
    }
  }

  formatHubList = () => {
    const hubs = [...this.props.hubs.subscribedHubs] || [];
    const paginatedLists = {};
    const count = hubs.length;
    let pages = 1;

    if (count > DEFAULT_PAGE_SIZE) {
      pages = Math.ceil(count / DEFAULT_PAGE_SIZE);

      for (let i = 1; i <= pages; i++) {
        let start = (i - 1) * DEFAULT_PAGE_SIZE;
        let end = i * DEFAULT_PAGE_SIZE;

        if (i === pages) {
          paginatedLists[i] = hubs.slice(start);
        } else {
          paginatedLists[i] = hubs.slice(start, end);
        }
      }

      this.setState({
        hubs: paginatedLists[1],
        paginatedLists,
        pages,
        page: 1,
        ready: true,
      });
    } else {
      this.setState({ hubs, ready: true });
    }
  };

  nextPage = () => {
    const { paginatedLists, page } = this.state;
    const next = page + 1;
    const hubs = [...this.state.hubs, ...paginatedLists[next]];
    this.setState({ hubs, page: next });
  };

  renderHubEntry = () => {
    const { hubs } = this.state;
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
    const { pages, page, hubs } = this.state;
    const { overrideStyle } = this.props;

    if (hubs.length) {
      return (
        <div className={css(styles.hubsList)}>
          <ReactPlaceholder
            showLoadingAnimation
            // ready={this.state.ready}
            ready={true}
            customPlaceholder={<HubEntryPlaceholder color="#efefef" rows={5} />}
          >
            {this.renderHubEntry()}
          </ReactPlaceholder>
          {pages > page && (
            <div className={css(styles.viewMoreButton)} onClick={this.nextPage}>
              View more
            </div>
          )}
        </div>
        // <div className={css(styles.container, overrideStyle && overrideStyle)}>
        //   <div className={css(styles.hubsListContainer)}>
        //     <h5 className={css(styles.listLabel)}>
        //       <span>My Hubs</span>
        //       <Link href={"/user/settings"} as={"/user/settings"}>
        //         <a className={css(styles.link, styles.cogButton)}>
        //           {icons.cog}
        //         </a>
        //       </Link>
        //     </h5>
        //     <div className={css(styles.hubsList)}>
        //       <ReactPlaceholder
        //         showLoadingAnimation
        //         ready={this.state.ready}
        //         customPlaceholder={
        //           <HubEntryPlaceholder color="#efefef" rows={5} />
        //         }
        //       >
        //         {this.renderHubEntry()}
        //       </ReactPlaceholder>
        //       {pages > page && (
        //         <div
        //           className={css(styles.viewMoreButton)}
        //           onClick={this.nextPage}
        //         >
        //           View more
        //         </div>
        //       )}
        //     </div>
        //   </div>
        // </div>
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
    // border: "1px solid #ededed",
    borderRadius: 4,
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
  last: {
    opacity: 1,
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
  viewMoreButton: {
    color: "rgba(78, 83, 255)",
    fontWeight: 300,
    textTransform: "capitalize",
    fontSize: 16,
    padding: "10px 20px",
    borderTop: "1px solid #F0F0F0",
    boxSizing: "border-box",
    width: "100%",
    cursor: "pointer",
    ":hover": {
      color: "rgba(78, 83, 255, .5)",
      textDecoration: "underline",
      background: "#FAFAFA",
    },
  },
});

const mapStateToProps = (state) => ({
  hubs: state.hubs,
  auth: state.auth,
});

const mapDispatchToProps = {
  getSubscribedHubs: HubActions.getSubscribedHubs,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscribedHubList);
