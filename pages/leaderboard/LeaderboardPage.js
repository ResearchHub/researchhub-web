import React, { Fragment } from "react";
import { connect } from "react-redux";
import Router from "next/router";
import Ripples from "react-ripples";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import ReactPlaceholder from "react-placeholder/lib";
import TimeAgo from "javascript-time-ago";

// Load locale-specific relative date/time formatting rules.
import en from "javascript-time-ago/locale/en";
// Add locale-specific relative date/time formatting rules.
TimeAgo.addLocale(en);

// Create relative date/time formatter.
const timeAgo = new TimeAgo("en-US");

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

// Components
import ContentPage from "../../components/ContentPage/ContentPage";
import SidebarList from "../../components/ContentPage/SidebarList";
import FormSelect from "~/components/Form/FormSelect";
import LeaderboardPlaceholder from "../../components/Placeholders/LeaderboardPlaceholder";
import colors from "../../config/themes/colors";
import LeaderboardUser from "../../components/Leaderboard/LeaderboardUser";
import Loader from "~/components/Loader/Loader";
import PaperEntryCard from "../../components/Hubs/PaperEntryCard";

const filterOptions = [
  {
    value: "today",
    label: "Today",
  },
  {
    value: "past_week",
    label: "Past Week",
  },
  {
    value: "past_month",
    label: "Past Month",
  },
  {
    value: "past_year",
    label: "Past Year",
    disableScope: true,
  },
  {
    value: "all_time",
    label: "All Time",
    disableScope: true,
  },
];

const createdOptions = [
  {
    value: "created_date",
    label: "Paper Submission Date",
  },
  {
    value: "published_date",
    label: "Paper Published Date",
  },
];

const createdByOptions = createdOptions[0];
const defaultFilterBy = filterOptions[4];

class Index extends React.Component {
  constructor(props) {
    super(props);

    let byOptions = [{ label: "All Hubs", value: 0 }];
    let defaultBy = byOptions[0];

    if (this.props.hub) {
      defaultBy = { label: this.props.hub.name, value: this.props.hub.id };
    }

    this.state = {
      items: [],
      hubId: null,
      fetchingLeaderboard: true,
      byOptions,
      by: defaultBy,
      createdByOptions,
      filterBy: defaultFilterBy,
      loadingMore: false,
      page: 1,
      next: null,
      type: "users",
    };

    Router.events.on("routeChangeComplete", (url) => {
      this.setState({
        type: Router.router.query.type,
      });
    });

    this.items = [
      { name: "Users", id: "users", type: "users" },
      { name: "Authors", id: "authors", type: "authors" },
      { name: "Papers", id: "papers", type: "papers" },
    ];
  }

  /**
   * fetches user leaderboard from the backend
   */
  fetchLeaderboard = (type) => {
    this.setState({
      fetchingLeaderboard: true,
    });
    return fetch(
      API.LEADERBOARD({
        limit: 20,
        page: 1,
        hubId: this.state.by.value,
        dateOption: this.state.createdByOptions.value,
        type,
        timeframe: this.state.filterBy.value,
      }),
      API.GET_CONFIG()
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        this.setState({
          items: res.results,
          next: res.next,
          fetchingLeaderboard: false,
        });
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

    return fetch(this.state.next, API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        this.setState({
          items: [...this.state.items, ...res.results],
          next: res.next,
          page: this.state.page + 1,
          loadingMore: false,
        });
      });
  };

  convertToSlug = (value) => {
    return value.split("_").join("-");
  };

  onFilterSelect = (option, type) => {
    let by = option;

    Router.push(
      "/leaderboard/[type]/[hub]/[scope]",
      `/leaderboard/${this.state.type}/${option.slug}/${this.convertToSlug(
        this.state.filterBy.value
      )}`
    );

    this.setState(
      {
        by,
      },
      () => {
        this.fetchLeaderboard(this.state.type);
      }
    );
  };

