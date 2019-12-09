// NPM Modules
import React from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import { GoogleLogin } from "react-google-login";

// Component
import Button from "../Form/Button";
import BaseModal from "./BaseModal";

// Redux
import { AuthActions } from "../../redux/auth";
import { ModalActions } from "../../redux/modals";
import { MessageActions } from "~/redux/message";

import { GOOGLE_CLIENT_ID } from "../../config/constants";

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
    let { openLoginModal } = this.props;
    this.setState({
      ...this.initialState,
    });
    openLoginModal(false);
  };

  responseGoogle = async (response) => {
    //TODO: do something after google oauth api responds
    let { googleLogin, getUser } = this.props;
    response["access_token"] = response["accessToken"];
    await googleLogin(response).then((_) => {
      getUser().then((_) => {
        this.closeModal();
        document.body.style.overflow = "scroll";
      });
    });

    if (this.props.auth.loginFailed) {
      this.props.setMessage("Login failed");
      this.props.showMessage({ show: true, error: true });
    }
  };

  render() {
    let { modals } = this.props;
    return (
      <BaseModal
        isOpen={modals.openLoginModal}
        closeModal={this.closeModal}
        title={"Please, Log In"}
        subtitle={
          modals.loginModal.flavorText
            ? modals.loginModal.flavorText
            : "Log in with your Google account"
        }
        backgroundImage={true}
      >
        <div className={css(styles.titleContainer)}></div>
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
      </BaseModal>
    );
  }
}

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
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginModal);
