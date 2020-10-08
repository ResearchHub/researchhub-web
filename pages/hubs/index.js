import React from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";

// Component
import Button from "../../components/Form/Button";
import AddHubModal from "../../components/modal/AddHubModal";
import EditHubModal from "../../components/modal/EditHubModal";
import Message from "../../components/Loader/Message";
import PermissionNotificationWrapper from "../../components/PermissionNotificationWrapper";
import Head from "~/components/Head";
import CategoryList from "~/components/Hubs/CategoryList";
import HubCard from "../../components/Hubs/HubCard";

// Config
import colors from "../../config/themes/colors";
import icons from "~/config/themes/icons";

// Redux
import { HubActions } from "~/redux/hub";
import { ModalActions } from "../../redux/modals";
import { MessageActions } from "../../redux/message";
import { finished } from "stream";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      width: null,
      categories: [],
      hubsByCategory: {},
      finishedLoading: false,
    };
    this.state = {
      ...this.initialState,
    };
  }

  componentDidMount = async () => {
    const { getCategories, getHubs, showMessage, hubs } = this.props;
    showMessage({ show: true, load: true });
    if (!hubs.fetchedHubs) {
      getCategories().then((payload) => {
        this.setState({ categories: payload.payload.categories });
      });
      getHubs().then((action) => {
        this.setState({ hubsByCategory: action.payload.hubsByCategory });
      });
    } else {
      this.setState({
        categories: JSON.parse(JSON.stringify(hubs.categories)),
        hubsByCategory: JSON.parse(JSON.stringify(hubs.hubsByCategory)),
        finishedLoading: true,
      });
      showMessage({ show: false });
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.hubs.hubsByCategory !== this.props.hubs.hubsByCategory) {
      const { showMessage, hubs } = this.props;
      showMessage({ show: true, load: true });
      this.setState(
        {
          hubsByCategory: JSON.parse(JSON.stringify(hubs.hubsByCategory)),
          finishedLoading: true,
        },
        () => {
          showMessage({ show: false });
        }
      );
    }
  }

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

  renderCategories = (_width) => {
    const { categories } = this.state;

    return categories.map((category, i) => {
      let categoryID = category.id;
      let categoryName = category.category_name;
      let slug = categoryName.toLowerCase().replace(/\s/g, "-");
      return (
        <React.Fragment key={categoryID}>
          <div
            name={`${slug}`}
            className={css(styles.categoryLabel)}
          >{`${categoryName}`}</div>
          <div key={`${categoryName}_${i}`} className={css(styles.grid)}>
            {this.renderHubs(categoryID)}
          </div>
        </React.Fragment>
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

  render() {
    let { finishedLoading, categories } = this.state;

    return (
      <div className={css(styles.row, styles.body)}>
        <div className={css(styles.sidebar)}>
          <CategoryList
            current={this.props.home ? null : this.props.hub}
            initialHubList={this.props.initialHubList}
            categories={categories}
          />
        </div>
        <div className={css(styles.content)}>
          <AddHubModal addHub={this.addNewHubToState} />
          <EditHubModal editHub={this.editHub} />
          <Message />
          <Head
            title={"Hubs on Researchhub"}
            description={"View all of the communities on Researchhub"}
          />
          <div className={css(styles.container)}>
            <div className={css(styles.titleContainer)}>
              <span className={css(styles.title)}>Hubs</span>
              <PermissionNotificationWrapper
                modalMessage="suggest a hub"
                loginRequired={true}
                onClick={this.openAddHubModal}
              >
                <Button
                  isWhite={true}
                  label={"Suggest a Hub"}
                  hideRipples={true}
                />
              </PermissionNotificationWrapper>
            </div>
            <div
              className={css(
                styles.hubsContainer,
                finishedLoading && styles.reveal
              )}
            >
              {this.renderCategories(this.state.width)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: "#FCFCFC",
    alignItems: "flex-start",
  },
  container: {
    width: "90%",
    margin: "auto",
  },
  titleContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 40,
  },
  hubsContainer: {
    opacity: 0,
    transition: "all ease-in-out 0.3s",
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
    minWidth: 225,
    "@media only screen and (max-width: 769px)": {
      display: "none",
    },
  },
  content: {
    borderLeft: "1px solid #ededed",
    "@media only screen and (min-width: 900px)": {
      width: "90%",
    },
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryLabel: {
    borderBottom: "1px solid #ededed",
    fontSize: 22,
    fontWeight: 500,
    color: "#241F3A",
    paddingBottom: 10,
    marginBottom: 15,
    cursor: "default",
    userSelect: "none",
    paddingTop: 90,
    marginTop: -90,
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "left",
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 40,
    "@media only screen and (max-width: 767px)": {
      justifyContent: "center",
    },
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  user: state.auth.user,
  hubs: state.hubs,
});

const mapDispatchToProps = {
  getCategories: HubActions.getCategories,
  getHubs: HubActions.getHubs,
  openAddHubModal: ModalActions.openAddHubModal,
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);
