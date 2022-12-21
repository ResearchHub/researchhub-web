import { useEffect, useRef, useState } from "react";
import FormInput from "../Form/FormInput";
import GoogleLoginButton from "../GoogleLoginButton";
import BaseModal from "../Modals/BaseModal";
import Button from "../Form/Button";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { MessageActions } from "~/redux/message";
import { AuthActions } from "~/redux/auth";
import { connect, useDispatch, useSelector } from "react-redux";
import icons from "~/config/themes/icons";
import { getCurrentUser } from "~/config/utils/getCurrentUser";
import { StyleSheet, css } from "aphrodite";
import Loader from "~/components/Loader/Loader";
import IconButton from "../Icons/IconButton";


type SCREEN = "SELECT_PROVIDER" | "LOGIN_WITH_EMAIL_FORM" | "SIGNUP_FORM";

const LoginModal = ({ isOpen, handleClose, setMessage, showMessage, }) => {
  const currentUser = getCurrentUser();
  const dispatch = useDispatch();
  // @ts-ignore
  const auth = useSelector((state) => state.auth)
  const [step, setStep] = useState<SCREEN>("SELECT_PROVIDER");
  const [email, setEmail] = useState("contact@notesalong.com");
  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [accountExistsError, setAccountExistsError] = useState(false);
  const [miscError, setMiscError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>();

  useEffect(() => {
    if (auth.loginFailed) {
      setMiscError(auth.loginErrorMsg)
    }
  }, [auth.loginFailed]);

  useEffect(() => {
    if (!isOpen) {
      setStep("SELECT_PROVIDER");
    }
  }, [isOpen])

  // const confirmEmailApi = async (e) => {
  //   e?.preventDefault();

  //   if (email.length > 0) {
  //     fetch(API.SEND_CONFIRM_EMAIL(), API.POST_CONFIG({ key: "655d40e40b8ea13a3fa5897c311a93f0125876e3" }))
  //       .then(Helpers.checkStatus)
  //       .then(Helpers.parseJSON)
  //       .then((res) => {
  //         console.log('res', res)
  //       })
  //       .catch(() => {
  //         setMessage("Unexpected error");
  //         showMessage({ show: true, error: true });
  //       })
  //   }
  // };

  const checkIfAccountExistsApi = async (e) => {
    e?.preventDefault();
    setIsLoading(true);

    if (email.length > 0) {
      return fetch(API.CHECK_ACCOUNT(), API.POST_CONFIG({ email }))
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((data:any) => {
          if (data.exists && data.auth === "email") {
            setStep("LOGIN_WITH_EMAIL_FORM")
          }
          else if (data.exists && data.auth === "google") {
            setMiscError("Account already exists with Google. Login with Google.")
          }
        })
        .catch((error) => {
          console.log(error)
          setMessage("Unexpected error");
          showMessage({ show: true, error: true });
        })
        .finally(() => {
          setIsLoading(false);
        })
    }
  };

  const loginApi = async (e) => {
    e?.preventDefault();

    setIsLoading(true);
    await dispatch(AuthActions.loginWithEmail({ email, password: "meowwoof" }))
    setIsLoading(false);
    // return fetch(API.LOGIN_WITH_EMAIL(), API.POST_CONFIG({ email, password }))
    //   .then(Helpers.checkStatus)
    //   .then(Helpers.parseJSON)
    //   .then((data:any) => {
    //     console.log('data', data)
    //   })
    //   .catch((error) => {
    //     console.log(error)
    //     setMessage("Unexpected error");
    //     showMessage({ show: true, error: true });
    //   })
  };

  const createAccountApi = async(e) => {
    e?.preventDefault();

    let hasErrors = false;
    if (firstName.length === 0) {
      hasErrors = true;
      setFirstNameError("First name cannot be empty");
    }
    if (lastName.length === 0) {
      hasErrors = true;
      setLastNameError("Last name cannot be empty");
    }
    if (password.length < 9) {
      hasErrors = true;
      setPasswordError("Password must be at least 9 characters long");
    }

    if (!hasErrors) {
      fetch(API.CREATE_ACCOUNT(), API.POST_CONFIG({ email, password1: password, password2: password, first_name: firstName, last_name: lastName }))
        .then(async (response) => {
          const data = await response.json();
          if (!response.ok) {
            if (Object.keys(data).includes("email")) {
              setAccountExistsError(Object.values(data)?.[0]?.[0]);
            }
            else {
              setMiscError(Object.values(data)?.[0]?.[0]);
            }
          }
        })
        .catch((error) => {
          setMiscError("Something went wrong.")
          console.log('error', error)
        })
    }    
  }

  return (
    <BaseModal
      closeModal={handleClose}
      isOpen={isOpen}
      hideClose={true}
      modalContentStyle={styles.modalContentStyle}
      // modalContentStyle={styles.modalContentStyle}
      title={
        <div style={{ justifyContent: "center", position: "relative", flexDirection: "row", display: "flex", borderBottom: "1px solid", fontSize: 22}}>
          <div style={{ padding: 12, }}>
            {step !== "SELECT_PROVIDER" &&
              <IconButton overrideStyle={styles.leftBtn} onClick={() => setStep("SELECT_PROVIDER")}>{icons.chevronLeft}</IconButton>
            }
            <IconButton overrideStyle={styles.closeBtn} size={20} onClick={() => handleClose()}>{icons.times}</IconButton>
            {step === "SELECT_PROVIDER"
              ? `Login or sign up`
              : step === "LOGIN_WITH_EMAIL_FORM"
              ? `Login`
              : step === "SIGNUP_FORM"
              ? `Finish sign up`
              : ""
            }
            
          </div>
        </div>
      }
    >

      {miscError &&
        <div style={{ padding: 7, borderRadius: "4px" }}>
          {icons.exclamationCircle}
          {miscError}
        </div>
      }
      {accountExistsError &&
        <div style={{ padding: 7, borderRadius: "4px" }}>
          {icons.exclamationCircle}
          {accountExistsError} <span onClick={() => setStep("SELECT_PROVIDER")}>sign in</span>
        </div>
      }      

      {step === "SELECT_PROVIDER" ? (
        <div>
          <FormInput
            required
            // containerStyle={styles.containerStyle}
            // inputStyle={styles.inputStyle}
            placeholder="Email"
            getRef={emailRef}
            type="email"
            value={email}
            // onKeyDown={handleKeyDown}
            onChange={(id, value) => setEmail(value)}
          />
          <Button
            customButtonStyle={styles.button}
            hideRipples={true}
            onClick={checkIfAccountExistsApi}
            label={isLoading ? <Loader loading={true} size={16} color={"white"} /> : "Continue"}
          />

          <div>Or</div>
          <GoogleLoginButton
            styles={[
              styles.button
            ]}

            // iconStyle={}
            customLabelStyle={[]}
            customLabel={`Login with Google`}
            isLoggedIn={false}
            disabled={false}
          />
        </div>
      ) : step === "LOGIN_WITH_EMAIL_FORM" ? (
        <div>
          <FormInput
            required
            error={passwordError}
            // containerStyle={styles.containerStyle}
            // inputStyle={styles.inputStyle}
            placeholder="Password"
            type="password"
            // onKeyDown={handleKeyDown}
            onChange={(id, value) => {           
              setPassword(value)
            }}
          />
          <Button
            customButtonStyle={styles.button}
            hideRipples={true}
            onClick={loginApi}
            label={isLoading ? <Loader loading={true} size={16} color={"white"} /> : "Login"}
          />
        </div>
      ) : step === "SIGNUP_FORM" ? (
        <>
          <FormInput
            required
            error={firstNameError}
            // containerStyle={styles.containerStyle}
            // inputStyle={styles.inputStyle}
            placeholder="First name"
            type="text"
            // onKeyDown={handleKeyDown}
            onChange={(id, value) => {
              if (value.length > 0) {
                setFirstNameError(false);
              }
              setFirstName(value)
            }}
          />

          <FormInput
            required
            error={lastNameError}
            // containerStyle={styles.containerStyle}
            // inputStyle={styles.inputStyle}
            placeholder="Last name"
            type="text"
            // onKeyDown={handleKeyDown}
            onChange={(id, value) => {
              if (value.length > 0) {
                setLastNameError(false);
              }              
              setLastName(value)
            }}
          />

          <FormInput
            required
            error={passwordError}
            // containerStyle={styles.containerStyle}
            // inputStyle={styles.inputStyle}
            placeholder="Password"
            type="password"
            // onKeyDown={handleKeyDown}
            onChange={(id, value) => {
              if (value.length > 8) {
                setPasswordError(false);
              }              
              setPassword(value)
            }}
          />

          <Button className={css(styles.button)} onClick={confirmEmailApi} label="Continue" />

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

const styles = StyleSheet.create({
  button: {
    width: "100%",
    display: "block",
  },
  modalContentStyle: {
    padding: 0,
    width: 400,
  },
  leftBtn: {
    position: "absolute",
    left: 10,
    top: 6,
  },
  closeBtn: {
    position: "absolute",
    right: 10,
    top: 6,
  }  
});

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