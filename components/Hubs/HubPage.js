import { Fragment } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import * as moment from "dayjs";
import ReactPlaceholder from "react-placeholder/lib";
import Ripples from "react-ripples";
import * as Sentry from "@sentry/browser";
import Router from "next/router";

// Component
import FeedList from "./FeedList";
import HubsList from "~/components/Hubs/HubsList";
import FormSelect from "~/components/Form/FormSelect";
import PaperEntryCard from "~/components/Hubs/PaperEntryCard";
import Loader from "~/components/Loader/Loader";
import Button from "../Form/Button";
import PaperPlaceholder from "../Placeholders/PaperPlaceholder";
import PermissionNotificationWrapper from "~/components/PermissionNotificationWrapper";
import Head from "~/components/Head";
import LeaderboardContainer from "../Leaderboard/LeaderboardContainer";
import MainHeader from "../Home/MainHeader";
import SubscribeButton from "../Home/SubscribeButton";

// Redux
import { AuthActions } from "~/redux/auth";
import { MessageActions } from "~/redux/message";
import { ModalActions } from "~/redux/modals";
import { HubActions } from "~/redux/hub";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";
import { getFragmentParameterByName } from "~/config/utils";
import { filterOptions, scopeOptions } from "~/config/utils/options";

const defaultFilter = filterOptions[0];
const defaultScope = scopeOptions[0];

class HubPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count:
        this.props.initialFeed && this.props.initialFeed.count
          ? this.props.initialFeed.count
          : 0,
      papers:
        this.props.initialFeed && this.props.initialFeed.results.data
          ? this.props.initialFeed.results.data
          : [],
      noResults:
        this.props.initialFeed && this.props.initialFeed.results.no_results
          ? this.props.initialFeed.results.no_results
          : false,
      next:
        this.props.initialFeed && this.props.initialFeed.next
          ? this.props.initialFeed.next
          : null,
      page: this.props.page || 2,
      doneFetching: this.props.initialFeed ? true : false,
      filterBy: this.props.filter ? this.props.filter : defaultFilter,
      scope: this.props.scope ? this.props.scope : defaultScope,
      disableScope: this.props.filter
        ? this.props.filter.value === "hot" ||
          this.props.filter.value === "newest"
        : true,
      papersLoading: false,
      unsubscribeHover: false,
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

  /**
   * In this scroll listener, we're going to add a CSS class on the
   * title bar when we hit a certain height
   */
  scrollListener = () => {
    let { auth } = this.props;
    if (auth.showBanner && window.scrollY > 323) {
      this.setState({
        titleBoxShadow: true,
      });
    } else if (!auth.showBanner && window.scrollY > 27) {
      this.setState({
        titleBoxShadow: true,
      });
    } else if (!auth.showBanner && window.scrollY < 27) {
      this.setState({
        titleBoxShadow: false,
      });
    } else if (auth.showBanner && window.scrollY < 323) {
      this.setState({
        titleBoxShadow: false,
      });
    }
  };

  componentDidMount() {
    const { isLoggedIn, initialFeed, hubState } = this.props;

    if (initialFeed) {
      this.detectPromoted(this.state.papers);
    } else {
      this.fetchPapers({ hub: this.props.hub });
    }

    if (isLoggedIn) {
      this.checkUserVotes(this.state.papers);
    }

    let subscribed = hubState.subscribedHubs ? hubState.subscribedHubs : [];
    let subscribedHubs = {};
    subscribed.forEach((hub) => {
      subscribedHubs[hub.id] = true;
    });

    this.setState({
      subscribe: this.props.hub ? subscribedHubs[this.props.hub.id] : null,
    });
    window.addEventListener("scroll", this.scrollListener);
  }

  componentDidUpdate = async (prevProps, prevState) => {
    const { auth, user, hubState } = this.props;
    let subscribed = hubState.subscribedHubs ? hubState.subscribedHubs : [];
    let subscribedHubs = {};
    subscribed.forEach((hub) => {
      subscribedHubs[hub.id] = true;
    });

    if (
      prevProps.hub &&
      this.props.hub &&
      prevProps.hub.id !== this.props.hub.id
    ) {
      if (this.props.hub.id) {
        this.setState(
          {
            subscribe: this.props.hub
              ? subscribedHubs[this.props.hub.id]
              : null,
            page: 1,
          },
          () => {
            this.fetchPapers({ hub: this.props.hub });
          }
        );
      }
    }

    if (!prevProps.isLoggedIn && this.props.isLoggedIn) {
      this.checkUserVotes(this.state.papers);
      if (this.props.hub && this.props.hub.id) {
        fetch(API.HUB({ slug: this.props.slug }), API.GET_CONFIG())
          .then(Helpers.checkStatus)
          .then(Helpers.parseJSON)
          .then((res) => {
            this.setState({
              subscribe: subscribedHubs[this.props.hub.id],
            });
          });

        this.setState({
          subscribe: this.props.hub ? subscribedHubs[this.props.hub.id] : null,
        });
      }
    }

    if (
      prevState.scope !== this.state.scope ||
      prevState.filterBy !== this.state.filterBy
    ) {
      this.fetchPapers({ hub: this.props.hub });
    }
  };

  componentWillUnmount() {
    window.removeEventListener("scroll", this.scrollListener);
  }

  checkUserVotes = (papers) => {
    let paperIds = papers.map((paper) => paper.id);
    if (!paperIds || !paperIds.length) {
      return null;
    }
    return fetch(API.CHECK_USER_VOTE({ paperIds }), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        let updates = { ...res };
        let updatedPapers = papers.map((paper) => {
          if (updates[paper.id]) {
            paper.user_vote = updates[paper.id];
          }
          return paper;
        });

        this.setState(
          {
            papers: [],
          },
          () => {
            this.setState({ papers: updatedPapers });
          }
        );
      });
  };

  detectPromoted = (papers) => {
    let promotedPapers = [];
    papers.forEach((paper) => {
      if (paper.promoted) {
        promotedPapers.push(paper.id);
      }
    });

    let createdLocationMeta = this.state.filterBy;
    if (createdLocationMeta === "hot") {
      createdLocationMeta = "trending";
    }
    let payload = {
      paper_ids: promotedPapers,
      paper_is_boosted: true,
      interaction: "VIEW",
      created_location: "FEED",
      created_location_meta: "trending",
    };
    fetch(
      API.PROMOTION_STATS({ route: "batch_views" }),
      API.POST_CONFIG(payload)
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {})
      .catch((err) => {});
  };

  fetchPapers = ({ hub }) => {
    this.setState({ doneFetching: false });
    if (this.state.papersLoading) {
      return null;
    }

    if (hub && !hub.id) {
      return null;
    }

    this.state.doneFetching && this.setState({ doneFetching: false });
    let hubId = 0;

    if (hub) {
      hubId = hub.id;
    }
    let scope = this.calculateScope();
    this.setState({
      papersLoading: true,
    });

    return fetch(
      API.GET_HUB_PAPERS({
        timePeriod: scope,
        hubId: hubId,
        ordering: this.state.filterBy.value,
        page: this.state.page,
      }),
      API.GET_CONFIG()
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        this.detectPromoted([...res.results.data]);
        this.setState({
          count: res.count,
          papers: res.results.data,
          next: res.next,
          page: this.state.page + 1,
          papersLoading: false,
          doneFetching: true,
          noResults: res.results.no_results,
        });
        if (res.results.data.length > 0) {
          this.checkUserVotes(res.results.data);
        }
      })
      .catch((error) => {
        // If we get a 401 error it means the token is expired.
        if (error.response && error.response.status === 401) {
          this.setState(
            {
              papersLoading: false,
            },
            () => {
              this.fetchPapers({ hub: this.props.hub });
            }
          );
        }
        Sentry.captureException(error);
      });
  };

  loadMore = () => {
    let { hub } = this.props;
    let hubId = 0;
    if (hub) {
      hubId = hub.id;
    }

    if (this.state.loadingMore) {
      return;
    }

    this.setState({
      loadingMore: true,
    });

    let scope = this.calculateScope();

    let url = API.GET_HUB_PAPERS({
      timePeriod: scope,
      hubId: hubId,
      page: this.state.page,
      ordering: this.state.filterBy.value,
    });

    return fetch(url, API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        this.detectPromoted([...res.results.data]);
        this.setState(
          {
            papers: [...this.state.papers, ...res.results.data],
            next: res.next,
            prev: !res.next ? res.previous : null,
            page: this.state.page + 1,
            loadingMore: false,
          },
          () => {
            let page = getFragmentParameterByName(
              "page",
              this.state.next ? this.state.next : this.state.prev
            ); // grab page from backend response
            let offset = this.state.next ? -1 : 1;
            page = Number(page) + offset;
            this.updateSlugs(page);
          }
        );
      });
  };

  updateSlugs = (page) => {
    const { filterBy, scope, disableScope } = this.state;

    const filter = filterBy.label
      .split(" ")
      .join("-")
      .toLowerCase();

    let href, as;

    if (disableScope) {
      // if filter, but no scope
      if (this.props.home) {
        href = "/[filter]";
        as = `/${filter}`;
      } else {
        // Hub Page
        href = "/hubs/[slug]/[filter]";
        as = `/hubs/${this.props.slug}/${filter}`;
      }
    } else {
      // filter & scope
      if (this.props.home) {
        href = "/[filter]/[scope]";
        as = `/${filter}/${scope.value}`;
      } else {
        href = "/hubs/[slug]/[filter]/[scope]";
        as = `/hubs/${this.props.slug}/${filter}/${scope.value}`;
      }
    }

    if (this.props.home && filter === "trending") {
      href = "/";
      as = "/";
    } else if (!this.props.home && filter === "trending") {
      href = "/hubs/[slug]";
      as = `/hubs/${this.props.slug}`;
    }

    if (page) {
      as += `?page=${page}`;
    }

    Router.push(href, as, { shallow: true });
  };

  calculateScope = () => {
    let scope = {
      start: 0,
      end: 0,
    };
    let scopeId = this.state.scope.value;

    let now = moment();
    let today = moment().startOf("day");
    let week = moment()
      .startOf("day")
      .subtract(7, "days");
    let month = moment()
      .startOf("day")
      .subtract(30, "days");
    let year = moment()
      .startOf("day")
      .subtract(365, "days");

    scope.end = now.unix();

    if (scopeId === "day") {
      scope.start = today.unix();
    } else if (scopeId === "week") {
      scope.start = week.unix();
    } else if (scopeId === "month") {
      scope.start = month.unix();
    } else if (scopeId === "year") {
      scope.start = year.unix();
    } else if (scopeId === "all-time") {
      let start = "2019-01-01";
      let diff = now.diff(start, "days") + 1;

      let alltime = now.startOf("day").subtract(diff, "days");
      scope.start = alltime.unix();
    }

    return scope;
  };

  formatMainHeader = () => {
    const { filterBy } = this.state;
    const isHomePage = this.props.home;
    let prefix = "";

    switch (filterBy.value) {
      case "removed":
        prefix = "Removed";
        break;
      case "hot":
        prefix = "Trending";
        break;
      case "top_rated":
        prefix = "Top";
        break;
      case "newest":
        prefix = "Newest";
        break;
      case "most_discussed":
        prefix = "Most Discussed";
        break;
    }
    return `${prefix} Papers ${isHomePage ? "on" : "in"} `;
  };

  onFilterSelect = (type, option) => {
    if (option.disableScope) {
      this.setState({
        disableScope: true,
      });
    } else {
      this.setState({
        disableScope: false,
      });
    }

    if (this.state[type].label === option.label) {
      return;
    }

    const param = {
      page: 1,
      [type]: option,
    };

    this.setState(
      {
        ...param,
      },
      () => {
        this.updateSlugs();
      }
    );
  };

  onScopeSelect = (type, option) => {
    if (this.state[type].label === option.label) {
      return;
    }
    const param = {
      page: 1,
      [type]: option,
    };

    this.setState(
      {
        ...param,
      },
      () => {
        this.updateSlugs();
      }
    );
  };

  voteCallback = (index, paper) => {
    const papers = [...this.state.papers];
    papers[index] = paper;
    this.setState({
      papers,
    });
  };

  updateSubscription = (subscribing) => {
    const { hub, hubState, updateSubscribedHubs } = this.props;
    let subscribedHubs = [];
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

  onSubscribe = () => {
    const { showMessage, setMessage } = this.props;
    this.updateSubscription(true);
    setMessage("Subscribed!");
    showMessage({ show: true });
    this.setState({
      transition: false,
      subscribe: !this.state.subscribe,
    });
  };

  onUnsubscribe = () => {
    const { showMessage, setMessage } = this.props;
    this.updateSubscription(false);
    setMessage("Unsubscribed!");
    showMessage({ show: true });
    this.setState({
      transition: false,
      subscribe: !this.state.subscribe,
    });
  };

  navigateToPaperUploadPage = () => {
    Router.push(`/paper/upload/info`, `/paper/upload/info`);
  };

  renderLoadMoreButton = () => {
    const { next, loadingMore } = this.state;
    if (next !== null) {
      return (
        <div className={css(styles.buttonContainer)}>
          {!loadingMore ? (
            <Ripples
              className={css(styles.loadMoreButton)}
              onClick={this.loadMore}
            >
              Load More Papers
            </Ripples>
          ) : (
            <Loader
              key={"paperLoader"}
              loading={true}
              size={25}
              color={colors.BLUE()}
            />
          )}
        </div>
      );
    }
  };

  render() {
    const { auth } = this.props;
    if (auth.user.moderator && filterOptions.length < 5) {
      filterOptions.push({ value: "removed", label: "Removed" });
    }

    return (
      <div className={css(styles.content, styles.column)}>
        <div className={css(styles.banner)}>
          {this.props.home && <Head title={this.props.home && null} />}
        </div>
        <div className={css(styles.row, styles.body)}>
          <div className={css(styles.column, styles.mainfeed)}>
            <MainHeader
              {...this.props}
              {...this.state}
              title={this.formatMainHeader()}
              hubName={this.props.home ? "ResearchHub" : this.props.hub.name}
              scopeOptions={scopeOptions}
              filterOptions={filterOptions}
              onScopeSelect={this.onScopeSelect}
              onFilterSelect={this.onFilterSelect}
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
            <div className={css(styles.infiniteScroll)}>
              <ReactPlaceholder
                ready={this.state.doneFetching}
                showLoadingAnimation
                customPlaceholder={
                  <PaperPlaceholder color="#efefef" rows={3} />
                }
              >
                {this.state.papers.length > 0 ? (
                  <Fragment>
                    {this.state.papers.map((paper, i) => (
                      <PaperEntryCard
                        key={`${paper.id}-${i}`}
                        paper={paper}
                        index={i}
                        hubName={this.props.hubName}
                        voteCallback={this.voteCallback}
                      />
                    ))}
                    {this.renderLoadMoreButton()}
                  </Fragment>
                ) : (
                  <div
                    className={css(styles.column)}
                    style={{ height: this.state.height }}
                  >
                    <img
                      className={css(styles.emptyPlaceholderImage)}
                      src={"/static/background/homepage-empty-state.png"}
                      loading="lazy"
                      alt="Empty State Icon"
                    />
                    <div
                      className={css(styles.text, styles.emptyPlaceholderText)}
                    >
                      There are no academic papers uploaded for this hub.
                    </div>
                    <div
                      className={css(
                        styles.text,
                        styles.emptyPlaceholderSubtitle
                      )}
                    >
                      Click ‘Upload paper’ button to upload a PDF
                    </div>
                    <PermissionNotificationWrapper
                      onClick={this.navigateToPaperUploadPage}
                      modalMessage="upload a paper"
                      loginRequired={true}
                      permissionKey="CreatePaper"
                    >
                      <Button label={"Upload Paper"} hideRipples={true} />
                    </PermissionNotificationWrapper>
                  </div>
                )}
              </ReactPlaceholder>
            </div>
            <div className={css(styles.mobileHubListContainer)}>
              <HubsList
                current={this.props.home ? null : this.props.hub}
                overrideStyle={styles.mobileList}
                initialHubList={this.props.initialHubList}
              />
            </div>
          </div>
          <div className={css(styles.column, styles.sidebar)}>
            <FeedList />
            <HubsList
              current={this.props.home ? null : this.props.hub}
              initialHubList={this.props.initialHubList}
            />
            <LeaderboardContainer
              hubId={0}
              initialUsers={this.props.leaderboardFeed}
            />
          </div>
        </div>
      </div>
    );
  }
}

