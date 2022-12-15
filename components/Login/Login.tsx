import { useState } from "react";
import FormInput from "../Form/FormInput";
import GoogleLoginButton from "../GoogleLoginButton";
import BaseModal from "../Modals/BaseModal";


type SCREEN = "SELECT" | "EMAIL_INPUT" | "MORE_DETAILS";

const LoginModal = ({ isOpen, handleClose }) => {

  const [step, setStep] = useState<SCREEN>("SELECT");

  return (
    <BaseModal
      closeModal={handleClose}
      isOpen={isOpen}
      // modalStyle={styles.modalStyle}
      // modalContentStyle={styles.modalContentStyle}
      title="Login to ResearchHub"
    >

      {step === "SELECT" ? (
        <>
          <GoogleLoginButton
            styles={[
            ]}
            // iconStyle={}
            customLabelStyle={[]}
            isLoggedIn={false}
            disabled={false}
          />
          <div>Login with Email</div>
        </>
      ) : step === "EMAIL_INPUT" ? (
        <>
        </>
      ) : step === "MORE_DETAILS" ? (
        <>
        </>
      ) : null}

      {/* <FormInput
        value={firstName}
        getRef={firstNameInputRef}
        required
        containerStyle={styles.containerStyle}
        inputStyle={styles.inputStyle}
        placeholder="First name (optional)"
        onKeyDown={handleKeyDown}
        onChange={(id, value) => setFirstName(value)}
      />       */}
    </BaseModal>  
  )  
}

const Login = () => {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div onClick={() => setIsOpen(true)}>
      Login
      <LoginModal isOpen={isOpen} handleClose={() => setIsOpen(false)} />
    </div>
  )
}

export default Login;