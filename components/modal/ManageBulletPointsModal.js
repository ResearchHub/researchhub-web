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
    if (prevProps !== this.props) {
      if (this.props.type === "key_takeaway") {
        if (
          JSON.stringify(this.props.bulletsRedux.bullets) !==
            JSON.stringify(this.state.cards) &&
          !this.state.cards.length
        ) {
          this.setState({
            cards: this.props.bulletsRedux.bullets,
          });
        }
      } else if (this.props.type === "limitations") {
        if (
          this.props.limitations.limits !== this.state.cards &&
          !this.state.cards.length
        ) {
          this.setState({
            cards: this.props.limitations.limits,
          });
        }
      } else {
        this.setState({
          cards: [],
        });
      }
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

  onEditCallback = (card, index) => {
    let cards = [...this.state.cards];
    cards[index] = card;
    this.setState({ cards }, () => {
      if (this.props.type === "limitations") {
        this.props.limitationActions.updateStateByKey(
          "limits",
          this.state.cards
        );
      } else if (this.props.type === "key_takeaway") {
        this.props.bulletActions.updateStateByKey("bullets", this.state.cards);
      }
    });
  };

  onRemoveCallback = (index) => {
    let cards = [...this.state.cards];
    cards.splice(index, 1);
    this.setState({ cards }, () => {
      this.props.bulletActions.updateStateByKey("bullets", cards);
    });
  };

  saveReorder = async () => {
    let { bulletActions, messageActions, type, limitationActions } = this.props;
    let paperId = this.props.paperId;
    this.setState({ pendingSubmission: true });
    if (type === "key_takeaway") {
      let newOrder = [...this.state.cards];
      await bulletActions.reorderBullets({
        paperId,
        bullets: newOrder,
      });
      if (!this.props.bulletsRedux.pending && this.props.bulletsRedux.success) {
        this.setState({
          pendingSubmission: false,
        });
        messageActions.setMessage("Order Saved!");
        messageActions.showMessage({ show: true });
        this.closeModal();
      } else {
        if (this.props.bulletsRedux.status === 429) {
          return this.closeModal();
        }
      }
    } else if (type === "limitations") {
      await limitationActions.reorderLimitations({
        paperId,
        limits: [...this.state.cards],
      });
      if (!this.props.limitations.pending && this.props.limitations.success) {
        this.setState({
          pendingSubmission: false,
        });
        messageActions.setMessage("Order Saved!");
        messageActions.showMessage({ show: true });
        this.closeModal();
      } else {
        if (this.props.limitations.status === 429) {
          return this.closeModal();
        }
      }
    }
  };

  /**
   * closes the modal on button click
   */
  closeModal = () => {
    let { modalActions } = this.props;
    this.setState({ ...this.initialState });
    modalActions.openManageBulletPointsModal(false, null);
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
          onEditCallback={this.onEditCallback}
          onRemoveCallback={this.onRemoveCallback}
        />
      );
    });
  };

  render() {
    let { modals, type } = this.props;
    let { mobileView, pendingSubmission, cards } = this.state;
    return (
      <Modal
        isOpen={modals.openManageBulletPointsModal.isOpen}
        closeModal={this.closeModal}
        className={css(styles.modal)}
        shouldCloseOnOverlayClick={true}
        style={mobileView ? mobileOverlayStyles : overlayStyles}
      >
        <div className={css(styles.modalContent)}>
          <div className={css(styles.title)}>{`Manage ${
            type === "key_takeaway" ? "Key Takeaways" : "Limitations"
          }`}</div>
          <div className={css(styles.subtitle)}>
            {`The selected ${
              type === "key_takeaway" ? "key takeaways" : "limitations"
            } will be displayed on the paper in the ${
              type === "key_takeaway" ? "key takeaways" : "limitations"
            } section.`}
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
    fontWeight: 500,
    fontSize: 28,
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
    justifyContent: "flex-end",
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
});

const mapStateToProps = (state) => ({
  modals: state.modals,
  bulletsRedux: state.bullets,
  limitations: state.limitations,
  type: state.modals.openManageBulletPointsModal.type,
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
)(ManageBulletPointsModal);
