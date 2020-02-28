import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import InfiniteScroll from "react-infinite-scroller";
import moment from "moment";
import ReactPlaceholder from "react-placeholder/lib";
import "react-placeholder/lib/reactPlaceholder.css";
import Link from "next/link";
import ReactTooltip from "react-tooltip";
import Ripples from "react-ripples";

// Component
import HubsList from "~/components/Hubs/HubsList";
import FormSelect from "~/components/Form/FormSelect";
import PaperEntryCard from "~/components/Hubs/PaperEntryCard";
import Loader from "~/components/Loader/Loader";
import GoogleLoginButton from "~/components/GoogleLoginButton";
import Button from "../Form/Button";
import PaperPlaceholder from "../Placeholders/PaperPlaceholder";
import PermissionNotificationWrapper from "~/components/PermissionNotificationWrapper";
import LiveFeed from "./LiveFeed";

// Redux
import { AuthActions } from "~/redux/auth";
import { MessageActions } from "~/redux/message";
import { ModalActions } from "~/redux/modals";
import { HubActions } from "~/redux/hub";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "~/config/themes/colors";
import { PaperActions } from "../../redux/paper";
import { UPVOTE_ENUM, DOWNVOTE_ENUM } from "../../config/constants";

const filterOptions = [
  {
    value: "hot",
    label: "Hot",
  },
  {
    value: "top_rated",
    label: "Top Rated",
  },
  {
    value: "newest",
    label: "Newest",
  },
  {
    value: "most_discussed",
    label: "Most Discussed",
  },
];

const scopeOptions = [
  {
    value: "week",
    label: "This Week",
  },
  {
    value: "month",
    label: "This Month",
  },
  {
    value: "day",
    label: "Today",
  },
  {
    value: "year",
    label: "This Year",
  },
];

const defaultFilter = filterOptions[0];
const defaultScope = scopeOptions[0];

class HubPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      count: 0,
      papers: [],
      filterBy: defaultFilter,
      scope: defaultScope,
      mobileView: false,
      mobileBanner: false,
      papersLoading: false,
      next: null,
      doneFetching: false,
      unsubscribeHover: false,
      subscribeClicked: false,
    };
  }

  updateDimensions = () => {
    if (window.innerWidth < 968) {
      this.setState({
        mobileView: true,
        mobileBanner: window.innerWidth < 580 ? true : false,
      });
    } else {
      this.setState({ mobileView: false, mobileBanner: false });
    }
  };

  updateUserBannerPreference = () => {
    this.props.setUserBannerPreference(false);
  };

  componentDidMount() {
    this.fetchPapers({ hub: this.props.hub });
    this.setState({
      subscribe: this.props.hub ? this.props.hub.user_is_subscribed : null,
    });
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.hub &&
      this.props.hub &&
      prevProps.hub.id !== this.props.hub.id
    ) {
      this.updateDimensions();
      this.fetchPapers({ hub: this.props.hub });
      this.setState({
        subscribe: this.props.hub ? this.props.hub.user_is_subscribed : null,
      });
    }

    if (!prevProps.isLoggedIn && this.props.isLoggedIn) {
      this.fetchPapers({ hub: this.props.hub });
      this.setState({
        subscribe: this.props.hub ? this.props.hub.user_is_subscribed : null,
      });
    }

    if (
      prevState.scope !== this.state.scope ||
      prevState.filterBy !== this.state.filterBy
    ) {
      this.fetchPapers({ hub: this.props.hub });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  fetchPapers = ({ hub }) => {
    let { showMessage } = this.props;
    if (this.state.papersLoading) {
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
      }),
      API.GET_CONFIG()
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        this.setState({
          count: res.count,
          papers: res.results.data,
          next: res.next,
          page: this.state.page + 1,
          papersLoading: false,
          doneFetching: true,
          noResults: res.results.no_results,
        });
      })
      .then(
        setTimeout(() => {
          showMessage({ show: false });
        }, 200)
      );
  };

  loadMore = () => {
    let { showMessage } = this.props;
    let { hub } = this.props;
    let hubId = 0;
    if (hub) {
      hubId = hub.id;
    }

    let scope = this.calculateScope();
    return fetch(
      this.state.next,
      // API.GET_HUB_PAPERS({
      //   timePeriod: scope,
      //   hubId: hubId,
      //   page: this.state.page + 1,
      //   ordering: this.state.filterBy.value,
      // }),
      API.GET_CONFIG()
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        this.setState({
          papers: [...this.state.papers, ...res.results.data],
          next: res.next,
          page: this.state.page + 1,
        });
      })
      .then(
        setTimeout(() => {
          showMessage({ show: false });
        }, 200)
      );
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
    }

    return scope;
  };

  onFilterSelect = (option, type) => {
    let { showMessage } = this.props;
    let param = {};
    param[type] = option;
    showMessage({ show: true, load: true });
    this.setState({
      ...param,
    });
  };

  voteCallback = (index, paper) => {
    let papers = [...this.state.papers];
    papers[index] = paper;
    this.setState({
      papers,
    });
  };

  onMouseEnterSubscribe = () => {
    this.setState({
      unsubscribeHover: true,
    });
  };

  onMouseExitSubscribe = () => {
    this.setState({
      unsubscribeHover: false,
      subscribeClicked: false,
    });
  };

  renderSubscribeButton = () => {
    if (this.state.subscribe) {
      let text = this.state.unsubscribeHover
        ? this.state.subscribeClicked
          ? "Subscribed"
          : "Unsubscribe"
        : "Subscribed";
      let hover = this.state.unsubscribeHover && !this.state.subscribeClicked;
      return (
        <Ripples onClick={this.subscribeToHub}>
          <button
            className={css(
              styles.subscribe,
              styles.subscribed,
              hover && styles.subscribeHover
            )}
            onMouseEnter={this.onMouseEnterSubscribe}
            onMouseLeave={this.onMouseExitSubscribe}
          >
            <span>
              {!this.state.transition ? (
                text
              ) : (
                <Loader
                  key={"subscribeLoader"}
                  loading={true}
                  containerStyle={styles.loader}
                  size={10}
                  color={"#FFF"}
                />
              )}
            </span>
          </button>
        </Ripples>
      );
    } else {
      return (
        <Ripples onClick={this.subscribeToHub}>
          <button className={css(styles.subscribe)}>
            <span>
              {!this.state.transition ? (
                "Subscribe"
              ) : (
                <Loader
                  key={"subscribeLoader"}
                  loading={true}
                  containerStyle={styles.loader}
                  size={10}
                  color={"#FFF"}
                />
              )}
            </span>
          </button>
        </Ripples>
      );
    }
  };

  subscribeToHub = () => {
    let {
      hub,
      topHubs,
      allHubs,
      showMessage,
      setMessage,
      updateHub,
    } = this.props;
    showMessage({ show: false });
    this.setState({ transition: true }, () => {
      let config = API.POST_CONFIG();
      if (this.state.subscribe) {
        return fetch(API.HUB_UNSUBSCRIBE({ hubId: hub.id }), config)
          .then(Helpers.checkStatus)
          .then(Helpers.parseJSON)
          .then((res) => {
            updateHub(allHubs, topHubs, { ...res });
            setMessage("Unsubscribed!");
            showMessage({ show: true });
            this.setState({
              transition: false,
              subscribe: !this.state.subscribe,
              subscribeClicked: false,
            });
          });
      } else {
        return fetch(API.HUB_SUBSCRIBE({ hubId: hub.id }), config)
          .then(Helpers.checkStatus)
          .then(Helpers.parseJSON)
          .then((res) => {
            updateHub(allHubs, topHubs, { ...res });
            setMessage("Subscribed!");
            showMessage({ show: true });
            this.setState({
              transition: false,
              subscribe: !this.state.subscribe,
              subscribeClicked: true,
            });
          });
      }
    });
  };

  render() {
    let { auth } = this.props;

    return (
      <div className={css(styles.content, styles.column)}>
        <div
          className={css(
            styles.homeBanner,
            !auth.showBanner && styles.hideBanner
          )}
        >
          <span
            className={css(styles.closeButton)}
            onClick={this.updateUserBannerPreference}
          >
            <i className="fal fa-times" />
          </span>
          <img
            src={
              this.state.mobileBanner
                ? "/static/background/background-home-mobile.png"
                : "/static/background/background-home.jpg"
            }
            className={css(
              styles.bannerOverlay,
              this.state.mobileView && styles.hideBanner
            )}
          />
          <div
            className={css(
              styles.column,
              styles.titleContainer,
              auth.isLoggedIn && styles.centered
            )}
          >
            <div className={css(styles.header, styles.text)}>
              Welcome to{" "}
              <span className={css(styles.hubName)}>
                {this.props.home ? "ResearchHub" : this.props.hub.name}!
              </span>
            </div>
            <div className={css(styles.subtext, styles.text)}>
              We're a community seeking to improve prioritization,
              collaboration, reproducibility, and funding of scientific
              research.{" "}
              <Link href={"/about"}>
                <a className={css(styles.readMore)}>Read more</a>
              </Link>
            </div>
            <span className={css(styles.googleLogin)}>
              {!auth.isLoggedIn && (
                <GoogleLoginButton
                  styles={styles.googleLoginButton}
                  googleLogin={this.props.googleLogin}
                  getUser={this.props.getUser}
                />
              )}
            </span>
          </div>
        </div>
        <div className={css(styles.row, styles.body)}>
          <div className={css(styles.sidebar, styles.column)}>
            <HubsList current={this.props.home ? null : this.props.hub} />
          </div>
          <div className={css(styles.mainFeed, styles.column)}>
            <div className={css(styles.row, styles.topbar)}>
              <div className={css(styles.text, styles.feedTitle)}>
                Top Papers in{" "}
                <span className={css(styles.hubName)}>
                  {this.props.home ? "ResearchHub" : this.props.hub.name}
                </span>
                <div className={css(styles.subscribeContainer)}>
                  {this.props.hub && this.renderSubscribeButton()}
                </div>
              </div>
              <div className={css(styles.row, styles.inputs)}>
                <FormSelect
                  id={"filterBy"}
                  options={filterOptions}
                  value={this.state.filterBy}
                  containerStyle={styles.dropDown}
                  inputStyle={{
                    fontSize: 14,
                    fontWeight: 500,
                    height: "100%",
                    backgroundColor: "#FFF",
                  }}
                  onChange={(id, option) => this.onFilterSelect(option, id)}
                  isSearchable={false}
                />
                <FormSelect
                  id={"scope"}
                  options={scopeOptions}
                  value={this.state.scope}
                  containerStyle={styles.dropDown}
                  inputStyle={{
                    fontSize: 14,
                    fontWeight: 500,
                    height: "100%",
                    backgroundColor: "#FFF",
                  }}
                  onChange={(id, option) => this.onFilterSelect(option, id)}
                  isSearchable={false}
                />
              </div>
            </div>
            <div className={css(styles.infiniteScroll)}>
              {this.state.doneFetching ? (
                this.state.papers.length > 0 ? (
                  <InfiniteScroll
                    pageStart={this.state.page}
                    loadMore={this.loadMore}
                    hasMore={this.state.next !== null}
                    loader={<Loader key={"hubPageLoader"} loading={true} />}
                  >
                    {this.state.papers.map((paper, i) => (
                      <PaperEntryCard
                        key={`${paper.id}-${i}`}
                        paper={paper}
                        index={i}
                        hubName={this.props.hubName}
                        mobileView={this.state.mobileView}
                        voteCallback={this.voteCallback}
                      />
                    ))}
                  </InfiniteScroll>
                ) : (
                  <div className={css(styles.column)}>
                    <img
                      className={css(styles.emptyPlaceholderImage)}
                      src={"/static/background/homepage-empty-state.png"}
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
                      onClick={() => this.props.openUploadPaperModal(true)}
                      modalMessage="upload a paper"
                      loginRequired={true}
                      permissionKey="CreatePaper"
                    >
                      <Button label={"Upload Paper"} hideRipples={true} />
                    </PermissionNotificationWrapper>
                  </div>
                )
              ) : (
                <div className={css(styles.placeholder)}>
                  <ReactPlaceholder
                    ready={false}
                    showLoadingAnimation
                    customPlaceholder={<PaperPlaceholder color="#efefef" />}
                  />
                  <div className={css(styles.placeholderBottom)}>
                    <ReactPlaceholder
                      ready={false}
                      showLoadingAnimation
                      customPlaceholder={<PaperPlaceholder color="#efefef" />}
                    >
                      <div />
                    </ReactPlaceholder>
                  </div>
                </div>
              )}
            </div>
            <div className={css(styles.mobileHubListContainer)}>
              {this.props.hub && <LiveFeed currentHub={this.props.hub} />}
              <HubsList
                current={this.props.home ? null : this.props.hub}
                overrideStyle={styles.mobileList}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

var styles = StyleSheet.create({
  content: {
    backgroundColor: "#FFF",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  row: {
    display: "flex",
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
    marginLeft: "calc(100% * .08)",
    justifyContent: "space-between",
    height: 200,
    zIndex: 2,
    "@media only screen and (max-width: 767px)": {
      height: "unset",
      justifyContent: "flex-start",
    },
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
  homeBanner: {
    background: "linear-gradient(#684ef5, #4d58f6)",
    width: "100%",
    height: 320,
    position: "relative",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    zIndex: 0,
    "@media only screen and (max-width: 767px)": {
      position: "relative",
      alignItems: "unset",
      height: "unset",
    },
  },
  hideBanner: {
    display: "none",
  },
  closeButton: {
    position: "absolute",
    cursor: "pointer",
    fontSize: 26,
    top: 20,
    right: 50,
    color: "white",
    zIndex: 3,
    "@media only screen and (max-width: 580px)": {
      right: 20,
      top: 15,
      fontSize: 20,
    },
  },
  bannerOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    objectFit: "cover",
    height: "100%",
    width: "100%",
    minWidth: "100%",
    zIndex: 2,
    "@media only screen and (max-width: 577px)": {
      objectFit: "cover",
      position: "absolute",
      height: 180,
      bottom: 0,
      right: 0,
    },
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
    backgroundColor: "#FFF",
    width: "100%",
    alignItems: "flex-start",
  },
  sidebar: {
    width: "20%",
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
    "@media only screen and (max-width: 685px)": {
      fontSize: 15,
      width: "100%",
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
  googleLogin: {
    "@media only screen and (max-width: 767px)": {
      margin: "0 auto",
      marginTop: 0,
      marginTop: 18,
      marginBottom: 18,
    },
  },
  googleLoginButton: {
    border: "1px solid #fff",
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
  /**
   * MAIN FEED STYLES
   */
  mainFeed: {
    height: "100%",
    width: "80%",
    backgroundColor: "#FCFCFC",
    borderLeft: "1px solid #ededed",
    backgroundColor: "#FFF",
    "@media only screen and (max-width: 768px)": {
      width: "100%",
    },
  },
  feedTitle: {
    display: "flex",
    alignItems: "center",
    color: "#000",
    fontWeight: "400",
    fontSize: 33,
    flexWrap: "wrap",
    whiteSpace: "pre-wrap",
    "@media only screen and (max-width: 1343px)": {
      fontSize: 25,
    },
    "@media only screen and (max-width: 1149px)": {
      fontSize: 20,
    },
    "@media only screen and (max-width: 665px)": {
      fontSize: 22,
      fontWeight: 500,
      marginBottom: 10,
    },
    "@media only screen and (max-width: 416px)": {
      fontWeight: 400,
      fontSize: 20,
    },
    "@media only screen and (max-width: 321px)": {
      width: 280,
      textAlign: "center",
    },
  },
  topbar: {
    paddingTop: 30,
    paddingBottom: 20,
    width: "calc(100% - 140px)",
    position: "sticky",
    paddingLeft: 70,
    paddingRight: 70,
    backgroundColor: "#FCFCFC",
    alignItems: "center",
    zIndex: 2,
    top: 80,
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
      width: "calc(100% - 80px)",
    },
  },
  dropDown: {
    width: 150,
    margin: 0,
    "@media only screen and (max-width: 1343px)": {
      // width: 220,
      height: "unset",
    },
    "@media only screen and (max-width: 1149px)": {
      width: 150,
    },
    "@media only screen and (max-width: 895px)": {
      width: 125,
    },
    "@media only screen and (max-width: 665px)": {
      width: "100%",
      height: 45,
      margin: "10px 0px 10px 0px",
    },
    "@media only screen and (max-width: 375px)": {
      width: 345,
    },
    "@media only screen and (max-width: 321px)": {
      width: 300,
    },
  },
  inputs: {
    width: 320,
    "@media only screen and (max-width: 1343px)": {
      // width: 460,
    },
    "@media only screen and (max-width: 1149px)": {
      width: 320,
    },
    "@media only screen and (max-width: 895px)": {
      width: 270,
      // marginBottom: 10,
    },
    "@media only screen and (max-width: 665px)": {
      width: "100%",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
    },
  },
  /**
   * INFINITE SCROLL
   */
  infiniteScroll: {
    width: "calc(100% - 140px)",
    minHeight: "calc(100vh - 200px)",
    backgroundColor: "#FCFCFC",
    paddingLeft: 70,
    paddingRight: 70,
    paddingBottom: 30,
    "@media only screen and (max-width: 577px)": {
      paddingLeft: 40,
      paddingRight: 40,
      width: "calc(100% - 80px)",
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
  subscribe: {
    fontSize: 15,
    width: 124,
    height: 43,
    fontWeight: 400,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    color: colors.BLUE(1),
    border: `1px solid ${colors.BLUE(1)}`,
    borderRadius: 5,
    ":hover": {
      background: colors.BLUE(0.1),
    },
    "@media only screen and (max-width: 768px)": {
      fontSize: 15,
    },
  },
  subscribed: {
    border: `1px solid ${colors.BLUE(1)}`,
    backgroundColor: colors.BLUE(1),
    color: "#FFF",

    ":hover": {
      border: `1px solid ${colors.BLUE(1)}`,
      backgroundColor: colors.BLUE(1),
      color: "#FFF",
    },
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
    marginBottom: 10,
    padding: 20,
    borderBottom: "1px solid",
  },
  relatedResults: {
    textAlign: "center",
    fontSize: 25,
    marginBottom: 10,
  },
  subscribeContainer: {
    display: "flex",
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  subscribeHover: {
    ":hover": {
      backgroundColor: colors.RED(1),
      border: `1px solid ${colors.RED(1)}`,
    },
  },
});

const mapStateToProps = (state) => ({
  modals: state.modals,
  auth: state.auth,
  isLoggedIn: state.auth.isLoggedIn,
  allHubs: state.hubs.hubs,
  topHubs: state.hubs.topHubs,
});

const mapDispatchToProps = {
  googleLogin: AuthActions.googleLogin,
  getUser: AuthActions.getUser,
  setUserBannerPreference: AuthActions.setUserBannerPreference,
  openUploadPaperModal: ModalActions.openUploadPaperModal,
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
  updateHub: HubActions.updateHub,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HubPage);
