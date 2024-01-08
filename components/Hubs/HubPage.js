import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { AuthActions } from "~/redux/auth";
import { breakpoints } from "~/config/themes/screen";
import { checkUserVotesOnPapers, fetchURL } from "~/config/fetch";
import { Component } from "react";
import { connect } from "react-redux";
import { faLessThanEqual } from "@fortawesome/free-solid-svg-icons";
import { filterOptions, scopeOptions } from "~/config/utils/options";
import { getEducationalCarouselElements } from "~/components/shared/carousel/presets/RhEducationalCarouselElements";
import { getFragmentParameterByName } from "~/config/utils/parsers";
import { Helpers } from "@quantfive/js-web-config";
import { HubActions } from "~/redux/hub";
import {
  INFO_TAB_EXIT_KEY,
  PREREG_FUNDING_EXIT_KEY,
} from "~/components/Banner/constants/exitable_banner_keys";
import { MessageActions } from "~/redux/message";
import { silentEmptyFnc } from "~/config/utils/nullchecks";
import { StyleSheet, css } from "aphrodite";
import API from "~/config/api";
import colors from "~/config/themes/colors";
import ExitableBanner from "~/components/Banner/ExitableBanner";
import Head from "~/components/Head";
import HomeRightSidebar from "~/components/Home/sidebar/HomeRightSidebar";

import LiveFeed from "~/components/LiveFeed/LiveFeed";
import RhCarousel from "../shared/carousel/RhCarousel";
import Router from "next/router";
import SubscribeButton from "../Home/SubscribeButton";
import UnifiedDocFeedContainer from "~/components/UnifiedDocFeed/UnifiedDocFeedContainer";
import { parseUser } from "~/config/types/root_types";
import Link from "next/link";
import RHLogo from "../Home/RHLogo";
import SingleTypeUnifiedDocFeedContainer from "../UnifiedDocFeed/SingleTypeUnifiedDocFeedContainer";

const defaultFilter = filterOptions[0];
const defaultScope = scopeOptions[0];

class HubPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: this.props.initialFeed?.count ?? 0,
      papers: this.props.initialFeed?.results?.data ?? [],
      noResults: this.props.initialFeed?.results?.no_results ?? faLessThanEqual,
      next: this.props.initialFeed?.next ?? null,
      page: this.props.page || 2,
      doneFetching: this.props.initialFeed ? true : false,
      filterBy: this.props.filter ? this.props.filter : defaultFilter,
      scope: this.props.scope ? this.props.scope : defaultScope,
      feedType: this.props.initialFeed?.results?.feed_type ?? "subscribed",
      disableScope: this.props.filter ? this.props.filter.disableScope : true,
      feed: this.props.feed,
      papersLoading: false,
      titleBoxShadow: false,
      leaderboardTop: 0,
    };
  }

  setScrollShadow = () => {
    const height = document.getElementById("topbar").offsetHeight + 34;
    this.setState({ leaderboardTop: height });
  };

  updateUserBannerPreference = () => {
    this.props.setUserBannerPreference(false);
  };

  componentDidMount() {
    const { isLoggedIn, initialFeed, hubState } = this.props;
    if (initialFeed) {
      this.detectPromoted(this.state.papers);
    }

    const subscribed = hubState.subscribedHubs ? hubState.subscribedHubs : [];
    const subscribedHubs = {};
    subscribed.forEach((hub) => {
      subscribedHubs[hub.id] = true;
    });

    this.setState({
      subscribe: this.props.hub ? subscribedHubs[this.props.hub.id] : null,
    });
  }

  componentDidUpdate = async (prevProps, prevState) => {
    const { hubState } = this.props;
    const subscribed = hubState.subscribedHubs ? hubState.subscribedHubs : [];
    const subscribedHubs = {};
    subscribed.forEach((hub) => {
      subscribedHubs[hub.id] = true;
    });

    if (
      prevProps.hub &&
      this.props.hub &&
      prevProps.hub.id !== this.props.hub.id
    ) {
      if (this.props.hub.id) {
        this.setState({
          subscribe: this.props.hub ? subscribedHubs[this.props.hub.id] : null,
          page: 1,
        });
      }
    }

    if (!prevProps.isLoggedIn && this.props.isLoggedIn) {
      this.checkUserVotes(this.state.papers);
      if (this.props.hub && this.props.hub.id) {
        fetch(API.HUB({ slug: this.props.slug }), API.GET_CONFIG())
          .then(Helpers.checkStatus)
          .then(Helpers.parseJSON)
          .then((_) => {
            this.setState({
              subscribe: subscribedHubs[this.props.hub.id],
            });
          });

        this.setState({
          subscribe: this.props.hub ? subscribedHubs[this.props.hub.id] : null,
        });
      }
    }
  };

  checkUserVotes = (papers) => {
    if (!papers || !papers.length) return;

    const paperIds = papers.map((paper) => paper.id);
    checkUserVotesOnPapers({ paperIds }).then((res) => {
      const userVotes = { ...res };
      const updatedPapers = papers.map((paper) => {
        if (userVotes[paper.id]) {
          paper.user_vote = userVotes[paper.id];
        }
        return paper;
      });

      this.setState({
        papers: updatedPapers,
      });
    });
  };

  detectPromoted = (papers) => {
    const promotedPapers = [];
    if (papers) {
      papers.forEach((paper) => {
        if (paper.promoted) {
          promotedPapers.push(paper.id);
        }
      });
    }

    let createdLocationMeta = this.state.filterBy;
    if (createdLocationMeta === "hot") {
      createdLocationMeta = "trending";
    }
  };

  loadMore = () => {
    const { loadingMore, page, filterBy, feed } = this.state;
    const { hub } = this.props;
    if (loadingMore) return;

    this.setState({
      loadingMore: true,
    });

    fetchURL(this.state.next).then((res) => {
      const { next, previous, results } = res;
      const papers = results.data;
      this.detectPromoted(papers);
      this.setState(
        {
          papers: [...this.state.papers, ...papers],
          next,
          prev: previous,
          page: page + 1,
          loadingMore: false,
        },
        () => {
          const pageParam = getFragmentParameterByName(
            "page",
            this.state.next ? this.state.next : this.state.prev
          ); // grab page from backend response
          const offset = this.state.next ? -1 : 1;
          this.updateSlugs(Number(pageParam) + offset);
        }
      );
    });
  };

  updateSlugs = (page) => {
    let { href, as } = this.formatLink();
    if (page) {
      as += `?page=${page}`;
    }

    const { filterBy } = this.state;
    if (filterBy.href) {
      Router.push(href, as, { shallow: true });
    }
  };

  formatLink = () => {
    const { home, slug } = this.props;
    const { feed, filterBy, scope, disableScope } = this.state;
    const filter = filterBy.href;
    const filterRoute = `/${filter}`;
    const scopeRoute = "/[scope]";
    const hubNameRoute = "/[slug]";
    const hubPrefix = "/hubs";
    const allPrefix = "/";

    const myFeed = feed === 0;
    const trending = filter === "trending";

    if (home && disableScope) {
      if (myFeed && trending) {
        // hide trending slug
        return {
          href: "/",
          as: "/",
        };
      } else if (myFeed && !trending) {
        // show filter slugs
        return {
          href: filterRoute,
          as: `/${filter}`,
        };
      } else {
        // all route with filters
        if (trending) {
          return {
            href: allPrefix,
            as: allPrefix,
          };
        }
        return {
          href: allPrefix + filterRoute,
          as: allPrefix + `/${filter}`,
        };
      }
    } else if (home && !disableScope) {
      if (myFeed) {
        // hide trending slug
        return {
          href: filterRoute + scopeRoute,
          as: `/${filter}/${scope.value}`,
        };
      } else {
        // all route with filters
        return {
          href: allPrefix + filterRoute + scopeRoute,
          as: allPrefix + `/${filter}/${scope.value}`,
        };
      }
    } else if (!home && disableScope) {
      if (trending) {
        return {
          href: hubPrefix + hubNameRoute,
          as: hubPrefix + `/${slug}`,
        };
      } else {
        return {
          href: hubPrefix + hubNameRoute + "/[filter]",
          as: hubPrefix + `/${slug}/${filter}`,
        };
      }
    } else if (!home && !disableScope) {
      return {
        href: hubPrefix + hubNameRoute + "/[filter]" + scopeRoute,
        as: hubPrefix + `/${slug}/${filter}/${scope.value}`,
      };
    }
  };

  updateSubscription = (subscribing) => {
    const { hub, hubState, updateSubscribedHubs } = this.props;
    let subscribedHubs;
    if (subscribing) {
      subscribedHubs = JSON.parse(JSON.stringify(hubState.subscribedHubs));
      subscribedHubs.push(hub);
    } else {
      subscribedHubs = hubState.subscribedHubs.filter(
        (item) => item.id !== hub.id
      );
    }
    updateSubscribedHubs(subscribedHubs);
  };

  onSubscribe = (name = "") => {
    const { showMessage, setMessage } = this.props;
    this.updateSubscription(true);
    setMessage(`Joined ${name}`);
    showMessage({ show: true });
    this.setState({
      transition: false,
      subscribe: !this.state.subscribe,
    });
  };

  onUnsubscribe = (name = "") => {
    const { showMessage, setMessage } = this.props;
    this.updateSubscription(false);
    setMessage(`Left ${name}`);
    showMessage({ show: true });
    this.setState({
      transition: false,
      subscribe: !this.state.subscribe,
    });
  };

  render() {
    const { feed } = this.state;
    const {
      auth,
      home,
      hub,
      hubState,
      initialFeed,
      initialHubList,
      leaderboardFeed,
      loggedIn,
    } = this.props;

    if (auth.user.moderator && filterOptions.length < 5) {
      filterOptions.push(
        {
          value: "removed",
          label: "Removed",
          href: "removed",
        },
        {
          value: "pulled-papers",
          href: "pulled-papers",
          label: "Pulled Papers",
          disableScope: true,
        },
        {
          value: "user-uploaded",
          label: "User Uploaded",
        }
      );
    }

    let carouselElements = getEducationalCarouselElements();
    const currentUser = parseUser(this.props.user);

    carouselElements = currentUser?.isVerified
      ? carouselElements.slice(1)
      : carouselElements;
    return (
      <div className={css(styles.rhHomeContainer)}>
        <div className={css(styles.homeContentContainer, styles.column)}>
          <div className={css(styles.mobileInfoTab)}>
            {/* TODO: Remove after preregistrations close */}
            <ExitableBanner
              bannerKey={PREREG_FUNDING_EXIT_KEY}
              content={
                <Link
                  target="_blank"
                  href="https://forms.gle/QYuEa6YyDeGxSNxh9"
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      background:
                        "linear-gradient(149deg, #B5499D 20.48%, #5735A3 71.51%)",
                      padding: 14,
                      boxSizing: "border-box",
                      borderRadius: 4,
                    }}
                  >
                    <RHLogo withText white />
                    <div
                      style={{
                        fontSize: 30,
                        fontWeight: 600,
                        marginTop: 16,
                        color: "white",
                      }}
                    >
                      Get your experiment funded on ResearchHub
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        marginTop: 8,
                        color: "white",
                        lineHeight: 1.4,
                      }}
                    >
                      Submit a preregistration to be eligible for crowdfunding
                    </div>
                    <div
                      style={{
                        marginTop: 24,
                        background: "#FFCD33",
                        color: "#593F94",
                        fontWeight: 500,
                        padding: "11px 0px",
                        width: "100%",
                        display: "inline-block",
                        borderRadius: 4,
                        textAlign: "center",
                      }}
                    >
                      Apply for Funding
                    </div>
                    <div
                      style={{
                        color: "#FFCD33",
                        fontSize: 12,
                        marginTop: 12,
                        fontWeight: 400,
                        paddingBottom: 4,
                      }}
                    >
                      Submissions close on January 15
                    </div>
                  </div>
                </Link>
              }
              contentStyleOverride={{
                margin: 16,
              }}
              exitButton={
                <div style={{ fontSize: 20, color: "white", padding: 8 }}>
                  {<FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>}
                </div>
              }
              exitButtonPositionOverride={{
                top: "20px !important",
                right: "24px !important",
              }}
            />
            {/* <ExitableBanner
              bannerKey={INFO_TAB_EXIT_KEY}
              content={<RhCarousel rhCarouselItems={carouselElements} />}
              contentStyleOverride={{
                background: colors.NEW_BLUE(0.07),
                borderRadius: 6,
                boxSizing: "border-box !important",
                height: "180px !important",
                margin: 16,
                maxHeight: "180px !important",
                padding: 16,
              }}
              exitButton={
                <div style={{ fontSize: 20 }}>
                  {<FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>}
                </div>
              }
              exitButtonPositionOverride={{
                top: "20px !important",
                right: "24px !important",
              }}
              onExit={silentEmptyFnc}
            /> */}
          </div>
          <div className={css(styles.banner)}>
            {home && <Head title={home && null} />}
          </div>
          <div className={css(styles.row, styles.homeContentContainerBody)}>
            {this.props.isLiveFeed ? (
              <div className={css(styles.liveFeedwrapper)}>
                <LiveFeed hub={hub} isHomePage={home} />
              </div>
            ) : this.props.isSingleDocTypeFeed ? (
              <SingleTypeUnifiedDocFeedContainer
                feed={feed}
                loggedIn={loggedIn}
                serverLoadedData={initialFeed}
                docType={this.props.docType}
              />
            ) : (
              <UnifiedDocFeedContainer
                feed={feed}
                home={home}
                hubName={home ? (feed ? "ResearchHub" : "My Hubs") : hub.name}
                hubState={hubState}
                hub={hub}
                loggedIn={loggedIn}
                serverLoadedData={initialFeed}
                subscribeButton={
                  <SubscribeButton
                    {...this.props}
                    {...this.state}
                    onClick={() => this.setState({ transition: true })}
                    onSubscribe={this.onSubscribe}
                    onUnsubscribe={this.onUnsubscribe}
                  />
                }
              />
            )}
          </div>
        </div>
        <HomeRightSidebar />
      </div>
    );
  }
}

var styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: 500,
    textOverflow: "ellipsis",
    marginBottom: 5,
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      fontSize: 30,
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 24,
      marginTop: 0,
    },
    [`@media only screen and (max-width: ${breakpoints.xxxsmall.str})`]: {
      fontSize: 20,
    },
  },
  liveFeedwrapper: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    // paddingLeft: 16,
    // paddingRight: 16,
    [`@media only screen and (min-width: ${breakpoints.large.str})`]: {
      paddingLeft: 28,
      paddingRight: 28,
    },
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      width: "100%",
    },
    [`@media only screen and (max-width: ${breakpoints.xxsmall})`]: {
      width: "100%",
    },
  },

  rhHomeContainer: {
    display: "flex",
    height: "100%",
    justifyContent: "center",
    width: "100%",
    boxSizing: "border-box",
  },
  homeContentContainer: {
    width: "inherit",
    height: "inherit",
    maxWidth: 2000,
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    color: "#FFF",
    fontFamily: "Roboto",
    cursor: "default",
  },
  titleContainer: {
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: 16,
    paddingLeft: "8%",
    paddingTop: 0,
    boxSizing: "border-box",
    height: 200,
    zIndex: 2,
    "@media only screen and (max-width: 767px)": {
      height: "unset",
      justifyContent: "flex-start",
    },
  },
  disableScope: {
    pointerEvents: "none",
    cursor: "not-allowed",
    opacity: 0.4,
  },
  centered: {
    height: 120,
  },
  placeholder: {
    marginTop: 16,
  },
  placeholderBottom: {
    marginTop: 16,
  },
  readMore: {
    cursor: "pointer",
    textDecoration: "underline",
    color: "#FFF",
    ":hover": {
      fontWeight: 400,
    },
  },
  header: {
    fontSize: 50,
    fontWeight: 400,
    "@media only screen and (max-width: 685px)": {
      fontSize: 40,
    },
    "@media only screen and (max-width: 577px)": {
      fontSize: 25,
      marginTop: 16,
      width: 300,
    },
    "@media only screen and (max-width: 321px)": {
      width: 280,
    },
  },
  homeContentContainerBody: {
    alignItems: "flex-start",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "row",
    height: "100%",
    marginTop: 12,
    width: "100%",
    "@media only screen and (max-width: 990px)": {
      padding: "0px 20px",
    },
    "@media only screen and (max-width: 767px)": {
      padding: "0px 16px",
      maxWidth: 550,
      display: "block",
      minWidth: "unset",
    },
  },
  mainfeed: {
    minHeight: "inherit",
    height: "100%",
    width: "100%",
    maxWidth: 1200,
    // display: "table-cell",
    flexDirection: "column",
    "@media only screen and (min-width: 1920px)": {
      minWidth: 1200,
    },
    "@media only screen and (max-width: 990px)": {
      width: "100%",
    },
    "@media only screen and (max-width: 415px)": {
      padding: 0,
      width: "100%",
    },
  },
  allFeedButton: {
    position: "absolute",
    bottom: 100,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 3,
    cursor: "pointer",
    boxSizing: "border-box",
    width: "unset",
    padding: "0px 15px",
    boxShadow: "0 0 15px rgba(0, 0, 0, 0.14)",
  },
  sidebar: {
    // display: "table-cell",
    paddingBottom: 30,
    // "@media only screen and (min-width: 1920px)": {
    //   minWidth: 280,
    // },
    "@media only screen and (max-width: 1199px)": {
      display: "none",
    },
  },
  leftSidebarContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: 260,
    minWidth: 260,
    maxWidth: 260,
    minHeight: "100%",
    height: "100%",
  },
  banner: {
    width: "100%",
  },
  titleBoxShadow: {
    boxShadow: "0 4px 41px -24px rgba(0,0,0,0.16)",
  },
  mobileInfoTab: {
    display: "none",
    width: 0,
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      display: "block",
      width: "100%",
    },
  },
});

const mapStateToProps = (state) => ({
  modals: state.modals,
  auth: state.auth,
  user: state.auth.user,
  isLoggedIn: state.auth.isLoggedIn,
  hubState: state.hubs,
  allHubs: state.hubs.hubs,
  topHubs: state.hubs.topHubs,
});

const mapDispatchToProps = {
  getUser: AuthActions.getUser,
  setUserBannerPreference: AuthActions.setUserBannerPreference,
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
  updateSubscribedHubs: HubActions.updateSubscribedHubs,
  getTopHubs: HubActions.getTopHubs,
};

export default connect(mapStateToProps, mapDispatchToProps)(HubPage);