var styles = StyleSheet.create({
  content: {},
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
  body: {
    // backgroundColor: "#FCFCFC",
    width: "100%",
    display: "flex",
    // alignItems: "flex-start",
    justifyContent: "center",
    alignItems: "flex-start",
    // display: "table",
    // tableLayout: "fixed",
    "@media only screen and (max-width: 767px)": {
      display: "flex",
    },
  },
  mainfeed: {
    // display: "table-cell",
    height: "100%",
    width: "60%",
    // tableLayout: "fixed",
    // backgroundColor: "#FCFCFC",
    // borderRight: "1px solid #ededed",
    // "@media only screen and (min-width: 900px)": {
    //   width: "82%",
    // },
    // "@media only screen and (max-width: 768px)": {
    //   width: "100%",
    // },
  },
  sidebar: {
    // backgroundColor: "#FFF",
    // width: "20%",
    width: 280,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    // minWidth: 220,
    // width: 360,
    // maxWidth: 360,
    // paddingTop: 10,
    "@media only screen and (max-width: 990px)": {
      display: "none",
    },
  },
  subtext: {
    whiteSpace: "initial",
    width: 670,
    fontSize: 16,
    fontWeight: 300,
    "@media only screen and (max-width: 799px)": {
      width: "100%",
      fontSize: 16,
    },
    "@media only screen and (max-width: 577px)": {
      fontSize: 16,
      width: 305,
      marginTop: 20,
    },
    "@media only screen and (max-width: 321px)": {
      width: 280,
    },
  },
  banner: {
    width: "100%",
  },
  promo: {
    marginTop: 15,
    fontSize: 15,
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
  },
  button: {
    height: 55,
    width: 230,
    marginTop: 10,
    marginBottom: 0,
  },
  iconStyle: {
    height: 33,
    width: 33,
  },
  coinIcon: {
    height: 20,
    marginLeft: 8,
    "@media only screen and (max-width: 760px)": {
      height: 18,
    },
    "@media only screen and (max-width: 415px)": {
      height: 16,
    },
  },
  /**
   * MAIN FEED STYLES
   */

  feedTitle: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    color: "#241F3A",
    fontWeight: 400,
    fontSize: 30,
    flexWrap: "wrap",
    whiteSpace: "pre-wrap",
    width: "100%",
    textAlign: "center",
    padding: 0,
    margin: 0,
    "@media only screen and (min-width: 800px)": {
      textAlign: "left",
      paddingRight: 16,
    },
    "@media only screen and (max-width: 1149px)": {
      fontSize: 30,
    },
    "@media only screen and (max-width: 665px)": {
      fontSize: 25,
    },
    "@media only screen and (max-width: 416px)": {
      fontSize: 25,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 20,
    },
  },
  feedSubtitle: {
    fontSize: 14,
    "@media only screen and (max-width: 665px)": {
      display: "none",
    },
  },
  fullWidth: {
    width: "100%",
    boxSizing: "border-box",
  },
  titleBoxShadow: {
    boxShadow: "0 4px 41px -24px rgba(0,0,0,0.16)",
  },
  topbar: {
    paddingTop: 30,
    paddingBottom: 20,
    width: "100%",
    paddingLeft: 70,
    paddingRight: 70,
    boxSizing: "border-box",
    // backgroundColor: "#FCFCFC",
    alignItems: "center",
    zIndex: 2,
    top: 80,
    "@media only screen and (min-width: 900px)": {
      paddingLeft: 25,
      paddingRight: 25,
    },
    "@media only screen and (min-width: 1200px)": {
      paddingLeft: 50,
      paddingRight: 50,
    },

    "@media only screen and (max-width: 767px)": {
      position: "relative",
      top: 0,
    },
    "@media only screen and (max-width: 665px)": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
      paddingBottom: 20,
    },
    "@media only screen and (max-width: 577px)": {
      paddingLeft: 40,
      paddingRight: 40,
      width: "100%",
      boxSizing: "border-box",
    },
    "@media only screen and (max-width: 416px)": {
      paddingLeft: 30,
      paddingRight: 30,
    },
  },
  dropDown: {
    width: 140,
    margin: 0,
    minHeight: "unset",
    fontSize: 14,
    "@media only screen and (max-width: 1343px)": {
      height: "unset",
    },
    "@media only screen and (max-width: 1149px)": {
      width: 150,
      fontSize: 13,
    },
    "@media only screen and (max-width: 779px)": {
      width: "calc(50% - 5px)",
      fontSize: 14,
    },
  },
  dropDownLeft: {
    width: 140,
    margin: 0,
    minHeight: "unset",
    fontSize: 14,
    marginRight: 10,
    "@media only screen and (max-width: 1343px)": {
      height: "unset",
    },
    "@media only screen and (max-width: 1149px)": {
      width: 150,
      fontSize: 13,
    },
    "@media only screen and (max-width: 779px)": {
      width: "calc(50% - 5px)",
    },
  },
  inputContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "@media only screen and (max-width: 1149px)": {
      fontSize: 13,
    },
    "@media only screen and (max-width: 779px)": {
      flexDirection: "column",
      alignItems: "flex-end",
    },
  },
  hubInputContainer: {
    width: "100%",
    marginTop: 16,
  },
  homeInputContainer: {
    justifyContent: "flex-end",

    "@media only screen and (max-width: 799px)": {
      width: "100%",
      marginTop: 16,
    },
  },
  smallerInputContainer: {
    width: "unset",
  },
  inputs: {
    "@media only screen and (max-width: 779px)": {
      width: "100%",
      justifyContent: "flex-end",
      alignItems: "center",
    },
  },
  /**
   * INFINITE SCROLL
   */
  infiniteScroll: {
    width: "100%",
    boxSizing: "border-box",
    minHeight: "calc(100vh - 200px)",
    // backgroundColor: "#FCFCFC",
    // paddingLeft: 70,
    // paddingRight: 20,
    paddingBottom: 30,
    "@media only screen and (min-width: 900px)": {
      paddingLeft: 25,
      paddingRight: 25,
    },
    "@media only screen and (min-width: 1200px)": {
      paddingLeft: 50,
      paddingRight: 50,
    },
    "@media only screen and (min-width: 800px)": {
      paddingTop: 25,
    },
    "@media only screen and (max-width: 577px)": {
      paddingLeft: 40,
      paddingRight: 40,
    },
    "@media only screen and (max-width: 415px)": {
      padding: 0,
      width: "100%",
    },
  },
  blur: {
    height: 30,
    marginTop: 10,
    backgroundColor: colors.BLUE(0.2),
    width: "100%",
    "-webkit-filter": "blur(6px)",
    "-moz-filter": "blur(6px)",
    "-ms-filter": "blur(6px)",
    "-o-filter": "blur(6px)",
    filter: "blur(6px)",
  },
  blank: {
    opacity: 0,
    height: 60,
  },
  hubName: {
    textTransform: "capitalize",
    marginRight: 13,
    "@media only screen and (max-width: 1343px)": {
      marginRight: 8,
    },
    "@media only screen and (max-width: 1149px)": {
      marginRight: 5,
    },
  },
  mobileHubListContainer: {
    display: "none",
    backgroundColor: "#FFF",
    "@media only screen and (max-width: 990px)": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      borderTop: "1px solid #EDEDED",
    },
  },
  mobileList: {
    paddingTop: 20,
    width: "90%",
  },
  emptyPlaceholderImage: {
    width: 400,
    objectFit: "contain",
    marginTop: 40,
    "@media only screen and (max-width: 415px)": {
      width: "70%",
    },
  },
  emptyPlaceholderText: {
    width: 500,
    textAlign: "center",
    fontSize: 18,
    color: "#241F3A",
    marginTop: 20,
    "@media only screen and (max-width: 415px)": {
      width: "85%",
    },
  },
  emptyPlaceholderSubtitle: {
    width: 500,
    textAlign: "center",
    fontSize: 14,
    color: "#4e4c5f",
    marginTop: 10,
    marginBottom: 15,
    "@media only screen and (max-width: 415px)": {
      width: "85%",
    },
  },
  optionContainer: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  icon: {
    marginLeft: 5,
  },
  loader: {
    opacity: 1,
    height: 15,
    width: 55,
    "@media only screen and (max-width: 768px)": {
      width: 48,
    },
  },
  noResultsLine: {
    textAlign: "center",
    fontSize: 20,
    marginBottom: 16,
    padding: 16,
    borderBottom: "1px solid",
  },
  relatedResults: {
    textAlign: "center",
    fontSize: 25,
    marginBottom: 16,
  },
  subscribeContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    "@media only screen and (max-width: 665px)": {
      marginRight: 10,
    },
    "@media only screen and (max-width: 799px)": {
      marginRight: 0,
      width: "100%",
      justifyContent: "center",
      marginBottom: 16,
    },
  },
  subscribe: {
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: 0.7,
    width: 120,
    height: 37,
    boxSizing: "border-box",
    // padding: "5px 15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    color: "#FFF",
    backgroundColor: colors.BLUE(),
    borderRadius: 3,
    border: "none",
    outline: "none",
    boxSizing: "border-box",
    ":hover": {
      background: "#3E43E8",
    },
    "@media only screen and (max-width: 1149px)": {
      fontSize: 13,
    },
    "@media only screen and (max-width: 801px)": {
      width: "100%",
    },
  },
  subscribed: {
    backgroundColor: "#FFF",
    color: colors.BLUE(1),
    border: `1px solid ${colors.BLUE(1)}`,
    ":hover": {
      border: `1px solid ${colors.BLUE(1)}`,
      backgroundColor: colors.BLUE(1),
      color: "#FFF",
    },
  },
  leaderboard: {
    display: "none",
    background: "#FCFCFC",
    "@media only screen and (min-width: 900px)": {
      display: "block",
      width: "20%",
      marginRight: 40,
    },
    "@media only screen and (min-width: 1200px)": {
      width: "18%",
    },
    "@media only screen and (min-width: 1440px)": {
      width: "15%",
      marginRight: 50,
    },
  },
  subscribeHover: {
    ":hover": {
      color: "#fff",
      backgroundColor: colors.RED(1),
      border: `1px solid ${colors.RED(1)}`,
    },
  },
  buttonContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    height: 45,
    "@media only screen and (max-width: 768px)": {
      marginTop: 15,
      marginBottom: 15,
    },
  },
  loadMoreButton: {
    fontSize: 14,
    border: `1px solid ${colors.BLUE()}`,
    boxSizing: "border-box",
    borderRadius: 4,
    height: 45,
    width: 155,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: colors.BLUE(),
    cursor: "pointer",
    userSelect: "none",
    ":hover": {
      color: "#FFF",
      backgroundColor: colors.BLUE(),
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
  openRecaptchaPrompt: ModalActions.openRecaptchaPrompt,
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
  updateSubscribedHubs: HubActions.updateSubscribedHubs,
  getTopHubs: HubActions.getTopHubs,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HubPage);