  onCreatedByChange = (option) => {
    let createdByOptions = option;
    this.setState(
      {
        createdByOptions,
      },
      () => {
        this.fetchLeaderboard(this.state.type);
      }
    );
  };

  onTimeframeChange = (option) => {
    let filterBy = option;

    if (filterBy !== this.state.filterBy) {
      let option = this.state.by;
      let slug = this.convertToSlug(filterBy.value);

      Router.push(
        "/leaderboard/[type]/[hub]/[scope]",
        `/leaderboard/${this.state.type}/${option.slug}/${slug}`
      );
      this.setState(
        {
          filterBy,
        },
        () => {
          this.fetchLeaderboard(this.state.type);
        }
      );
    }
  };

  /**
   * Setting up hubs
   */
  setHubs = (hubs) => {
    let byOptions = [];

    for (let i = 0; i < hubs.length; i++) {
      byOptions.push({
        label: hubs[i].name,
        value: hubs[i].id,
        slug: hubs[i].slug,
      });
    }

    byOptions = [
      { label: "ResearchHub", value: 0, slug: "researchhub" },
      ...byOptions.sort((a, b) => {
        return a.label.localeCompare(b.label);
      }),
    ];

    this.setState({
      byOptions,
    });

    return byOptions;
  };

  componentDidMount() {
    let byOptions = this.setHubs(this.props.hubs.hubs);
    let type = decodeURIComponent(Router.router.query.type);
    let hub = decodeURIComponent(Router.router.query.hub);
    let scope = Router.router.query.scope
      ? decodeURIComponent(Router.router.query.scope)
      : hub;

    let by =
      hub &&
      byOptions.filter((option) => {
        return option.slug === hub;
      })[0];

    let filterBy =
      scope &&
      filterOptions.filter((filter) => {
        return filter.value === scope.split("-").join("_");
      })[0];

    this.setState(
      {
        type,
        by: by ? by : { label: "ResearchHub", value: 0, slug: "researchhub" },
        filterBy: filterBy ? filterBy : defaultFilterBy,
      },
      () => {
        this.fetchLeaderboard(type);
      }
    );
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.hubs.hubs !== this.props.hubs.hubs) {
      this.setHubs(this.props.hubs.hubs);
    }

