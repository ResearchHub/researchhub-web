import App from "next/app";
import Router, { useRouter } from "next/router";
import withRedux from "next-redux-wrapper";
import { Provider } from "react-redux";
import { configureStore } from "~/redux/configureStore";
import "isomorphic-unfetch";
import ReactGA from "react-ga";
import { init as initApm } from "@elastic/apm-rum";
import { useEffect, useState } from "react";

// Components
import Base from "./Base";

// Stylesheets
import "./stylesheets/App.css";
import "../components/Paper/progressbar.css";
import "react-tagsinput/react-tagsinput.css";
import "../components/SearchSuggestion/authorinput.css";
import "../components/CKEditor/CKEditor.css";

import "../components/Modals/Stylesheets/Dnd.css";
import "react-quill/dist/quill.snow.css";
import "../components/TextEditor/stylesheets/QuillTextEditor.css";
import "../components/Paper/Tabs/stylesheets/ReactPdf.css";
import "~/components/Paper/Tabs/stylesheets/paper.css";
import "~/pages/paper/[paperId]/[paperName]/styles/anchor.css";
import "~/pages/user/stylesheets/toggle.css";
import "react-placeholder/lib/reactPlaceholder.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "katex/dist/katex.min.css";

// Redux
import { MessageActions } from "~/redux/message";

// Config
import { SIFT_BEACON_KEY } from "~/config/constants";

if (process.env.ELASTIC_APM_URL) {
  console.log("INITIALIZED ELASTIC APM");
  initApm({
    // Set required service name (allowed characters: a-z, A-Z, 0-9, -, _, and space)
    serviceName:
      process.env.REACT_APP_ENV === "staging"
        ? "researchhub-staging-web"
        : process.env.NODE_ENV === "production"
        ? "researchhub-production-web"
        : "researchhub-development-web",
    environment:
      process.env.REACT_APP_ENV === "staging"
        ? "staging"
        : process.env.NODE_ENV === "production"
        ? "production"
        : "development",
    // Set custom APM Server URL (default: http://localhost:8200)
    serverUrl: process.env.ELASTIC_APM_URL,

    // Set service version (required for sourcemap feature)
    serviceVersion: process.env.SENTRY_RELEASE,
  });
}

const MyApp = ({ Component, pageProps, store }) => {
  const router = useRouter();

  console.log("----------TEST----------");
  console.log("SENTRY_DSN", process.env.SENTRY_DSN);
  console.log("GA_TRACKING_ID", process.env.GA_TRACKING_ID);
  console.log("ELASTIC_APM_URL", process.env.ELASTIC_APM_URL);
  console.log("GOOGLE_CLIENT_ID", process.env.GOOGLE_CLIENT_ID);
  console.log("ORCID_CLIENT_ID", process.env.ORCID_CLIENT_ID);
  console.log("ORCID_KID", process.env.ORCID_KID);
  console.log("WEB3_INFURA_PROJECT_ID", process.env.WEB3_INFURA_PROJECT_ID);
  console.log("RECAPTCHA_CLIENT_KEY", process.env.RECAPTCHA_CLIENT_KEY);
  console.log("SIFT_BEACON_KEY", process.env.SIFT_BEACON_KEY);

  const [prevPath, setPrevPath] = useState(router.asPath);

  // Scroll to top on page change
  useEffect(() => {
    if (prevPath !== router.pathname) {
      window.scroll({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    }

    setPrevPath(router.pathname);
  }, [router.asPath]);

  useEffect(() => {
    connectSift();
    ReactGA.initialize(process.env.GA_TRACKING_ID, {
      testMode: process.env.NODE_ENV !== "production",
    });

    ReactGA.pageview(router.asPath);
    router.events.on("routeChangeStart", (url) => {
      store.dispatch(MessageActions.setMessage(""));
      store.dispatch(MessageActions.showMessage({ show: true, load: true }));
    });

    router.events.on("routeChangeComplete", (url) => {
      connectSift();
      ReactGA.pageview(router.asPath);
      store.dispatch(MessageActions.showMessage({ show: false }));
    });

    Router.events.on("routeChangeError", () => {
      store.dispatch(MessageActions.showMessage({ show: false }));
    });

    return () => {
      window.removeEventListener("load", loadSift);
    };
  }, []);

  const connectSift = () => {
    let auth = getAuthProps();
    if (auth.isLoggedIn) {
      let _user_id = auth.user.id || "";
      let _session_id = uniqueId();
      let _sift = (window._sift = window._sift || []);
      _sift.push(["_setAccount", SIFT_BEACON_KEY]);
      _sift.push(["_setUserId", _user_id]);
      _sift.push(["_setSessionId", _session_id]);
      _sift.push(["_trackPageview"]);

      if (window.attachEvent) {
        window.attachEvent("onload", loadSift);
      } else {
        window.addEventListener("load", loadSift, false);
      }

      loadSift();
    } else {
      disconnectSift();
    }
  };

  const getAuthProps = () => {
    return store.getState().auth;
  };

  const disconnectSift = () => {
    let sift = document.getElementById("sift");
    sift && sift.parentNode.removeChild(sift);
  };

  const loadSift = () => {
    if (!document.getElementById("sift")) {
      // only attach script if it isn't there
      let script = document.createElement("script");
      script.setAttribute("id", "sift");
      script.src = "https://cdn.sift.com/s.js";
      document.body.appendChild(script);
    }
  };

  const uniqueId = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };

  return (
    <Provider store={store}>
      <Base pageProps={pageProps} Component={Component} />
    </Provider>
  );
};

// FIXME: This approach is only needed while there are pages containg
// getStaticProps or getServerSideProps and also others containing getInitialProps. Once all calls
// to getInitialProps removed, this can be removed safely.
MyApp.getInitialProps = async (appContext) => {
  const staticOrServerSidePropsPaths = [
    "/paper/[paperId]/[paperName]",
    "/hubs",
    "/user/[authorId]/[tabName]",
    "/[orgSlug]/notebook/[noteId]",
    "/[orgSlug]/notebook",
  ];

  if (
    process.browser ||
    !staticOrServerSidePropsPaths.includes(appContext.router.route)
  ) {
    const appProps = await App.getInitialProps(appContext);
    return { ...appProps };
  }
};

export default withRedux(configureStore)(MyApp);
