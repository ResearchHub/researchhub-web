// NPM Modules
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { StyleSheet, css } from "aphrodite";
import Modal from "react-modal";

// Component
import Button from "../Form/Button";

// Redux
import { ModalActions } from "../../redux/modals";

class LoginModal extends React.Component {
  constructor(props) {
    super(props);
    let initialState = {};
    this.state = {
      ...initialState,
    };
  }

  /**
   * closes the modal on button click
   */
  closeModal = () => {
    let { modalActions } = this.props;
    this.setState({
      ...this.initialState,
    });
    modalActions.openLoginModal(false);
  };

  render() {
    let { modals } = this.props;
    return (
      <Modal
        isOpen={this.props.isOpen}
        closeModal={this.closeModal}
        className={css(styles.modal)}
        style={overlayStyles}
      >
        <div className={css(styles.modalContent)}>
          <img
            src={"/static/icons/close.png"}
            className={css(styles.closeButton)}
            onClick={this.closeModal}
          />
          <div className={css(styles.titleContainer)}>
            <div className={css(styles.title, styles.text)}>Please, log in</div>
            <div className={css(styles.subtitle, styles.text)}>
              Log in with your Google account to leave a comment
            </div>
          </div>
          <Button
            customButtonStyle={styles.button}
            icon={"/static/icons/google.png"}
            customIconStyle={styles.iconStyle}
            label={"Log in with Google"}
          />
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
  },
  modalContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    position: "relative",
    backgroundColor: "#fff",
    padding: "50px 0px 50px 0px",
    width: 625,
    overflowY: "scroll",
  },
  closeButton: {
    height: 12,
    width: 12,
    position: "absolute",
    top: 20,
    right: 20,
    cursor: "pointer",
  },
  titleContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
    marginBottom: 30,
  },
  title: {
    fontWeight: "500",
    height: 30,
    width: 426,
    fontSize: 26,
    color: "#232038",
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    height: 22,
    width: 484,
    fontWeight: "400",
    color: "#4f4d5f",
  },
  text: {
    fontFamily: "Roboto",
  },
  button: {
    height: 55,
    width: 230,
  },
  iconStyle: {
    height: 33,
    width: 33,
  },
});

const mapStateToProps = (state) => ({
  modals: state.modals,
});

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(ModalActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginModal);
