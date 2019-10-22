// NPM Modules
import React from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import Modal from "react-modal";

// Component
import Button from "~/components/Form/Button";
import FormInput from "~/components/Form/FormInput";

// Redux
import { ModalActions } from "~/redux/modals";
import { AuthActions } from "~/redux/auth";

// Config
import colors from "~/config/themes/colors";

class InviteToHubModal extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      setCopySuccessMessage: "",
    };
    this.state = {
      ...this.initialState,
    };
    this.formInputRef = React.createRef();
  }

  /**
   * closes the modal on button click
   */
  closeModal = async () => {
    let { openInviteToHubModal } = this.props;
    await this.setState({
      ...this.initialState,
    });
    openInviteToHubModal(false);
  };

  copyToClipboard = () => {
    this.formInputRef.current.select();
    document.execCommand("copy");
    // e.target.focus(); // TODO: Uncomment if we don't want highlighting
    this.setState({ setCopySuccessMessage: "Copied!" });
  };

  render() {
    let { modals, auth } = this.props;

    return (
      <Modal
        isOpen={modals.openInviteToHubModal}
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
          />
          <div className={css(styles.titleContainer)}>
            <div className={css(styles.title, styles.text)}>
              Inviting people to the Hub
            </div>
            <div className={css(styles.subtitle, styles.text)}>
              You can invite people by email, or with a link
            </div>
          </div>
          <FormInput
            label={"Inviting via email addresses"}
            placeholder={"Enter email addresses"}
          />
          <Button
            label={"Send Invites"}
            customButtonStyle={styles.customButtonStyle}
          />
          <FormInput
            getRef={this.formInputRef}
            inlineNodeRight={<CopyLink onClick={this.copyToClipboard} />}
            value={window.location.href}
            message={this.state.copySuccessMessage}
            containerStyle={styles.containerStyle}
          />
        </div>
      </Modal>
    );
  }
}

const CopyLink = (props) => {
  const { onClick } = props;
  return (
    <a className={css(styles.copyLink)} onClick={onClick}>
      Copy link
    </a>
  );
};

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
  noMargin: {
    marginBottom: 0,
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
    marginBottom: 15,
  },
  iconStyle: {
    height: 33,
    width: 33,
  },
  inputContainer: {
    width: 425,
    marginTop: 0,
    marginBottom: 30,
  },
  input: {
    width: 395,
  },
  customButtonStyle: {
    width: 200,
    height: 55,
  },
  containerStyle: {
    marginTop: 40,
  },
});

const mapStateToProps = (state) => ({
  modals: state.modals,
  auth: state.auth,
});

const mapDispatchToProps = {
  openInviteToHubModal: ModalActions.openInviteToHubModal,
  getUser: AuthActions.getUser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InviteToHubModal);
