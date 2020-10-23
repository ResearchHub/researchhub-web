// NPM Modules
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { StyleSheet, css } from "aphrodite";
import Modal from "react-modal";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import update from "immutability-helper";
import Ripples from "react-ripples";

// Redux
import { AuthorActions } from "~/redux/author";
import { ModalActions } from "~/redux/modals";

// Component
import Button from "../Form/Button";
import DraggableCard from "~/components/Paper/DraggableCard";
import Loader from "~/components/Loader/Loader";

// Config
import colors, { cardColors, formColors } from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

class ManageFeaturedWorkModal extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      featured: [],
      authoredPapers: [],
      projects: [],
      searchResults: [],
      search: "",
      searching: false,
      pendingSubmission: false,
      activePaperIds: {},
      activeTab: 0,
    };
    this.state = {
      ...this.initialState,
    };

    this.tabs = [
      {
        label: "featured",
      },
      {
        label: "authored",
      },
      {
        label: "preregs",
      },
      {
        label: "search",
      },
    ];
  }

  componentDidMount() {
    this.updateStateFromProps();
  }

  componentDidUpdate(prevProps) {
    // TODO: update to new props
    if (
      JSON.stringify(prevProps.featured) !== JSON.stringify(this.props.featured)
    ) {
      return this.updateStateFromProps();
    }
    if (
      JSON.stringify(prevProps.authoredPapers) !==
      JSON.stringify(this.props.authoredPapers)
    ) {
      return this.updateStateFromProps();
    }
    if (
      JSON.stringify(prevProps.projects) !== JSON.stringify(this.props.projects)
    ) {
      return this.updateStateFromProps();
    }

    if (
      !prevProps.modals.openManageFeaturedWorkModal &&
      this.props.modals.openManageFeaturedWorkModal
    ) {
      return this.updateStateFromProps();
    }
  }

  updateStateFromProps() {
    let activePaperIds = {};

    (this.props.featured || []).map((paper, i) => {
      activePaperIds[paper.id] = true;
    });

    this.setState({
      featured: this.props.featured || [],
      authoredPapers: this.props.authoredPapers || [],
      projects: this.props.projects || [],
      activePaperIds,
    });
  }
  /**
   * closes the modal on button click
   */
  closeModal = () => {
    this.setState({ ...this.initialState });
    this.props.openManageFeaturedWorkModal(false);
  };

  onEditCallback = (card, index) => {
    let featured = [...this.state.featured];
    featured[index] = card;
    this.setState({ featured });
  };

  save = async () => {
    this.setState({ pendingSubmission: true });

    const payload = {
      ordering: this.state.featured.map((paper, index) => {
        let featuredWork = {
          ordinal: index + 1,
          paper_id: paper.id,
        };
        return featuredWork;
      }),
    };

    fetch(API.FEATURED_PAPERS({}), API.POST_CONFIG(payload))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        // update master state
        let updatedFeaturedWork = res.map((project) => ({
          ...project.paper,
        }));

        this.props.updateAuthorByKey({
          key: "userOverview",
          value: updatedFeaturedWork,
        });
        this.setState({ pendingSubmission: false });
        this.closeModal();
      });
  };

  updateCards = ({ dragIndex, hoverIndex, dragCard }) => {
    let featured = update(this.state.featured, {
      $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
    });
    this.setState({
      featured,
    });
  };

  moveCard = (dragIndex, hoverIndex) => {
    const dragCard = this.state.featured[dragIndex];
    this.updateCards({ dragIndex, hoverIndex, dragCard });
  };

  setActiveTab = (activeTab) => {
    this.setState({ activeTab });
  };

  handleSearchInput = (e) => {
    let search = e.target.value;
    this.setState({ search }, () => {
      this.searchPaper(search);
    });
  };

  searchPaper = (search) => {
    if (!search) {
      return this.setState({ searchResults: [] });
    }
    this.setState({ searching: true }, () => {
      fetch(
        API.FEATURED_PAPERS({ search, authorId: this.props.authorId }),
        API.GET_CONFIG()
      )
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          let searchResults = res.results.map((result) => result.paper);

          this.setState({
            searchResults,
            searching: false,
          });
        });
    });
  };

  updateFeaturedWorks = (paper, index) => {
    const paperId = paper.id;
    let activePaperIds = { ...this.state.activePaperIds };
    let featured = [...this.state.featured];

    if (activePaperIds[paperId]) {
      delete activePaperIds[paperId];
      featured.splice(index, 1);
    } else {
      activePaperIds[paperId] = true;
      featured.push(paper);
    }

    this.setState({ activePaperIds, featured });
  };

  renderTabs = () => {
    const {
      activeTab,
      featured,
      authoredPapers,
      projects,
      searchResults,
    } = this.state;

    return this.tabs.map((tab, i) => {
      let count = 0;

      if (i === 0 && featured) {
        count = featured.length;
      } else if (i === 1 && authoredPapers) {
        count = authoredPapers.length;
      } else if (i === 2 && projects) {
        count = projects.length;
      } else if (i === 3) {
        count = searchResults.length;
      }

      // if (tab.label === "search") {
      //   return this.renderSearch()
      // }

      return (
        <div
          className={css(styles.tab, i === activeTab && styles.activeTab)}
          onClick={() => this.setActiveTab(i)}
        >
          {tab.label}
          <div className={css(styles.tabCount)}>{count}</div>
        </div>
      );
    });
  };

  renderSearchBar = (ref) => {
    const { activeTab, search, searchResults } = this.state;

    if (activeTab === 3) {
      return (
        <div
          className={css(styles.searchContainer, styles.activeSearchContainer)}
        >
          <i className={css(styles.searchIcon) + " far fa-search"} />
          <input
            onChange={this.handleSearchInput}
            className={css(styles.searchInput)}
            value={this.state.search}
            ref={ref}
          />
        </div>
      );
    }
  };

  renderEmptyState = () => {
    const { activeTab, search, searching, searchResults } = this.state;

    function _formatDescriptions() {
      let label;
      if (activeTab === 0) {
        label = "featured work";
      } else if (activeTab === 1) {
        label = "authored papers";
      } else if (activeTab === 2) {
        label = "prereg";
      } else if (activeTab === 3) {
        if (searching) {
          return "Searching...";
        }
        if (search && !searching && !searchResults.length) {
          return "Search returned empty.";
        }

        return "Search papers";
      }

      return `User has not created any ${label}`;
    }

    return (
      <div className={css(styles.emptyContainer)}>
        <div className={css(styles.emptyIcon)}>
          {activeTab === 3 ? icons.fileSearch : icons.file}
        </div>
        <h2 className={css(styles.emptyDescription)}>
          {_formatDescriptions()}
        </h2>
      </div>
    );
  };

  renderCards = () => {
    const {
      featured,
      authoredPapers,
      projects,
      searchResults,
      activePaperIds,
      activeTab,
    } = this.state;

    let cards;

    switch (activeTab) {
      case 0:
        cards = featured ? [...featured] : [];
        break;
      case 1:
        cards = authoredPapers ? [...authoredPapers] : [];
        break;
      case 2:
        cards = projects ? [...projects] : [];
        break;
      case 3:
        cards = searchResults ? [...searchResults] : [];
        break;
      default:
        cards = [];
    }
    if (cards.length) {
      return cards.map((card, index) => {
        return (
          <DraggableCard
            key={card.id}
            index={index}
            id={card.id}
            text={card.plain_text}
            data={card}
            moveCard={this.moveCard}
            onEditCallback={this.onEditCallback}
            onClick={this.updateFeaturedWorks}
            featuredWorks={true}
            manage={activeTab === 0}
            active={activePaperIds[card.id]}
          />
        );
      });
    } else {
      return this.renderEmptyState();
    }
  };

  render() {
    const { modals } = this.props;
    const {
      pendingSubmission,
      search,
      searching,
      searchResults,
      activeTab,
    } = this.state;

    return (
      <Modal
        isOpen={modals.openManageFeaturedWorkModal}
        closeModal={this.closeModal}
        className={css(styles.modal)}
        shouldCloseOnOverlayClick={true}
        onRequestClose={this.closeModal}
        style={overlayStyles}
      >
        <div className={css(styles.modalContent)}>
          <img
            src={"/static/icons/close.png"}
            className={css(styles.closeButton)}
            onClick={this.closeModal}
            draggable={false}
          />
          <div className={css(styles.title)}>Select featured papers</div>
          <div
            className={css(
              styles.tabBar,
              activeTab === 3 && styles.paddingBottom
            )}
          >
            {this.renderTabs()}
          </div>
          {this.renderSearchBar()}
          <div className={css(styles.cardList)}>
            <DndProvider backend={Backend}>{this.renderCards()}</DndProvider>
          </div>
          <div className={css(styles.buttonRow)}>
            <Ripples
              className={css(
                styles.cancelButton,
                pendingSubmission && styles.disabled
              )}
              onClick={pendingSubmission ? null : this.closeModal}
            >
              Cancel
            </Ripples>
            <Button
              label={
                pendingSubmission ? (
                  <Loader loading={true} size={20} color={"#fff"} />
                ) : (
                  "Save"
                )
              }
              size={"small"}
              onClick={this.save}
              disabled={pendingSubmission}
            />
          </div>
        </div>
      </Modal>
    );
  }
}

const overlayStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
    zIndex: "11",
  },
};

const mobileOverlayStyles = {
  overlay: {
    position: "fixed",
    top: 80,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
    zIndex: 11,
    borderRadius: 5,
  },
};

const styles = StyleSheet.create({
  modal: {
    background: "#fff",
    outline: "none",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
    width: "50%",
    maxHeight: "75%",
    "@media only screen and (max-width: 767px)": {
      width: "90%",
      maxHeight: "100%",
    },
    "@media only screen and (max-width: 436px)": {
      width: "100%",
      height: "100%",
      top: 0,
      left: 0,
      transform: "unset",
    },
  },
  modalContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    position: "relative",
    backgroundColor: "#fff",
    padding: 50,
    overflowX: "visible",
    borderRadius: 5,
    maxHeight: "80vh",
    "@media only screen and (max-width: 767px)": {
      padding: 25,
    },
    "@media only screen and (max-width: 415px)": {
      padding: "50px 0px 0px 0px",
    },
  },
  cardList: {
    width: "100%",
    padding: "10px 20px",
    paddingTop: 20,
    overflowY: "scroll",
    position: "relative",
    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.12)",
    background: "#F9F9F9",
    ":before": {
      display: "block",
      content: "",
      position: "absolute",
      width: "100%",
      margin: "0 auto",
      height: 12,
      border: 0,
      boxShadow: "inset 0 12px 12px -12px rgba(0,0,0,0.5)",
    },
    ":after": {
      display: "block",
      content: "",
      position: "absolute",
      width: "100%",
      margin: "0 auto",
      height: 12,
      border: 0,
      bottom: 0,
      boxShadow: "inset 0 -12px 12px -12px rgba(0,0,0,0.5)",
    },
    "@media only screen and (max-width: 415px)": {
      width: "90%",
    },
  },
  title: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#241F3A",
    fontWeight: 500,
    fontSize: 26,
    flexWrap: "wrap",
    whiteSpace: "pre-wrap",
    // marginBottom: 15, // add back when subtitle is added
    marginBottom: 20,
    width: "100%",
    textAlign: "center",
    "@media only screen and (max-width: 1149px)": {
      fontSize: 28,
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
  subtitle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#241F3A",
    opacity: 0.6,
    fontWeight: 400,
    fontSize: 16,
    flexWrap: "wrap",
    whiteSpace: "pre-wrap",
    width: "100%",
    textAlign: "center",
    marginBottom: 20,
    "@media only screen and (max-width: 1149px)": {
      fontSize: 16,
    },
    "@media only screen and (max-width: 665px)": {
      fontSize: 14,
    },
    "@media only screen and (max-width: 416px)": {
      fontSize: 14,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 12,
    },
  },
  buttonRow: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginTop: 15,
  },
  cancelButton: {
    height: 37,
    width: 126,
    minWidth: 126,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    cursor: "pointer",
    borderRadius: 4,
    userSelect: "none",
    ":hover": {
      color: "#3971FF",
    },
  },
  tabBar: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: 30,
    flexWrap: "wrap",
  },
  tab: {
    display: "flex",
    alignItems: "center",
    color: colors.BLACK(0.6),
    fontSize: 14,
    textTransform: "capitalize",
    padding: "5px 10px 8px",
    margin: "0px 5px",
    borderBottom: "3px solid #FFF",
    cursor: "pointer",
    ":hover": {
      color: colors.BLUE(),
      borderColor: colors.BLUE(),
    },
    "@media only screen and (max-width: 767px)": {
      fontSize: 14,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  tabCount: {
    padding: "3px 8px",
    borderRadius: 3,
    fontSize: 14,
    border: "1px solid rgba(36, 31, 58, 0.1)",
    background: "rgba(36, 31, 58, 0.03)",
    color: "#241F3A",
    borderRadius: 3,
    marginLeft: 8,
    "@media only screen and (max-width: 415px)": {
      marginLeft: 5,
      fontSize: 12,
    },
  },
  paddingBottom: {
    marginBottom: 10,
  },
  activeTab: {
    color: colors.BLUE(),
    borderColor: colors.BLUE(),
  },
  emptyContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // border: `1px solid ${cardColors.BORDER}`,
    // background: cardColors.BACKGROUND,
    padding: 20,
    boxSizing: "border-box",
  },
  emptyIcon: {
    fontSize: 50,
    color: colors.BLUE(1),
    // height: 50,
    marginBottom: 10,
  },
  emptyDescription: {
    color: colors.BLACK(1),
    fontSize: 18,
    fontWeight: 500,
    textAlign: "center",
    "@media only screen and (max-width: 415px)": {
      width: 280,
      fontSize: 16,
    },
  },
  closeButton: {
    height: 12,
    width: 12,
    position: "absolute",
    top: 20,
    right: 20,
    cursor: "pointer",
  },
  searchContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    position: "absolute",
    background: "#FFF",
    boxShadow: "0px 8px 20px rgba(0,0,0,0.1)",
    border: `1px solid ${cardColors.BORDER}`,
    borderRadius: 8,
    marginBottom: 10,
    height: 35,
    width: 350,
    boxSizing: "border-box",
    bottom: -50,
    zIndex: 1,
  },
  activeSearchContainer: {
    position: "unset",
    border: `1px solid ${formColors.BORDER}`,
    boxShadow: "unset",
  },
  searchIcon: {
    paddingLeft: 15,
    paddingRight: 10,
    fontSize: 14,
    color: colors.BLACK(0.6),
  },
  searchInput: {
    highlight: "none",
    outline: "none",
    border: "none",
    height: "100%",
    width: "calc(100% - 45px)",
    fontSize: 16,
    boxSizing: "border-box",
  },
});

const mapStateToProps = (state) => ({
  modals: state.modals,
});

const mapDispatchToProps = {
  openManageFeaturedWorkModal: ModalActions.openManageFeaturedWorkModal,
  updateAuthorByKey: AuthorActions.updateAuthorByKey,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageFeaturedWorkModal);
