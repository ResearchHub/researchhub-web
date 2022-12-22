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
import colors from "~/config/themes/colors";
import { isValidEmail } from "~/config/utils/validation";


type SCREEN = "SELECT_PROVIDER" | "LOGIN_WITH_EMAIL_FORM" | "SIGNUP_FORM" | "VERIFY_EMAIL";

const LoginModal = ({ isOpen, handleClose, setMessage, showMessage, }) => {
  const currentUser = getCurrentUser();
  const dispatch = useDispatch();
  // @ts-ignore
  const auth = useSelector((state) => state.auth)
  const [step, setStep] = useState<SCREEN>("SELECT_PROVIDER");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [miscError, setMiscError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>();

  useEffect(() => {
    if (auth.loginFailed) {
      setMiscError(auth.loginErrorMsg)
    }
  }, [auth]);

  useEffect(() => {
    if (!isOpen) {
      reset();
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
    resetErrors();

    if (isValidEmail(email)) {
      setIsLoading(true);
      return fetch(API.CHECK_ACCOUNT(), API.POST_CONFIG({ email }))
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((data:any) => {

          if (data.exists) {
            if (data.auth === "google") {
              setMiscError("Account already exists. Please login with Google.");
            }
            else if (data.auth === "email") {
              if (data.is_verified) {
                setStep("LOGIN_WITH_EMAIL_FORM");        
              }
              else {
                setMiscError("Account not yet verified. Click on the verification link sent to your email.");
              }
            }
            else {
              setMiscError("Something went wrong. Please try again later.");
            }
          }
          else {
            setStep("SIGNUP_FORM");
          }
        })
        .catch((error) => {
          setMessage("Unexpected error");
          showMessage({ show: true, error: true });
        })
        .finally(() => {
          setIsLoading(false);
        })
    }
    else {
      setEmailError("Enter a valid email")
    }
  };

  const loginApi = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    await dispatch(AuthActions.loginWithEmail({ email, password }))
    setIsLoading(false);
  };

  const resetErrors = () => {
    setMiscError(false);
    setEmailError(false);
    setFirstNameError(false);
    setLastNameError(false);
    setPasswordError(false);
  }

  const reset = () => {
    resetErrors();
    setEmail("");
    setFirstName("");
    setLastName("");
    setPassword("");
    setIsLoading(false);
    setStep("SELECT_PROVIDER");
  }

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
      setIsLoading(true);
      fetch(API.CREATE_ACCOUNT(), API.POST_CONFIG({ email, password1: password, password2: password, first_name: firstName, last_name: lastName }))
        .then(async (response) => {
          const data = await response.json();
          if (response.ok) {
            setStep("VERIFY_EMAIL");
          }
          else {
            const errorMsg = Object.values(data)?.[0]?.[0];
            if (errorMsg) {
              setMiscError(errorMsg);
            }
            else {
              setMiscError("Something went wrong. Please try again later.");
            }
          }
        })
        .catch((error) => {
          setMiscError("Something went wrong. Please try again later.")
        })
        .finally(() => {
          setIsLoading(false);          
        })
    }    
  }

  return (
    <BaseModal
      closeModal={handleClose}
      isOpen={isOpen}
      hideClose={true}
      titleStyle={styles.modalTitleStyleOverride}
      modalContentStyle={styles.modalContentStyle}
      // modalContentStyle={styles.modalContentStyle}
      title={
        <div className={css(styles.titleWrapper, step !== "VERIFY_EMAIL" && styles.titleWrapperWithBorder)}>
          <div style={{  }}>
            {(step == "LOGIN_WITH_EMAIL_FORM" || step == "SIGNUP_FORM")  &&
              <IconButton
                overrideStyle={styles.leftBtn}
                size={20}
                onClick={() => {
                  resetErrors();
                  setStep("SELECT_PROVIDER");
                }}>
                  {icons.chevronLeft}
              </IconButton>
            }
            <IconButton
              overrideStyle={styles.closeBtn}
              size={20}
              onClick={(e) => {
                e.stopPropagation();
                resetErrors();
                handleClose();
              }}>
                {icons.times}
            </IconButton>
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
        <div style={{ margin: "0 20px 10px 20px", background: "rgb(255, 244, 229)", color: "rgb(237, 108, 2)", padding: "10px 20px", borderRadius: "4px", columnGap: "10px", display: "flex", boxSizing: "border-box" }}>
          <div style={{fontSize: 18}}>{icons.exclamationCircle}</div>
          {miscError}
        </div>
      }

      <div style={{ padding: 15, width: "100%", boxSizing: "border-box" }}>
        {step === "SELECT_PROVIDER" ? (
          <div>
            <div style={{ textAlign: "left", marginBottom: 15, }}>
              <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>Welcome to ResearchHub 👋</div>
              <p style={{ fontSize: 16, margin: 0, lineHeight: "1.5em" }}>We are an open-science platform that enables discussions, peer-reviews, publications and more.</p>
            </div>
            <FormInput
              required
              containerStyle={styles.inputContainer}
              // containerStyle={styles.containerStyle}
              // inputStyle={styles.inputStyle}
              placeholder="Email"
              error={emailError}
              getRef={emailRef}
              type="email"
              value={email}
              onKeyDown={(e) => {
                e.keyCode === 13 && checkIfAccountExistsApi(e)
              }}
              onChange={(id, value) => {
                if (value.length > 0) {
                  setEmailError(false);
                }
                setEmail(value);
              }}
            />
            <Button
              customButtonStyle={styles.button}
              hideRipples={true}
              onClick={checkIfAccountExistsApi}
              label={isLoading ? <Loader loading={true} size={16} color={"white"} /> : "Continue"}
            />

            <div style={{ borderTop: `1px solid ${colors.LIGHT_GREY()}`, position: "relative", marginBottom: 25, marginTop: 25, }}>
              <span style={{ background: "white", padding: "5px 15px", position: "absolute", left: "50%", transform: "translateX(-50%)", top: -15, fontSize: 14 }}>or</span>
            </div>

            <GoogleLoginButton
              styles={[
                styles.button,
                styles.googleButton,
              ]}
              customLabelStyle={styles.googleButtonLabel}

              customLabel={`Continue with Google`}
              isLoggedIn={false}
              disabled={false}
            />
          </div>
        ) : step === "LOGIN_WITH_EMAIL_FORM" ? (
          <div>
            <div style={{ textAlign: "left", marginBottom: 15, }}>
              {/* <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>Welcome back.</div> */}
              <p style={{ fontSize: 16, margin: 0, lineHeight: "1.5em" }}>Enter your password to login.</p>
            </div>            
            <FormInput
              required
              error={passwordError}
              containerStyle={styles.inputContainer}
              // containerStyle={styles.containerStyle}
              // inputStyle={styles.inputStyle}
              placeholder="Password"
              type="password"
              onKeyDown={(e) => {
                e.keyCode === 13 && loginApi(e)
              }}
              onChange={(id, value) => {
                console.log('value', value)
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
            <div style={{ textAlign: "left", marginBottom: 15, }}>
              {/* <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>Welcome to ResearchHub 👋</div> */}
              <p style={{ fontSize: 16, margin: 0, lineHeight: "1.5em" }}>Fill in the following to join our platform.</p>
            </div>                  
            <FormInput
              required
              error={firstNameError}
              containerStyle={styles.inputContainer}
              // inputStyle={styles.inputStyle}
              placeholder="First name"
              type="text"
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
              containerStyle={styles.inputContainer}
              // inputStyle={styles.inputStyle}
              placeholder="Last name"
              type="text"
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
              containerStyle={styles.inputContainer}
              // inputStyle={styles.inputStyle}
              placeholder="Password"
              type="password"
              onKeyDown={(e) => {
                e.keyCode === 13 && createAccountApi(e)
              }}
              onChange={(id, value) => {
                if (value.length > 8) {
                  setPasswordError(false);
                }              
                setPassword(value)
              }}
            />
            <Button
              customButtonStyle={styles.button}
              hideRipples={true}
              onClick={createAccountApi}
              label={isLoading ? <Loader loading={true} size={16} color={"white"} /> : "Sign up"}
            />
          </>
        ) : step === "VERIFY_EMAIL" ? (
          <div>
            <div style={{ textAlign: "left", padding: "0 20px", marginBottom: 10, }}>
              <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>Check you email.</div>
              <p style={{ fontSize: 16, margin: 0, lineHeight: "1.5em" }}>An activation link was sent to your email.</p>
            </div>
            <div style={{fontSize: 64, textAlign: "center", marginTop: 25, marginBottom: 25 }}>{icons.mailbox}</div>
            <Button
              customButtonStyle={styles.button}
              hideRipples={true}
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              label={"Close"}
            />            
          </div>
        ) : null}
      </div>


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
  inputContainer: {
    margin: 0,
    marginBottom: 0,
  },
  modalTitleStyleOverride: {
    height: "auto",
  },
  button: {
    width: "100%",
    display: "block",
  },
  googleButton: {
    background: "white",
    border: `1px solid ${colors.BLACK()}`,
    borderRadius: "4px",
    color: colors.BLACK(),
    display: "flex",
    height: "45px",
  },
  googleButtonLabel: {
    color: colors.BLACK(),
  },
  modalContentStyle: {
    padding: 0,
    width: 460,
    display: "block",
  },
  titleWrapper: {
    padding: 15,
    marginBottom: 15,
    justifyContent: "center",
    position: "relative",
    flexDirection: "row",
    display: "flex",
    fontSize: 16,
  },
  titleWrapperWithBorder: {
    borderBottom: `1px solid ${colors.LIGHT_GREY()}`,
  },
  leftBtn: {
    position: "absolute",
    left: 10,
    top: 10,
  },
  closeBtn: {
    position: "absolute",
    right: 10,
    top: 10,
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