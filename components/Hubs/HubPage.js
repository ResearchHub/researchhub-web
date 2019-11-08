import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import InfiniteScroll from "react-infinite-scroller";
import moment from "moment";

// Component
import HubsList from "~/components/Hubs/HubsList";
import FormSelect from "~/components/Form/FormSelect";
import PaperEntryCard from "~/components/Hubs/PaperEntryCard";
import Loader from "~/components/Loader/Loader";
import GoogleLoginButton from "~/components/GoogleLoginButton";

// Redux
import { AuthActions } from "~/redux/auth";
import { MessageActions } from "~/redux/message";
import { ModalActions } from "~/redux/modals";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "~/config/themes/colors";
import { PaperActions } from "../../redux/paper";
import { UPVOTE_ENUM, DOWNVOTE_ENUM } from "../../config/constants";
import Button from "../Form/Button";

const filterOptions = [
  {
    value: "newest",
    label: "Newest",
  },
  {
    value: "top_rated",
    label: "Top Rated",
  },
  {
    value: "most_discussed",
    label: "Most Discussed",
  },
];

const scopeOptions = [
  {
    value: "day",
    label: "Today",
  },
  {
    value: "month",
    label: "This Month",
  },
  {
    value: "year",
    label: "This Year",
  },
];

const defaultFilter = filterOptions[1];
const defaultScope = scopeOptions[1];

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

  /**
   * When the paper is upvoted, update our UI to reflect that as well
   * @param { Integer } index -- the index of the paper to upvote
   */
  onUpvote = ({ index }) => {
    let { postUpvote } = this.props;
    let papers = JSON.parse(JSON.stringify([...this.state.papers]));
    let curPaper = papers[index];
    postUpvote(curPaper.id);
    if (curPaper.user_vote) {
      curPaper.score += 2;
    } else {
      curPaper.score += 1;
    }
    curPaper.user_vote = {
      vote_type: UPVOTE_ENUM,
    };
    this.setState({
      papers,
    });
  };

  /**
   * When the paper is downvoted, update our UI to reflect that as well
   * @param { Integer } index -- the index of the paper to downvote
   */
  onDownvote = ({ index }) => {
    let papers = JSON.parse(JSON.stringify([...this.state.papers]));
    let curPaper = papers[index];
    let { postDownvote } = this.props;
    postDownvote(curPaper.id);
    if (curPaper.user_vote) {
      curPaper.score -= 2;
    } else {
      curPaper.score -= 1;
    }
    curPaper.user_vote = {
      vote_type: DOWNVOTE_ENUM,
    };
    this.setState({
      papers,
    });
  };

  updateUserBannerPreference = () => {
    this.props.setUserBannerPreference(false);
  };

  componentDidMount() {
    this.fetchPapers({ hub: this.props.hub });
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
          papers: res.results,
          next: res.next,
          page: this.state.page + 1,
          papersLoading: false,
          doneFetching: true,
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
      API.GET_HUB_PAPERS({
        timePeriod: scope,
        hubId: hubId,
        page: this.state.page + 1,
        ordering: this.state.filterBy.value,
      }),
      API.GET_CONFIG()
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        this.setState({
          papers: [...this.state.papers, ...res.results],
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
    let month = moment()
      .startOf("day")
      .subtract(30, "days");
    let year = moment()
      .startOf("day")
      .subtract(365, "days");

    scope.end = now.unix();

    if (scopeId === "today") {
      scope.start = today.unix();
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

  render() {
    let { auth } = this.props;

    return (
      <div className={css(styles.content, styles.column)}>
        <div
          className={css(
            styles.homeBanner,
            (!auth.showBanner || this.state.mobileView) && styles.hideBanner
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
                : "/static/background/background-home.png"
            }
            className={css(styles.bannerOverlay)}
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
                {this.props.home ? "ResearchHub" : this.props.hub.name}
              </span>
              !
            </div>
            <div className={css(styles.subtext, styles.text)}>
              We're a community seeking to improve prioritization,
              collaboration, reproducability, and funding of scientic research.{" "}
              <span className={css(styles.readMore)}>Read more</span>
            </div>
            <span className={css(styles.googleLogin)}>
              {!auth.isLoggedIn && (
                <GoogleLoginButton
                  googleLogin={this.props.googleLogin}
                  getUser={this.props.getUser}
                />
              )}
            </span>
          </div>
        </div>
        <div className={css(styles.row, styles.body)}>
          <div className={css(styles.sidebar, styles.column)}>
            <HubsList exclude={this.props.home ? null : this.props.hub.name} />
          </div>
          <div className={css(styles.mainFeed, styles.column)}>
            <div className={css(styles.row, styles.topbar)}>
              <div className={css(styles.text, styles.feedTitle)}>
                Top Papers on{" "}
                <span className={css(styles.hubName)}>
                  {this.props.home ? "ResearchHub" : this.props.hub.name}
                </span>
              </div>
              <div className={css(styles.row, styles.inputs)}>
                <FormSelect
                  id={"filterBy"}
                  options={filterOptions}
                  value={this.state.filterBy}
                  containerStyle={styles.dropDown}
                  inputStyle={{ height: "100%", backgroundColor: "#FFF" }}
                  onChange={(id, option) => this.onFilterSelect(option, id)}
                />
                <FormSelect
                  id={"scope"}
                  options={scopeOptions}
                  value={this.state.scope}
                  containerStyle={styles.dropDown}
                  inputStyle={{ height: "100%", backgroundColor: "#FFF" }}
                  onChange={(id, option) => this.onFilterSelect(option, id)}
                />
              </div>
            </div>
            <div className={css(styles.infiniteScroll)}>
              {this.state.doneFetching ? (
                this.state.papers.length > 0 ? (
                  <InfiniteScroll
                    pageStart={this.state.page}
                    loadMore={this.loadMore}
                    hasMore={this.state.next}
                    loader={<Loader key={"hubPageLoader"} loading={true} />}
                  >
                    {this.state.papers.map((paper, i) => (
                      <PaperEntryCard
                        key={`${paper.id}-${i}`}
                        paper={paper}
                        index={i}
                        hubName={this.props.hubName}
                        onUpvote={this.onUpvote}
                        onDownvote={this.onDownvote}
                        mobileView={this.state.mobileView}
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
                      There are no academic Paper uploaded for this page.
                    </div>
                    <div
                      className={css(
                        styles.text,
                        styles.emptyPlaceholderSubtitle
                      )}
                    >
                      Click ‘Upload paper’ button to upload a PDF
                    </div>
                    <Button
                      label={"Upload Paper"}
                      onClick={() => this.props.openUploadPaperModal(true)}
                    />
                  </div>
                )
              ) : (
                <Loader key={"paperPlaceholder"} loading={true} />
              )}
            </div>
            <div className={css(styles.mobileHubListContainer)}>
              <HubsList
                exclude={this.props.home ? null : this.props.hub.name}
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
    zIndex: 3,
    "@media only screen and (max-width: 577px)": {
      height: 300,
      justifyContent: "flex-start",
    },
  },
  centered: {
    height: 120,
  },
  homeBanner: {
    background: "linear-gradient(#684ef5, #4d58f6)",
    width: "100%",
    height: 320,
    position: "relative",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    "@media only screen and (max-width: 577px)": {
      position: "relative",
      alignItems: "unset",
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
    top: 0,
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
    "@media only screen and (max-width: 577px)": {
      marginTop: 18,
    },
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
    color: "#000",
    fontWeight: "400",
    fontSize: 33,
    "@media only screen and (max-width: 1343px)": {
      fontSize: 25,
    },
    "@media only screen and (max-width: 1149px)": {
      fontSize: 20,
    },
    "@media only screen and (max-width: 665px)": {
      fontSize: 25,
      marginBottom: 10,
    },
    "@media only screen and (max-width: 416px)": {
      fontSize: 20,
    },
    "@media only screen and (max-width: 321px)": {
      width: 280,
      textAlign: "center",
    },
  },
  topbar: {
    paddingTop: 30,
    width: "calc(100% - 140px)",
    position: "sticky",
    paddingLeft: 70,
    paddingRight: 70,
    top: 0,
    backgroundColor: "#FCFCFC",
    alignItems: "center",
    zIndex: 2,
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
    width: 248,
    height: 45,
    "@media only screen and (max-width: 1343px)": {
      width: 220,
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
    width: 516,
    "@media only screen and (max-width: 1343px)": {
      width: 460,
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
  },
  mobileHubListContainer: {
    display: "none",
    backgroundColor: "#FFF",
    "@media only screen and (max-width: 768px)": {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      borderTop: "1px solid #EDEDED",
    },
  },
  mobileList: {
    paddingTop: 20,
    width: "unset",
  },
  emptyPlaceholderImage: {
    width: 400,
    objectFit: "contain",
    marginTop: 40,
  },
  emptyPlaceholderText: {
    width: 500,
    textAlign: "center",
    fontSize: 18,
    color: "#241F3A",
    marginTop: 20,
  },
  emptyPlaceholderSubtitle: {
    width: 500,
    textAlign: "center",
    fontSize: 14,
    color: "#4e4c5f",
    marginTop: 10,
    marginBottom: 10,
  },
});

const mapStateToProps = (state) => ({
  modals: state.modals,
  auth: state.auth,
});

const mapDispatchToProps = {
  googleLogin: AuthActions.googleLogin,
  getUser: AuthActions.getUser,
  postUpvote: PaperActions.postUpvote,
  postDownvote: PaperActions.postDownvote,
  setUserBannerPreference: AuthActions.setUserBannerPreference,
  openUploadPaperModal: ModalActions.openUploadPaperModal,
  showMessage: MessageActions.showMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HubPage);
