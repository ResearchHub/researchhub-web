// NPM Modules
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { StyleSheet, css } from "aphrodite";
import Modal from "react-modal";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import update from "immutability-helper";

// Redux
import { ModalActions } from "../../redux/modals";

// Component
import FormInput from "../Form/FormInput";
import Button from "../Form/Button";
import DraggableCard from "~/components/Paper/DraggableCard";

const FAKE_DATA = [
  { id: 0, plain_text: "This is a bullet point" },
  {
    id: 1,
    plain_text:
      "This is an important point that helps summarize what this is all about!",
  },
  { id: 2, plain_text: "test test test" },
  { id: 3, plain_text: "Check this out!" },
];
class ManageBulletPointsModal extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      mobileView: false,
      cards: FAKE_DATA,
    };

    this.state = {
      ...this.initialState,
    };
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
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

  /**
   * closes the modal on button click
   */
  closeModal = () => {
    let { modalActions } = this.props;
    this.setState({
      ...this.initialState,
    });
    this.enableParentScroll();
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
          moveCard={this.moveCard}
        />
      );
    });
  };

  render() {
    let { modals } = this.props;
    let { mobileView } = this.state;
    return (
      <Modal
        isOpen={modals.openManageBulletPointsModal}
        closeModal={this.closeModal}
        className={css(styles.modal)}
        shouldCloseOnOverlayClick={true}
        style={mobileView ? mobileOverlayStyles : overlayStyles}
        onAfterOpen={this.disableParentScroll}
      >
        <div className={css(styles.modalContent)}>
          <div className={css(styles.title)}>Selected Cliff Notes</div>
          <div className={css(styles.subtitle)}>
            These notes will be visisable in the cliff notes section of the
            paper.
          </div>
          <div className={css(styles.bulletPoints)}>
            <DndProvider backend={Backend}>
              {this.renderCards(this.state.cards)}
            </DndProvider>
          </div>
          <Button label={"Save"} />
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
    "@media only screen and (max-width: 665px)": {
      width: "90%",
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
    "@media only screen and (max-width: 415px)": {
      padding: "50px 0px 0px 0px",
    },
  },
  bulletPoints: {
    width: "100%",
    marginBottom: 20,
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
});

const mapStateToProps = (state) => ({
  modals: state.modals,
  university: state.universities,
});

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(ModalActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageBulletPointsModal);
