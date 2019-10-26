// NPM Modules
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { StyleSheet, css } from "aphrodite";
import Modal from "react-modal";
import { GoogleLogin, GoogleLogout } from "react-google-login";

// Component
import Button from "../Form/Button";
import FormInput from "../Form/FormInput";

// Redux
import { ModalActions } from "../../redux/modals";
import { AuthActions } from "../../redux/auth";
import { GOOGLE_CLIENT_ID } from "../../config/constants";

class LoginModal extends React.Component {
  constructor(props) {
    super(props);
    let initialState = {};
    this.state = {
      ...initialState,
    };
  }

  componentDidMount() {
    //TODO: do something with user authentication
  }

  /**
   * closes the modal on button click
   */
  closeModal = () => {
    let { openLoginModal } = this.props;
    this.setState({
      ...this.initialState,
    });
    openLoginModal(false);
  };

  responseGoogle = (response) => {
    //TODO: do something after google oauth api responds
    let { googleLogin, getUser } = this.props;
    response["access_token"] = response["accessToken"];
    googleLogin(response).then((_) => {
      getUser().then((_) => {
        this.closeModal();
      });
    });
  };

  render() {
    let { modals, auth } = this.props;
    return (
      <Modal
        isOpen={modals.openLoginModal}
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
            <div className={css(styles.title, styles.text)}>Please, log in</div>
            <div className={css(styles.subtitle, styles.text)}>
              {modals.loginModal.flavorText
                ? modals.loginModal.flavorText
                : "Log in with your Google account"}
            </div>
          </div>
          <GoogleLogin
            clientId={GOOGLE_CLIENT_ID}
            onSuccess={this.responseGoogle}
            onFailure={this.responseGoogle}
            cookiePolicy={"single_host_origin"}
            render={(renderProps) => (
              <Button
                disabled={renderProps.disabled}
                onClick={renderProps.onClick}
                customButtonStyle={styles.button}
                icon={"/static/icons/google.png"}
                customIconStyle={styles.iconStyle}
                label={"Log in with Google"}
              />
            )}
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
});

const mapStateToProps = (state) => ({
  modals: state.modals,
  auth: state.auth,
});

const mapDispatchToProps = {
  openLoginModal: ModalActions.openLoginModal,
  googleLogin: AuthActions.googleLogin,
  getUser: AuthActions.getUser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginModal);
