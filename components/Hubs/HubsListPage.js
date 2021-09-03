import { Component, Fragment } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import { Waypoint } from "react-waypoint";

// Component
import Button from "~/components/Form/Button";
import Message from "~/components/Loader/Message";
import PermissionNotificationWrapper from "~/components/PermissionNotificationWrapper";
import Head from "~/components/Head";
import CategoryList from "~/components/Hubs/CategoryList";
import CategoryListMobile from "~/components/Hubs/CategoryListMobile";
import HubCard from "~/components/Hubs/HubCard";

// Dynamic modules
import dynamic from "next/dynamic";
const AddHubModal = dynamic(() => import("~/components/Modals/AddHubModal"));
const EditHubModal = dynamic(() => import("~/components/Modals/EditHubModal"));

// Config
import icons from "~/config/themes/icons";
import { breakpoints } from "~/config/themes/screen";

// Redux
import { ModalActions } from "~/redux/modals";
import { MessageActions } from "~/redux/message";

class Index extends Component {
  constructor(props) {
    super(props);
    this.initialState = {
      width: null,
      categories: props.categories,
      hubsByCategory: props.hubsByCategory,
      finishedLoading: true,
      activeCategory: 0,
      clickedTab: false,
      scrollDirection: "down",
    };
    this.state = {
      ...this.initialState,
    };
    this.scrollPos = 0;
  }

  setClickedTab = (clickedTab) => {
    this.setState({ clickedTab });
  };

  setActiveCategory = (activeCategory, onLeave) => {
    const { categories } = this.state;

    if (this.state.activeCategory === 0 && onLeave) {
      return;
    }

    this.setState({ activeCategory });
  };

  openAddHubModal = () => {
    this.props.openAddHubModal(true);
  };

  closeEditHubModal = () => {
    this.setState({ inEditHub: false });
  };

  addNewHubToState = (newHub) => {
    let hubsByCategory = { ...this.state.hubsByCategory };
    let key = newHub.category;
    if (hubsByCategory[key]) {
      hubsByCategory[key].push(newHub);
      hubsByCategory[key].sort((a, b) => a.name - b.name);
    } else {
      hubsByCategory[key] = [newHub];
    }
    this.setState({ hubsByCategory });
  };

  editHub = (editedHub, oldCategory) => {
    const hubsByCategory = { ...this.state.hubsByCategory };
    const hubCategory = editedHub.category;

    hubsByCategory[oldCategory] = hubsByCategory[oldCategory].filter(
      (item) => item.id !== editedHub.id
    );
    if (hubsByCategory[hubCategory]) {
      hubsByCategory[hubCategory].push(editedHub);
    } else {
      hubsByCategory[hubCategory] = [editedHub];
    }
    this.setState({ hubsByCategory });
  };

  renderCategories = () => {
    const { categories, scrollDirection } = this.state;

    return categories.map((category, i) => {
      let categoryID = category.id;
      let categoryName = category.category_name;
      let slug = categoryName.toLowerCase().replace(/\s/g, "-");

      return (
        <Waypoint
          onEnter={() => this.setActiveCategory(i)}
          topOffset={40}
          bottomOffset={"95%"}
          key={categoryID}
        >
          <div key={categoryID}>
            <div
              id={`${i}-category`}
              name={`${slug}`}
              className={css(styles.categoryLabel) + " category"}
              key={categoryID}
            >
              {categoryName === "Trending" ? (
                <span>
                  {categoryName}
                  <span className={css(styles.trendingIcon)}>{icons.fire}</span>
                </span>
              ) : (
                categoryName
              )}
            </div>
            <div key={`${categoryName}_${i}`} className={css(styles.grid)}>
              {categoryName === "Trending"
                ? this.renderTrendingHubs()
                : this.renderHubs(categoryID)}
            </div>
          </div>
        </Waypoint>
      );
    });
  };

  renderHubs = (key) => {
    const { auth, user } = this.props;
    const { hubsByCategory } = this.state;

    if (!hubsByCategory[key]) {
      return null;
    } else {
      hubsByCategory[key].sort(function(a, b) {
        return a.name.localeCompare(b.name);
      });
      let subscribed = user.subscribed ? user.subscribed : [];
      let subscribedHubs = {};
      subscribed.forEach((hub) => {
        subscribedHubs[hub.id] = true;
      });

      return hubsByCategory[key].map((hub) => {
        return <HubCard key={hub.id} hub={hub} />;
      });
    }
  };

  renderAddHubButton = () => {
    if (this.props.auth.isLoggedIn) {
      if (this.props.user.moderator) {
        return (
          <PermissionNotificationWrapper
            modalMessage="suggest a hub"
            loginRequired={true}
            onClick={this.openAddHubModal}
          >
            <Button isWhite={true} label={"Suggest a Hub"} hideRipples={true} />
          </PermissionNotificationWrapper>
        );
      }
    }
    return null;
  };

