import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Loader from "~/components/Loader/Loader";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import Login from "~/components/Login/Login";
import { StyleSheet, css } from "aphrodite";
import { breakpoints } from "~/config/themes/screen";
import { MessageActions } from "~/redux/message";
import { useDispatch } from "react-redux";
import FormInput from "~/components/Form/FormInput";
import Button from "~/components/Form/Button";

function Page() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  const changePasswordApi = async () => {

    if (password1.length < 9) {
      dispatch(
        MessageActions.setMessage("Password must be at least 9 characters long")
      );
      dispatch(
        // @ts-ignore
        MessageActions.showMessage({ show: true, error: true })
      );
      return;
    } else if (password1 !== password2) {
      dispatch(MessageActions.setMessage("Passwords do not match"));
      dispatch(
        // @ts-ignore
        MessageActions.showMessage({ show: true, error: true })
      );
      return;
    }


    return fetch(API.RESET_PASSWORD_CHANGE_PASSWORD(), API.POST_CONFIG({
      uid: router.query.uid,
      token: router.query.token,
      new_password1: password1,
      new_password2: password2,
    }))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((data:any) => {
        dispatch(
          MessageActions.setMessage("Password changed successfully")
        );
        dispatch(
          // @ts-ignore
          MessageActions.showMessage({ show: true, error: false })
        );
        setTimeout(() => {
          router.push('/');
        }, 1000)
      })
      .catch((error:any) => {
        let errorMsg;
        try {
          // @ts-ignore
          errorMsg = Object.values(error?.message)[0][0];
        } catch (error) {
          errorMsg = "Unexpected error.";
        }
        dispatch(
          MessageActions.setMessage(errorMsg)
        );
        dispatch(
          // @ts-ignore
          MessageActions.showMessage({ show: true, error: true })
        );        
      })
  };


  return (
    <div className={css(styles.wrapper)}>
      <div className={css(styles.main)}>
        <h3>Set a new password</h3>
        <form
          className={css(styles.passwordContainer)}
          onSubmit={(e) => {
            e.preventDefault();
            changePasswordApi();
          }}
        >
          <FormInput
            placeholder={"Enter new password"}
            containerStyle={styles.inputContainer}
            value={password1}
            type="password"
            onChange={(id, value) => {
              setPassword1(value);
            }}
          />
          <FormInput
            placeholder={"Verify new password"}
            containerStyle={styles.inputContainer}
            value={password2}
            type="password"
            onChange={(id, value) => {
              setPassword2(value);
            }}
          />
          <Button
            onClick={(e) => {
              e.preventDefault();
              changePasswordApi();
            }}
          >
            Update
          </Button>
        </form>      
      </div>    
    </div>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    justifyContent: "center",
    marginTop: 80,
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      marginTop: 50,
    }
  },
  main: {
    borderRadius: "5px",
    width: 460,
    height: 400,
    padding: 25,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    rowGap: "25px",
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      width: "100%",
    }
  },
  passwordContainer: {
    display: "flex",
    flexDirection: "column",
    // alignItems: "center",
    position: "relative",
    rowGap: 15,
    marginTop: 5,
    width: "100%",
  },
  inputContainer: {
    padding: 0,
    margin: 0,
    minHeight: "unset",
    width: "100%",
  },  
});

export default Page;