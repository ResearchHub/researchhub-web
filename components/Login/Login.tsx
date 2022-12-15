import { useRef, useState } from "react";
import FormInput from "../Form/FormInput";
import GoogleLoginButton from "../GoogleLoginButton";
import BaseModal from "../Modals/BaseModal";
import Button from "../Form/Button";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { MessageActions } from "~/redux/message";
import { AuthActions } from "~/redux/auth";
import { connect } from "react-redux";

type SCREEN = "SELECT" | "EMAIL_INPUT" | "MORE_DETAILS";

const LoginModal = ({ isOpen, handleClose, setMessage, showMessage, }) => {

  const [step, setStep] = useState<SCREEN>("SELECT");
  const [email, setEmail] = useState("");
  const emailRef = useRef<HTMLInputElement>();
``
  const checkIfAccountExists = async (e) => {
    e?.preventDefault();

    if (email.length > 0) {

      fetch(API.CHECK_ACCOUNT(), API.POST_CONFIG({ email }))
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          console.log('res', res)
        })
        .catch(() => {
          setMessage("Unexpected error");
          showMessage({ show: true, error: true });
        })

    }
  };


  return (
    <BaseModal
      closeModal={handleClose}
      isOpen={isOpen}
      // modalStyle={styles.modalStyle}
      // modalContentStyle={styles.modalContentStyle}
      title="Login to ResearchHub"
    >

      {step === "SELECT" ? (
        <div>
          <GoogleLoginButton
            styles={[
            ]}
            // iconStyle={}
            customLabelStyle={[]}
            isLoggedIn={false}
            disabled={false}
          />
          <div onClick={() => setStep("EMAIL_INPUT")}>Login with Email</div>
        </div>
      ) : step === "EMAIL_INPUT" ? (
        <div>
          <FormInput
            required
            // containerStyle={styles.containerStyle}
            // inputStyle={styles.inputStyle}
            placeholder="Email"
            getRef={emailRef}
            type="email"
            // onKeyDown={handleKeyDown}
            onChange={(id, value) => setEmail(value)}
          />
          <Button onClick={checkIfAccountExists} />
        </div>
      ) : step === "MORE_DETAILS" ? (
        <>
        </>
      ) : null}


    </BaseModal>  
  )  
}

const Login = ({ setMessage, showMessage }) => {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div onClick={() => setIsOpen(true)}>
      Login
      <LoginModal
        isOpen={isOpen}
        setMessage={setMessage}
        showMessage={showMessage}
        handleClose={() => setIsOpen(false)}
      />
    </div>
  )
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {
  login: AuthActions.orcidLogin,
  getUser: AuthActions.getUser,
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);