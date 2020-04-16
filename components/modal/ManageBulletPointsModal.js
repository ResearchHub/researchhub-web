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
import { MessageActions } from "~/redux/message";

// Component
import Button from "../Form/Button";
import DraggableCard from "~/components/Paper/DraggableCard";
import Loader from "~/components/Loader/Loader";
import { Event } from "~/components/GAnalytics/EventTracker";

class ManageBulletPointsModal extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      mobileView: false,
      cards: [],
      pendingSubmission: false,
    };

    this.state = {
      ...this.initialState,
    };
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
  }

  componentDidUpdate(prevProps) {
    if (this.props.bulletsRedux.bullets !== prevProps.bulletsRedux.bullets) {
      this.setState({
        cards: this.props.bulletsRedux.bullets,
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions = () => {
    if (window.innerWidth < 436) {
      this.setState({
        mobileView: true,
      });
    } else {
      this.setState({
        mobileView: false,
      });
    }
  };

  saveReorder = async () => {
    let { bulletActions, bulletsRedux, messageActions } = this.props;
    let paperId = this.props.paperId;
    this.setState({ pendingSubmission: true });
    await bulletActions.reorderBullets({ paperId, bullets: this.state.cards });
    if (!bulletsRedux.pending && bulletsRedux.success) {
      Event(
        "Key Takeaways",
        "Manage Key Takeaways",
        `Key Takeaways Reordered Paper:${paperId}`
      );
      this.setState({
        pendingSubmission: false,
      });
      messageActions.setMessage("Order Saved!");
      messageActions.showMessage({ show: true });
      this.closeModal();
    } else {
      //handle error
    }
  };
  /**
   * closes the modal on button click
   */
  closeModal = () => {
    let { modalActions } = this.props;
    modalActions.openManageBulletPointsModal(false);
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

  renderCards = (cards) => {
    return cards.map((card, index) => {
      return (
        <DraggableCard
          key={card.id}
          index={index}
          id={card.id}
          text={card.plain_text}
          data={card}
          moveCard={this.moveCard}
        />
      );
    });
  };

  render() {
    let { modals } = this.props;
    let { mobileView, pendingSubmission, cards } = this.state;
    return (
      <Modal
        isOpen={modals.openManageBulletPointsModal}
        closeModal={this.closeModal}
        className={css(styles.modal)}
        shouldCloseOnOverlayClick={true}
        style={mobileView ? mobileOverlayStyles : overlayStyles}
      >
        <div className={css(styles.modalContent)}>
          <div className={css(styles.title)}>Selected Key Takeaways</div>
          <div className={css(styles.subtitle)}>
            The selected key takeaways will be displayed on the paper in the
            main points section.
          </div>
          <div className={css(styles.bulletPoints)}>
            <DndProvider backend={Backend}>
              {this.renderCards(cards)}
            </DndProvider>
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
    overflow: "scroll",
    borderRadius: 5,
    "@media only screen and (max-width: 767px)": {
      padding: 25,
    },
    "@media only screen and (max-width: 415px)": {
      padding: "50px 0px 0px 0px",
    },
  },
  bulletPoints: {
    width: "100%",
    marginBottom: 20,
    overflow: "scroll",
  },
  title: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#241F3A",
    fontWeight: 400,
    fontSize: 30,
    flexWrap: "wrap",
    whiteSpace: "pre-wrap",
    marginBottom: 5,
    width: "100%",
    textAlign: "center",
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
  subtitle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#241F3A",
    opacity: 0.6,
    fontWeight: 400,
    fontSize: 18,
    flexWrap: "wrap",
    whiteSpace: "pre-wrap",
    width: "100%",
    textAlign: "center",
    marginBottom: 20,
    "@media only screen and (max-width: 1149px)": {
      fontSize: 18,
    },
    "@media only screen and (max-width: 665px)": {
      fontSize: 16,
    },
    "@media only screen and (max-width: 416px)": {
      fontSize: 16,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 16,
    },
  },
  buttonRow: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 15,
    paddingBottom: 15,
    borderBottom: "1px solid #F0F0F0",
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
      // textDecoration: 'underline'
    },
  },
});

const mapStateToProps = (state) => ({
  modals: state.modals,
  bulletsRedux: state.bullets,
});

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(ModalActions, dispatch),
  bulletActions: bindActionCreators(BulletActions, dispatch),
  messageActions: bindActionCreators(MessageActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageBulletPointsModal);
