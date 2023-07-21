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
            const auth = window.localStorage.getItem(RESEARCHHUB_AUTH_TOKEN);
            Word.run(async (context) => {
              /**
               * Insert your Word code here
               */

              context.document.body.insertParagraph("hello", Word.InsertLocation.end);

              await context.sync();
            });

            if (res.ok) {
              Word.run(async (context) => {
                /**
                 * Insert your Word code here
                 */

                context.document.body.insertParagraph(auth, Word.InsertLocation.end);

                await context.sync();
              });

              const json = await res.json();
              setIsLoggedIn(true);
              window.localStorage.setItem(RESEARCHHUB_AUTH_TOKEN, json.key);
            }
          } catch (e) {
            console.log(e);
            await Word.run(async (context) => {
              // Create a proxy object for the document.
              var doc = context.document;

              // Queue a command to get the current selection and then create a proxy range object with the results.
              var range = doc.getSelection();

              // Synchronize the document state by executing the queued commands,
              // and return a promise to indicate task completion.
              await context.sync();

              // Queue a command to insert text at the end of the selection.
              range.insertText(e, Word.InsertLocation.end);

              // Synchronize the document state by executing the queued commands,
              // and return a promise to indicate task completion.
              return context.sync().then(function () {
                console.log("Text added after the selection.");
              });
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
        <h2 className={css(styles.header)}>Welcome to ResearchHub 👋</h2>
        <p>We are an open-science platform that enables discussions, peer-reviews, publications and more.</p>
        <div>
          <Input placeholder="Email" className={css(styles.input)} />
        </div>
        <div style={{ marginTop: 16 }}>
          <DefaultButton className={css(styles.button)}>Continue</DefaultButton>
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