  renderTrendingHubs = () => {
    const { topHubs } = this.props.hubs;

    return topHubs.map((hub) => <HubCard key={hub.id} hub={hub} />);
  };

  render() {
    const {
      finishedLoading,
      categories,
      activeCategory,
      clickedTab,
    } = this.state;

    return (
      <div className={css(styles.row, styles.body)}>
        <div className={css(styles.sidebar)}>
          <CategoryList
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={this.setActiveCategory}
          />
        </div>
        <div>
          <AddHubModal addHub={this.addNewHubToState} />
          <EditHubModal editHub={this.editHub} />
          <Message />
          <Head
            title={"Hubs on Researchhub"}
            description={"View all of the communities on Researchhub"}
          />
          <div className={css(styles.titleContainer)}>
            <span className={css(styles.title)}>Hubs</span>
            {this.renderAddHubButton()}
          </div>
          <div className={css(styles.stickyComponent)}>
            <CategoryListMobile
              activeCategory={activeCategory}
              categories={categories}
              clickedTab={clickedTab}
              setActiveCategory={this.setActiveCategory}
              setClickedTab={this.setClickedTab}
            />
          </div>
          <div
            className={css(
              styles.hubsContainer,
              finishedLoading && styles.reveal
            )}
          >
            {this.renderCategories()}
          </div>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    display: "flex",
    flexDirection: "row",
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      padding: "0px 0px",
    },
  },
  body: {
    backgroundColor: "#FCFCFC",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  titleContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 30,
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      marginLeft: "3vmin",
      marginRight: "3vmin",
    },
  },
  hubsContainer: {
    opacity: 0,
    transition: "all ease-in-out 0.3s",
    marginBottom: 30,
    [`@media only screen and (min-width: ${breakpoints.xxlarge.int + 1}px)`]: {
      width: "80vw",
      maxWidth: `${breakpoints.large.str}`,
    },
  },
  reveal: {
    opacity: 1,
  },
  title: {
    fontSize: 33,
    fontWeight: 500,
    marginRight: 30,
    color: "#241F3A",
    cursor: "default",
    userSelect: "none",
  },
  sidebar: {
    width: 265,
    minWidth: 255,
    maxWidth: 265,
    width: "18%",
    position: "sticky",
    top: -15,
    minHeight: "100vh",
    marginRight: 30,
    [`@media only screen and (max-width: ${breakpoints.xxlarge.str})`]: {
      display: "none",
    },
  },
  stickyComponent: {
    display: "none",
    height: 0,
    marginTop: 30,
    marginBottom: 30,

    "::before": {
      content: `""`,
      position: "absolute",
      zIndex: 1,
      top: 0,
      left: -10,
      bottom: 0,
      pointerEvents: "none",
      backgroundImage:
        "linear-gradient(to left, rgba(255,255,255,0), white 85%)",
      width: "10%",
    },

    "::after": {
      content: `""`,
      position: "absolute",
      zIndex: 1,
      top: 0,
      right: -10,
      bottom: 0,
      pointerEvents: "none",
      backgroundImage:
        "linear-gradient(to right, rgba(255,255,255,0), white 85%)",
      width: "10%",
    },

    [`@media only screen and (max-width: ${breakpoints.xxlarge.str})`]: {
      top: -2,
      position: "sticky",
      backgroundColor: "#FFF",
      zIndex: 3,
      display: "flex",
      height: "unset",
      width: "95vw",
      boxSizing: "border-box",
      marginTop: 20,
      marginBottom: 0,
    },
  },
  categoryLabel: {
    cursor: "default",
    userSelect: "none",
    borderBottom: "1px solid #ededed",
    fontSize: 22,
    fontWeight: 500,
    color: "#241F3A",
    paddingTop: 20,
    paddingBottom: 10,
    marginTop: 30,
    marginBottom: 30,
    [`@media only screen and (max-width: ${breakpoints.xxlarge.str})`]: {
      paddingTop: 65,
      marginTop: -30,
      marginBottom: 20,
    },
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      marginLeft: "3vmin",
      marginRight: "3vmin",
    },
  },
  grid: {
    justifyContent: "center",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, 360px)",
    gridGap: "30px",
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      gridTemplateColumns: "repeat(auto-fill, 200px)",
      gridGap: "20px",
    },
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      gridTemplateColumns: "repeat(auto-fill, 42.5vmin)",
    },
  },
  trendingIcon: {
    color: "#FF6D00",
    marginLeft: 5,
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  user: state.auth.user,
  hubs: state.hubs,
});

const mapDispatchToProps = {
  openAddHubModal: ModalActions.openAddHubModal,
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);
