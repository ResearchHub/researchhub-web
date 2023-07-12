// @ts-nocheck
import * as React from "react";
import { DefaultButton } from "@fluentui/react";
import Header from "./Header";
import HeroList, { HeroListItem } from "./HeroList";
import Progress from "./Progress";
import { StyleSheet, css } from "aphrodite";
import { Input, Button } from "@fluentui/react-components";
import GoogleLogin from "./GoogleLogin";
import { Authenticator, DefaultEndpoints, Utilities } from "@microsoft/office-js-helpers";
import { POST_CONFIG, RESEARCHHUB_AUTH_TOKEN, generateApiUrl } from "../../../api/api";

/* global Word, require */

export interface AppProps {
  setIsLoggedIn: string;
  authenticator: any;
}

const LoginScreen = ({ setIsLoggedIn, authenticator }) => {
  const click = async () => {
    return Word.run(async (context) => {
      /**
       * Insert your Word code here
       */

      // insert a paragraph at the end of the document.
      const paragraph = context.document.body.insertParagraph("Hello World", Word.InsertLocation.end);

      // change the paragraph color to blue.
      paragraph.font.color = "blue";

      await context.sync();
    });
  };

  const loginWithGoogle = () => {
    setIsLoggedIn();
  };

  function getAuthCode() {
    // for the default Google endpoint
    authenticator
      .authenticate(DefaultEndpoints.Google)
      .then(async function (token) {
        /* Google Token */

        const googleToken = window.localStorage.getItem("@OAuth2Tokens/Google");

        if (googleToken) {
          const { access_token, scope } = JSON.parse(googleToken);

          const params = {
            access_token: access_token,
            prompt: "consent",
            scope: scope,
          };

          try {
            const config = POST_CONFIG({ data: params });
            const url = generateApiUrl("auth/google/login");
            delete config["headers"]["Authorization"];

            const res = await fetch(url, config);
            if (res.ok) {
              const json = await res.json();
              setIsLoggedIn(true);
              window.localStorage.setItem(RESEARCHHUB_AUTH_TOKEN, json.key);
            }
          } catch (e) {
            Word.run(async (context) => {
              /**
               * Insert your Word code here
               */

              // insert a paragraph at the end of the document.
              const paragraph = context.document.body.insertParagraph(
                "ERROR: " + e.toString(),
                Word.InsertLocation.end
              );

              // change the paragraph color to blue.
              paragraph.font.color = "blue";

              await context.sync();
            });
          }
        }
      })
      .catch(Utilities.log);
  }

  return (
    <>
      <p className={css(styles.loginOrSignup)}>Log in or sign up</p>
      <div className={css(styles.container)}>
        {/* <Header logo={require("./../../../assets/logo-filled.png")} title={this.props.title} message="Welcome" /> */}
        <h2 className={css(styles.header)}>Welcome to ResearchHub 👋</h2>
        <p>We are an open-science platform that enables discussions, peer-reviews, publications and more.</p>
        <div>
          <Input placeholder="Email" className={css(styles.input)} />
        </div>
        <div style={{ marginTop: 16 }}>
          <DefaultButton className={css(styles.button)} onClick={click}>
            Continue
          </DefaultButton>
        </div>
        <div
          style={{
            borderTop: `1px solid #ddd`,
            position: "relative",
            marginBottom: 25,
            marginTop: 25,
          }}
        >
          <span
            style={{
              background: "white",
              padding: "5px 15px",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              top: -17,
              fontSize: 14,
            }}
          >
            or
          </span>
        </div>
        <Button
          className={css(styles.googleLoginButton)}
          icon={<i className="fa-brands fa-google"></i>}
          onClick={getAuthCode}
        >
          <span style={{ marginLeft: 16 }}> Continue with Google</span>
        </Button>
      </div>
    </>
  );
};

export default LoginScreen;
const styles = StyleSheet.create({
  container: {
    padding: 32,
    paddingTop: 0,
  },
  header: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 8,
  },
  loginOrSignup: {
    borderBottom: "1px solid #ddd",
    paddingBottom: 16,
    textAlign: "center",
    fontWeight: 600,
  },
  input: {
    border: "1px solid rgb(232, 232, 242)",
    padding: "8px 16px",
    width: "100%",
  },
  button: {
    width: "100%",
    background: "rgb(57, 113, 255)",
    color: "#fff",
    border: "none",
  },
  googleLoginButton: {
    width: "100%",
    padding: "8px 16px",
    border: "1px solid rgb(36, 31, 58) ",
  },
});