    if (prevState.type !== this.state.type) {
      this.fetchLeaderboard(this.state.type);
    }
  };

  isCurrentItem = (currentType, itemType) => {
    return currentType === itemType;
  };

  getTitle = () => {
    let value = this.state.type;
    let type = "";
    switch (value) {
      case "users":
        type = "Users";
        break;
      case "papers":
        type = "Papers";
        break;
      case "authors":
        type = "Authors";
      default:
        return null;
    }
    return `Top ${type} ${this.state.by.value === 0 ? "on" : "in"} ${
      this.state.by.label
    } ${this.state.filterBy.label}`;
  };

  voteCallback = (index, paper) => {
    let items = [...this.state.items];
    items[index] = paper;
    this.setState({
      items,
    });
  };

  renderLoadMoreButton = () => {
    const { next, loadingMore } = this.state;
    if (next !== null) {
      return (
        <div className={css(mainFeedStyles.buttonContainer)}>
          {!loadingMore ? (
            <Ripples
              className={css(mainFeedStyles.loadMoreButton)}
              onClick={this.loadMore}
            >
              Load More
            </Ripples>
          ) : (
            <Loader
              key={"loader"}
              loading={true}
              size={25}
              color={colors.BLUE()}
            />
          )}
        </div>
      );
    }
  };

  renderLeaderboardPapers = () => {
    if (!this.state.items.length) {
      return (
        <div className={css(styles.emptyStateContainer)}>
          {`No papers found in this scope.`}
        </div>
      );
    }
    return this.state.items.map((paper, index) => {
      return (
        <div className={css(styles.paperEntryContainer)}>
          <PaperEntryCard
            paper={paper}
            index={index}
            voteCallback={this.voteCallback}
          />
        </div>
      );
    });
  };

  renderLeaderboardUsers = (type = "users") => {
    if (!this.state.items.length) {
      return (
        <div className={css(styles.emptyStateContainer)}>
          {`No ${type} found in this scope.`}
        </div>
      );
    }

    return this.state.items.map((user, index) => {
      if (type === "authors") {
        return (
          <LeaderboardUser
            key={`user_${index}_${user.id}`}
            userClass={styles.user}
            name={user.first_name + " " + user.last_name}
            authorProfile={user}
            reputation={user.total_score ? user.total_score : 0}
            repClass={styles.repClass}
            authorId={user.id}
            extraInfo={
              <span className={css(styles.createdAt)}>
                <span className={css(styles.bullet)}>•</span>
                <span>{timeAgo.format(new Date(user.created_date))}</span>
              </span>
            }
          />
        );
      } else if (type === "users") {
        return (
          <LeaderboardUser
            user={user}
            key={`user_${index}_${user.id}`}
            userClass={styles.user}
            name={
              user.author_profile.first_name +
              " " +
              user.author_profile.last_name
            }
            authorProfile={user.author_profile}
            reputation={
              this.state.by.value !== 0 ? user.hub_rep : user.reputation
            }
            repClass={styles.repClass}
            authorId={user.author_profile.id}
            extraInfo={
              <span className={css(styles.createdAt)}>
                <span className={css(styles.bullet)}>•</span>
                <span>{timeAgo.format(new Date(user.created_date))}</span>
              </span>
            }
          />
        );
      }
    });
  };

  /**
   * Rendering items
   */
  renderItems = () => {
    switch (this.state.type) {
      case "users":
        return (
          <Fragment>
            <div className={css(styles.leaderboardNav)}>
              <div className={css(styles.navItem, styles.userNav)}>User</div>
              <div className={css(styles.navItem, styles.rep)}>Reputation</div>
            </div>
            <div className={css(styles.leaderboardSection)}>
              {this.renderLeaderboardUsers()}
            </div>
          </Fragment>
        );
      case "authors":
        return (
          <Fragment>
            <div className={css(styles.leaderboardNav)}>
              <div className={css(styles.navItem, styles.userNav)}>Author</div>
              <div className={css(styles.navItem, styles.rep)}>Popularity</div>
            </div>
            <div className={css(styles.leaderboardSection)}>
              {this.renderLeaderboardUsers("authors")}
            </div>
          </Fragment>
        );
      default:
        return this.renderLeaderboardPapers();
    }
  };

  /**
   * Renders the entry for the sidebar
   */
  renderSidebarEntry = () => {
    return this.items.map((item, i) => {
      let { name, id } = item;

      return (
        <Ripples
          className={css(
            styles.sidebarEntry,
            this.isCurrentItem(this.state.type, id) && styles.current
          )}
          onClick={() => {
            if (this.state.type === item.type) {
              return;
            }
            this.setState({
              fetchingLeaderboard: true,
            });
          }}
          key={`${id}-${i}`}
        >
          <Link
            href={{
              pathname: "/leaderboard/[type]/[hub]/[scope]",
              query: {
                type: `${encodeURIComponent(item.type)}`,
              },
            }}
            as={`/leaderboard/${encodeURIComponent(item.type)}/${
              this.state.by.slug
            }/${this.convertToSlug(this.state.filterBy.value)}`}
          >
            <a className={css(styles.sidebarLink)}>{name}</a>
          </Link>
        </Ripples>
      );
    });
  };

  /**
   * Rendering main feed for the leaderboard
   */
  renderMainFeed = () => {
    return (
      <Fragment>
        <div
          className={css(
            mainFeedStyles.topbar,
            this.state.titleBoxShadow && mainFeedStyles.titleBoxShadow,
            mainFeedStyles.row
          )}
          id={"topbar"}
        >
          <div className={css(mainFeedStyles.text, mainFeedStyles.feedTitle)}>
            <div className={css(mainFeedStyles.row, mainFeedStyles.fullWidth)}>
              {this.getTitle()}
            </div>
          </div>
          <div
            className={css(
              mainFeedStyles.inputContainer,
              !this.props.home && mainFeedStyles.hubInputContainer,
              this.props.home && mainFeedStyles.homeInputContainer
            )}
          >
            <div className={css(mainFeedStyles.row, mainFeedStyles.inputs)}>
              <FormSelect
                options={this.state.byOptions}
                value={this.state.by}
                containerStyle={mainFeedStyles.dropDownLeft}
                // singleValue={{
                //   color: colors.PURPLE(),
                // }}
                indicatorSeparator={{
                  display: "none",
                }}
                inputStyle={{
                  fontWeight: 500,
                  minHeight: "unset",
                  backgroundColor: "#FFF",
                  display: "flex",
                  justifyContent: "space-between",
                }}
                menu={{
                  fontSize: 16,
                }}
                onChange={(id, option) => {
                  if (option.disableScope) {
                    this.setState({
                      disableScope: true,
                    });
                  } else {
                    this.setState({
                      disableScope: false,
                    });
                  }
                  this.onFilterSelect(option, id);
                }}
              />
              {this.state.type === "papers" && (
                <FormSelect
                  options={createdOptions}
                  value={this.state.createdByOptions}
                  containerStyle={[
                    mainFeedStyles.dropDownLeft,
                    mainFeedStyles.dropdownCreatedBy,
                  ]}
                  inputStyle={{
                    fontWeight: 500,
                    minHeight: "unset",
                    backgroundColor: "#FFF",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                  onChange={(id, option) => {
                    this.onCreatedByChange(option, id);
                  }}
                  isSearchable={false}
                />
              )}
              <FormSelect
                options={filterOptions}
                value={this.state.filterBy}
                containerStyle={mainFeedStyles.dropDownLeft}
                inputStyle={{
                  fontWeight: 500,
                  minHeight: "unset",
                  backgroundColor: "#FFF",
                  display: "flex",
                  justifyContent: "space-between",
                }}
                onChange={(id, option) => {
                  if (option.disableScope) {
                    this.setState({
                      disableScope: true,
                    });
                  } else {
                    this.setState({
                      disableScope: false,
                    });
                  }
                  this.onTimeframeChange(option, id);
                }}
                isSearchable={false}
              />
            </div>
          </div>
        </div>
        <div className={css(mainFeedStyles.infiniteScroll)}>
          {!this.state.fetchingLeaderboard ? (
            <Fragment>
              {this.renderItems()}
              {this.renderLoadMoreButton()}
            </Fragment>
          ) : (
            <div className={css(mainFeedStyles.placeholder)}>
              <ReactPlaceholder
                ready={false}
                showLoadingAnimation
                customPlaceholder={<LeaderboardPlaceholder color="#efefef" />}
              />
              <div className={css(mainFeedStyles.placeholderBottom)}>
                <ReactPlaceholder
                  ready={false}
                  showLoadingAnimation
                  customPlaceholder={<LeaderboardPlaceholder color="#efefef" />}
                >
                  <div />
                </ReactPlaceholder>
              </div>
            </div>
          )}
        </div>
        <div className={css(mainFeedStyles.mobileHubListContainer)}>
          {/* <HubsList
            current={this.props.home ? null : this.props.hub}
            overrideStyle={mainFeedStyles.mobileList}
          /> */}
        </div>
      </Fragment>
    );
  };

  render() {
    let mainFeed = this.renderMainFeed();
    return (
      <ContentPage
        mainFeed={mainFeed}
        sidebar={
          <SidebarList
            sidebarItems={this.items}
            renderSidebarEntry={this.renderSidebarEntry}
            sidebarName={"Leaderboard"}
          />
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  sidebarEntry: {
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
  sidebarLink: {
    textDecoration: "none",
    color: "#111",
    width: "100%",
    display: "flex",
    alignItems: "center",
    padding: "8px",
  },
  user: {
    borderBottom: "1px solid #EDEDED",
    padding: 16,
  },
  current: {
    borderColor: "rgb(237, 237, 237)",
    backgroundColor: "#FAFAFA",
    ":hover": {
      borderColor: "rgb(227, 227, 227)",
      backgroundColor: "#EAEAEA",
    },
  },
  leaderboardSection: {
    border: "1px solid #EDEDED",
    background: "#fff",
    position: "relative",
  },
  leaderboardNav: {
    display: "flex",
    width: "100%",
    marginBottom: 16,
  },
  userNav: {
    marginLeft: 60,
  },
  navItem: {
    color: "#241F3A",
    opacity: 0.5,
  },
  rep: {
    marginLeft: "auto",
    paddingRight: 16,

    "@media only screen and (min-width: 1024px)": {
      paddingRight: 100,
    },
  },
  createdAt: {
    color: "#918F9C",
  },
  repClass: {
    "@media only screen and (min-width: 1024px)": {
      paddingRight: 130,
    },
  },
  bullet: {
    padding: "0px 16px",
    fontSize: 20,
  },
  emptyStateContainer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    padding: "20px 0",
  },
});

const mainFeedStyles = StyleSheet.create({
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
    backgroundColor: "#FCFCFC",
    width: "100%",
    alignItems: "flex-start",
  },
  sidebar: {
    width: "18%",
    minHeight: "100vh",
    minWidth: 220,
    position: "relative",
    position: "sticky",
    top: 80,
    backgroundColor: "#FFF",
    "@media only screen and (max-width: 769px)": {
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
  mainFeed: {
    height: "100%",
    width: "82%",
    backgroundColor: "#FCFCFC",
    borderLeft: "1px solid #ededed",
    backgroundColor: "#FFF",
    "@media only screen and (min-width: 900px)": {
      width: "67%",
    },
    "@media only screen and (max-width: 768px)": {
      width: "100%",
    },
  },
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
    textTransform: "capitalize",
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
    justifyContent: "unset",

    "@media only screen and (min-width: 768px)": {
      fontSize: 22,
    },
    "@media only screen and (min-width: 1024px)": {
      fontSize: 30,
    },

    "@media only screen and (max-width: 767px)": {
      flexDirection: "column",
    },
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
    backgroundColor: "#FCFCFC",
    alignItems: "center",
    zIndex: 2,
    top: 80,
    "@media only screen and (min-width: 320px)": {
      display: "flex",
      flexDirection: "column",
    },
    "@media only screen and (min-width: 768px)": {
      flexDirection: "row",
    },
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
  dropdownForm: {
    width: 400,
    fontSize: 30,
    "@media only screen and (max-width: 1343px)": {
      fontSize: 30,
    },
    "@media only screen and (max-width: 1149px)": {
      fontSize: 30,
      width: 400,
    },
    "@media only screen and (min-width: 768px)": {
      fontSize: 22,
      width: 300,
    },
    "@media only screen and (min-width: 1024px)": {
      width: 400,
      fontSize: 30,
    },
    "@media only screen and (max-width: 767px)": {
      width: "100%",
      fontSize: 25,
    },
  },
  dropDownLeft: {
    width: 140,
    margin: 0,
    marginLeft: 16,
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
      width: "100%",
      marginTop: 8,
    },
  },
  dropdownCreatedBy: {
    width: 230,
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
    // marginTop: 16,
    "@media only screen and (max-width: 767px)": {
      width: "100%",
    },
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
    "@media only screen and (max-width: 767px)": {
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap",
    },
  },

  /**
   * INFINITE SCROLL
   */
  infiniteScroll: {
    width: "100%",
    boxSizing: "border-box",
    minHeight: "calc(100vh - 200px)",
    backgroundColor: "#FCFCFC",
    paddingLeft: 70,
    paddingRight: 70,
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
  mobileHubListContainer: {
    display: "none",
    backgroundColor: "#FFF",
    "@media only screen and (max-width: 768px)": {
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
  hubs: state.hubs,
});

export default connect(
  mapStateToProps,
  null
)(Index);
