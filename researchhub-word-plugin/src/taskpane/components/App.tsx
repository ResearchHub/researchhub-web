import * as React from "react";
import Progress from "./Progress";
import LoginScreen from "./LoginScreen";
import { RESEARCHHUB_AUTH_TOKEN } from "../../../api/api";
import CitationScreen from "./CitationScreen";
import { OrganizationContextProvider } from "../Contexts/OrganizationContext";
// import GoogleIcon from "~/assets/google.png";
/* global Word, require */

export interface AppProps {
  title: string;
  authenticator: any;
  isOfficeInitialized: boolean;
}

export interface AppState {}

const App = ({ authenticator }) => {
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
  const [whichScreen, setWhichScreen] = React.useState<string>("citation-screen");

  React.useEffect(() => {
    const auth = window.localStorage.getItem(RESEARCHHUB_AUTH_TOKEN);
    Word.run(async (context) => {
      /**
       * Insert your Word code here
       */

      context.document.body.insertParagraph("hello", Word.InsertLocation.end);

      await context.sync();
    });

    if (window.localStorage.getItem(RESEARCHHUB_AUTH_TOKEN)) {
      setIsLoggedIn(true);
    }
  }, []);

  // React.useEffect(() => {
  //   if (window.location.href.includes("access_token")) {

  //   }
  // }, [])

  // if (window.location.href.includes("access_token")) {
  //   return <div></div>;
  // }

  return (
    <OrganizationContextProvider isLoggedIn={isLoggedIn}>
      <div>
        {isLoggedIn ? (
          <div>{whichScreen === "citation-screen" ? <CitationScreen /> : <div></div>}</div>
        ) : (
          <LoginScreen setIsLoggedIn={setIsLoggedIn} authenticator={authenticator} />
        )}
      </div>
    </OrganizationContextProvider>
  );
};

export default App;
