import React from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";

// Component
import Button from "../../components/Form/Button";
import AddHubModal from "../../components/modal/AddHubModal";
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
    window.addEventListener("resize", this.calculateWindowWidth);
    showMessage({ show: true, load: true });
    if (!hubs.fetchedHubs) {
      getCategories().then((payload) => {
        this.setState({ categories: payload.payload.categories });
      });
      getHubs().then((action) => {
        this.setState({ hubsByCategory: action.payload.hubsByCategory });
      });
    } else {
      setTimeout(() => {
        this.setState({
          categories: JSON.parse(JSON.stringify(hubs.categories)),
          hubsByCategory: JSON.parse(JSON.stringify(hubs.hubsByCategory)),
          finishedLoading: true,
        });
        showMessage({ show: false });
      }, 400);
    }
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.calculateWindowWidth);
  }

  componentDidUpdate(prevProps) {
    this.calculateWindowWidth();
    if (prevProps.hubs.hubsByCategory !== this.props.hubs.hubsByCategory) {
      const { showMessage, hubs } = this.props;
      showMessage({ show: true, load: true });
      setTimeout(() => {
        this.setState(
          {
            hubsByCategory: JSON.parse(JSON.stringify(hubs.hubsByCategory)),
            finishedLoading: true,
          },
          () => {
            showMessage({ show: false });
          }
        );
      }, 400);
    }
  }

  openAddHubModal = () => {
    this.props.openAddHubModal(true);
  };

  addNewHubToState = (newHub) => {
    let hubsByCategory = { ...this.state.hubsByCategory };
    let key = newHub.category_id;
    if (hubsByCategory[key]) {
      hubsByCategory[key].push(newHub);
      hubsByCategory[key].sort((a, b) => a.name - b.name);
    } else {
      hubsByCategory[key] = [newHub];
    }
    this.setState({ hubsByCategory });
  };

  calculateWindowWidth = () => {
    if (window.innerWidth < 950 && window.innerWidth > 775) {
      return this.state.width !== 760 && this.setState({ width: 760 });
    }
    if (window.innerWidth <= 775 && window.innerWidth > 421) {
      return this.state.width !== 600 && this.setState({ width: 600 });
    }
    if (window.innerWidth <= 421 && window.innerWidth > 321) {
      return this.state.width !== 360 && this.setState({ width: 360 });
    }
    if (window.innerWidth <= 321) {
      return this.state.width !== 285 && this.setState({ width: 285 });
    } else {
      return this.state.width !== 950 && this.setState({ width: 950 });
    }
  };

  calculateColumnWidth = (i, numOfColumns, size) => {
    let noMargin = (i + 1) % numOfColumns === 0;
    let offset = (30 * numOfColumns - 1) / numOfColumns;
    let width = size / numOfColumns - offset;
    let styles = StyleSheet.create({
      customWidth: {
        width: `${size}px`,
        margin: noMargin ? "0 0 30px 0" : "0 30px 30px 0",
      },
    });

    return styles.customWidth;
  };

  renderColumn = (width) => {
    const { categories } = this.state;

    //const letters = Object.keys(hubsByAlpha).sort();
    let numOfColumns = categories.length;
    if (width === 600) {
      numOfColumns = 2;
    }
    if (width <= 360) {
      numOfColumns = 1;
    }

    return categories.map((category, i) => {
      let categoryID = category.id;
      let categoryName = category.category_name;
      return (
        <div>
          <div
            name={categoryName}
            className={css(styles.label)}
          >{`${categoryName}`}</div>
          <div
            key={`${categoryName}_${i}`}
            className={css(
              styles.list
              //this.calculateColumnWidth(i, numOfColumns, width)
            )}
          >
            {this.renderList(categoryID)}
          </div>
        </div>
      );
    });
  };

  renderList = (key) => {
    const { hubsByCategory } = this.state;

    if (!hubsByCategory[key]) {
      return null;
    } else {
      return hubsByCategory[key].map((hub) => {
        return <HubCard hub={hub} />;
      });
    }
  };

  render() {
    let { finishedLoading, categories } = this.state;

    return (
      <div className={css(styles.content, styles.column)}>
        <div className={css(styles.row, styles.body)}>
          <div className={css(styles.sidebar, styles.column)}>
            <CategoryList
              current={this.props.home ? null : this.props.hub}
              initialHubList={this.props.initialHubList}
              categories={categories}
            />
          </div>
          <div className={css(styles.mainFeed, styles.column)}>
            <AddHubModal addHub={this.addNewHubToState} />
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
                    buttonStyle={styles.button}
                    hideRipples={true}
                  />
                </PermissionNotificationWrapper>
              </div>
              <div
                className={css(styles.body, finishedLoading && styles.reveal)}
              >
                {this.renderColumn(this.state.width)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    background: "#FCFCFC",
    minHeight: "100vh",
    width: "100vw",
  },
  container: {
    backgroundColor: "#FCFCFC",
    width: "91%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    margin: "auto",
    "@media only screen and (max-width: 1000px)": {
      width: 760,
    },
    "@media only screen and (max-width: 775px)": {
      width: 600,
    },
    "@media only screen and (max-width: 421px)": {
      width: "100%",
    },
  },
  titleContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    paddingTop: 40,
    paddingBottom: 40,
    "@media only screen and (max-width: 768px)": {
      justifyContent: "space-between",
      backgroundColor: "#FFF",
      marginBottom: 10,
      zIndex: 2,
      position: "sticky",
      top: 0,
    },
    "@media only screen and (max-width: 421px)": {
      justifyContent: "center",
    },
  },
  slugLink: {
    textDecoration: "none",
    filter: "drop-shadow(0 4px 15px rgba(93, 83, 254, 0.18))",
  },
  title: {
    fontSize: 33,
    fontWeight: 500,
    marginRight: 30,
    color: "#241F3A",
    cursor: "default",
    userSelect: "none",
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
    borderRight: "1px solid #ededed",
    backgroundColor: "#FCFCFC",
    "@media only screen and (max-width: 769px)": {
      display: "none",
    },
  },
  mainFeed: {
    height: "100%",
    width: "82%",
    backgroundColor: "#FCFCFC",
    "@media only screen and (min-width: 900px)": {
      width: "82%",
    },
    "@media only screen and (max-width: 768px)": {
      width: "100%",
    },
  },
  reveal: {
    opacity: 1,
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "left",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 26,
    fontWeight: 500,
    color: "#241F3A",
    paddingBottom: 10,
    marginBottom: 50,
    cursor: "default",
    userSelect: "none",
    borderBottom: "1px solid #ededed",
  },
  list: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "left",
  },
});

const mapStateToProps = (state) => ({
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
