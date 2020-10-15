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
import { ModalActions } from "~/redux/modals";
import { BulletActions } from "~/redux/bullets";
import { LimitationsActions } from "~/redux/limitations";
import { MessageActions } from "~/redux/message";

// Component
import Button from "../Form/Button";
import DraggableCard from "~/components/Paper/DraggableCard";
import Loader from "~/components/Loader/Loader";
import BaseModal from "./BaseModal";

// Config
import colors from "~/config/themes/colors";

class ManageFeaturedWorkModal extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      cards: [],
      pendingSubmission: false,
      featured: [],
      activePaperIds: {},
      activeTab: 0,
    };
    this.state = {
      ...this.initialState,
    };

    this.tabs = [
      {
        label: "featured works",
      },
      {
        label: "authored papers",
      },
      {
        label: "projects",
      },
    ];
  }

  componentDidMount() {
    this.setState({
      cards: this.props.cards || [],
    });
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps.cards) !== JSON.stringify(this.props.cards)) {
      return this.setState({ cards: this.props.cards });
    }

    if (
      !prevProps.modals.openManageFeaturedWorkModal &&
      this.props.modals.openManageFeaturedWorkModal
    ) {
      return this.setState({ cards: this.props.cards });
    }
  }

  componentWillUnmount() {}

  /**
   * closes the modal on button click
   */
  closeModal = () => {
    this.setState({ ...this.initialState });
    this.props.modalActions.openManageFeaturedWorkModal(false);
  };

  onEditCallback = (card, index) => {
    let cards = [...this.state.cards];
    cards[index] = card;
    this.setState({ cards });
  };

  saveReorder = async () => {
    this.setState({ pendingSubmission: true });
    //TODO
  };

  updateCards = ({ dragIndex, hoverIndex, dragCard }) => {
    let cards = update(this.state.cards, {
      $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
    });
    this.setState({
      cards,
    });
  };

  moveCard = (dragIndex, hoverIndex) => {
    const dragCard = this.state.cards[dragIndex];
    this.updateCards({ dragIndex, hoverIndex, dragCard });
  };

  setActiveTab = (activeTab) => {
    this.setState({ activeTab });
  };

  handleCardClick = (paperId, index) => {
    let activePaperIds = { ...this.state.activePaperIds };

    if (activePaperIds[paperId]) {
      delete activePaperIds[paperId];
    } else {
      activePaperIds[paperId] = true;
    }

    this.setState({ activePaperIds });
  };

  renderTabs = () => {
    const { activeTab } = this.state;

    return this.tabs.map((tab, i) => {
      return (
        <div
          className={css(styles.tab, i === activeTab && styles.activeTab)}
          onClick={() => this.setActiveTab(i)}
        >
          {tab.label}
        </div>
      );
    });
  };

  renderCards = () => {
    const { activePaperIds, activeTab, cards } = this.state;

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
          onClick={this.handleCardClick}
          featuredWorks={true}
          manage={activeTab === 0}
          active={activePaperIds[card.id]}
        />
      );
    });
  };

  render() {
    let { modals, type } = this.props;
    const { pendingSubmission } = this.state;

    return (
      <Modal
        isOpen={modals.openManageFeaturedWorkModal}
        closeModal={this.closeModal}
        className={css(styles.modal)}
        shouldCloseOnOverlayClick={true}
        style={overlayStyles}
      >
        <div className={css(styles.modalContent)}>
          <div className={css(styles.title)}>Select featured papers</div>
          <div className={css(styles.tabBar)}>{this.renderTabs()}</div>
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
              onClick={this.saveReorder}
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
    zIndex: "11",
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
    maxHeight: "80%",
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
    minHeight: "50vh",
    maxHeight: "60vh",
    "@media only screen and (max-width: 767px)": {
      padding: 25,
    },
    "@media only screen and (max-width: 415px)": {
      padding: "50px 0px 0px 0px",
    },
  },
  cardList: {
    width: "100%",
    padding: 10,
    overflowY: "scroll",
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
    marginBottom: 15,
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
    marginBottom: 10,
  },
  tab: {
    color: colors.BLACK(0.6),
    fontSize: 18,
    textTransform: "capitalize",
    padding: "5px 10px 10px",
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
  activeTab: {
    color: colors.BLUE(),
    borderColor: colors.BLUE(),
  },
});

const mapStateToProps = (state) => ({
  modals: state.modals,
});

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(ModalActions, dispatch),
  bulletActions: bindActionCreators(BulletActions, dispatch),
  messageActions: bindActionCreators(MessageActions, dispatch),
  limitationActions: bindActionCreators(LimitationsActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageFeaturedWorkModal);
