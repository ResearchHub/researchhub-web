// NPM Modules
import React from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import Modal from "react-modal";

// Component
import Button from "~/components/Form/Button";
import FormInput from "~/components/Form/FormInput";
import AuthorInput from "~/components/SearchSuggestion/AuthorInput";

// Redux
import { ModalActions } from "~/redux/modals";
import { AuthActions } from "~/redux/auth";
import { MessageActions } from "~/redux/message";

// Config
import colors from "~/config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

class InviteToHubModal extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      setCopySuccessMessage: "",
      emails: [],
      email: "",
      mobileView: false,
    };
    this.state = {
      ...this.initialState,
    };
    this.formInputRef = React.createRef();
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
    let { openInviteToHubModal } = this.props;
    this.setState({
      ...this.initialState,
    });
    this.enableParentScroll();
    openInviteToHubModal(false);
  };

  copyToClipboard = () => {
    this.formInputRef.current.select();
    document.execCommand("copy");
    // e.target.focus(); // TODO: Uncomment if we don't want highlighting
    this.setState({ setCopySuccessMessage: "Copied!" });
  };

  addEmail = (emails) => {
    this.setState({ emails });
  };

  handleEmailInput = (value) => {
    let last_char = value.charAt(value.length - 1);
    if (last_char === " " || last_char === ",") {
      return;
    }
    this.setState({ email: value });
  };

  /**
   * prevents scrolling of parent component when modal is open
   * & renables scrolling of parent component when modal is closed
   */
  disableParentScroll = () => {
    document.body.style.overflow = "hidden";
  };

  enableParentScroll = () => {
    document.body.style.overflow = "scroll";
  };

  sendInvites = () => {
    let { modals, showMessage, setMessage } = this.props;
    let emails = [...this.state.emails];

    if (this.state.email !== "") {
      emails.push(this.state.email);
    }
    showMessage({ show: true, load: true });
    fetch(
      API.INVITE_TO_HUB({ hubId: modals.hubId }),
      API.POST_CONFIG({ emails: emails })
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((resp) => {
        if (resp.email_sent) {
          setMessage("Invites Sent!");
          showMessage({ show: true });
          this.closeModal();
        } else {
          setMessage("Invites Failed to Send!");
          showMessage({ show: true, error: true });
        }
      })
      .catch((err) => {
        if (err.response.status === 429) {
          this.closeModal();
          this.props.openRecaptchaPrompt(true);
        }
      });
  };

  onKeyPress = (e) => {
    let emails = [...this.state.emails];
    if (e.key === " " || e.key === ",") {
      if (!emails.includes(this.state.email)) {
        emails.push(this.state.email);
      }
      this.setState({
        emails: emails,
        email: "",
      });
    }
  };
  render() {
    let { modals, auth } = this.props;
    let { mobileView } = this.state;
    return (
      <Modal
        isOpen={modals.openInviteToHubModal}
        closeModal={this.closeModal}
        className={css(styles.modal)}
        shouldCloseOnOverlayClick={true}
        onRequestClose={this.closeModal}
        style={mobileView ? mobileOverlayStyles : overlayStyles}
        onAfterOpen={this.disableParentScroll}
      >
        <div className={css(styles.modalContent)}>
          <img
            src={"/static/icons/close.png"}
            className={css(styles.closeButton)}
            onClick={this.closeModal}
            alt="Close Button"
          />
          <div className={css(styles.titleContainer)}>
            <div className={css(styles.title, styles.text)}>
              Inviting people to the Hub
            </div>
            <div className={css(styles.subtitle, styles.text)}>
              You can invite people by email, or with a link
            </div>
          </div>
          <div className={css(styles.container)}>
            <AuthorInput
              tags={this.state.emails}
              onChange={this.addEmail}
              onChangeInput={this.handleEmailInput}
              inputValue={this.state.email}
              label={"Inviting via email addresses"}
              placeholder={"Press enter to add email"}
              renderEmail={true}
              labelStyle={styles.labelStyle}
              onKeyPress={this.onKeyPress}
            />
          </div>
          <Button
            label={"Send Invites"}
            customButtonStyle={styles.customButtonStyle}
            onClick={this.sendInvites}
          />
          <FormInput
            getRef={this.formInputRef}
            inlineNodeRight={<CopyLink onClick={this.copyToClipboard} />}
            value={process.browser && window.location.href}
            message={this.state.copySuccessMessage}
            containerStyle={styles.containerStyle}
            inputStyle={styles.inputStyle}
          />
          <span className={css(styles.socialMedia)}>
            <div className={css(styles.sublabel)}>
              Share your link to invite people to the hub
            </div>
          </span>
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
    padding: "50px 50px 50px 50px",
    width: 625,
    overflowY: "scroll",
    overflowX: "hidden",
    "@media only screen and (max-width: 725px)": {
      width: "calc(100% - 100px)",
    },
    "@media only screen and (max-width: 436px)": {
      padding: 0,
      paddingTop: 50,
      width: "100%",
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
    "@media only screen and (max-width: 557px)": {
      fontSize: 24,
    },
    "@media only screen and (max-width: 410px)": {
      fontSize: 22,
    },
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    height: 22,
    width: 484,
    fontWeight: "400",
    color: "#4f4d5f",
    "@media only screen and (max-width: 557px)": {
      fontSize: 14,
      width: 300,
    },
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
    "@media only screen and (max-width: 557px)": {
      width: 170,
      height: 45,
    },
    "@media only screen and (max-width: 410px)": {
      width: 160,
    },
  },
  container: {
    width: 602,
    "@media only screen and (max-width: 725px)": {
      width: 450,
    },
    "@media only screen and (max-width: 557px)": {
      width: 380,
    },
    "@media only screen and (max-width: 410px)": {
      width: 300,
    },
  },
  containerStyle: {
    //marginTop: 40,
    width: 602,
    "@media only screen and (max-width: 725px)": {
      width: 450,
    },
    "@media only screen and (max-width: 557px)": {
      width: 380,
    },
    "@media only screen and (max-width: 410px)": {
      width: 300,
    },
  },
  labelStyle: {
    "@media only screen and (max-width: 557px)": {
      fontSize: 14,
    },
  },
  inputStyle: {
    "@media only screen and (max-width: 557px)": {
      fontSize: 14,
    },
    "@media only screen and (max-width: 410px)": {
      fontSize: 12,
    },
  },
  copyLink: {
    color: colors.BLUE(1),
    ":hover": {
      textDecoration: "underline",
    },
    "@media only screen and (max-width: 557px)": {
      fontSize: 13,
    },
  },
  sublabel: {
    fontSize: 14,
    color: "#706e7f",
    textAlign: "center",
  },
});

const mapStateToProps = (state) => ({
  modals: state.modals,
  auth: state.auth,
});

const mapDispatchToProps = {
  openInviteToHubModal: ModalActions.openInviteToHubModal,
  openRecaptchaPrompt: ModalActions.openRecaptchaPrompt,
  getUser: AuthActions.getUser,
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InviteToHubModal);
