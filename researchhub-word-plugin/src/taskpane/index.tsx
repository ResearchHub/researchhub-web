// @ts-nocheck

import App from "./components/App";
import { AppContainer } from "react-hot-loader";
import { initializeIcons } from "@fluentui/font-icons-mdl2";
import { ThemeProvider } from "@fluentui/react";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Authenticator } from "@microsoft/office-js-helpers";

/* global document, Office, module, require */

initializeIcons();

let isOfficeInitialized = false;

const title = "ResearchHub Add In";

var authenticator = new Authenticator();
const GOOGLE_CLIENT_ID = "192509748493-uuidcme05mco3k32188n8qvih89j46jd.apps.googleusercontent.com";
// register Google endpoint using
authenticator.endpoints.registerGoogleAuth(GOOGLE_CLIENT_ID, {
  redirectUrl: "https://localhost:3000/taskpane.html",
});

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <ThemeProvider>
        <Component title={title} isOfficeInitialized={isOfficeInitialized} authenticator={authenticator} />
      </ThemeProvider>
    </AppContainer>,
    document.getElementById("container")
  );
};

/* Render application after Office initializes */
Office.onReady(() => {
  isOfficeInitialized = true;
  if (OfficeHelpers.Authenticator.isAuthDialog()) {
    return window.location.href;
  }

  render(App);
});

if ((module as any).hot) {
  (module as any).hot.accept("./components/App", () => {
    const NextApp = require("./components/App").default;
    render(NextApp);
  });
}
