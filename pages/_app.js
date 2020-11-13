import App from "next/app";
import Router from "next/router";
import React from "react";
import withRedux from "next-redux-wrapper";
import { Provider } from "react-redux";
import { configureStore } from "~/redux/configureStore";
import "isomorphic-unfetch";
import "../components/Paper/progressbar.css";
import "react-tagsinput/react-tagsinput.css";
import "../components/SearchSuggestion/authorinput.css";
import { KeyUtils } from "slate";
import * as Sentry from "@sentry/browser";
import ReactGA from "react-ga";
import { init as initApm } from "@elastic/apm-rum";

// Components
import Base from "./Base";
import Head from "~/components/Head";
import "./stylesheets/App.css";

// Redux
import { MessageActions } from "~/redux/message";

// Config
import { SIFT_BEACON_KEY } from "~/config/constants";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: "https://423f7b6ddcea48b9b50f7ba4baa0e750@sentry.io/1817918",
    release: process.env.SENTRY_RELEASE,
    environment:
      process.env.REACT_APP_ENV === "staging" ? "staging" : "production",
  });
}

const apm = initApm({
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
  serverUrl:
    "https://d11bb2079f694eb996ddcfe6edb848f7.apm.us-west-2.aws.cloud.es.io:443",

  // Set service version (required for sourcemap feature)
  serviceVersion: process.env.SENTRY_RELEASE,
});

class MyApp extends App {
  constructor(props) {
    super(props);

    this.previousPath = props.router.asPath.split("?")[0];

    ReactGA.initialize("UA-106669204-1", {
      testMode: process.env.NODE_ENV !== "production",
    });
    ReactGA.pageview(props.router.asPath);
    Router.events.on("routeChangeStart", () => {
      props.store.dispatch(MessageActions.setMessage(""));
      props.store.dispatch(
        MessageActions.showMessage({ show: true, load: true })
      );
    });

    Router.events.on("routeChangeComplete", (url) => {
      if (this.previousPath !== url.split("?")[0]) {
        window.scroll({
          top: 0,
          left: 0,
          behavior: "auto",
        });
      }
      this.connectSift();
      this.previousPath = props.router.asPath.split("?")[0];
      ReactGA.pageview(props.router.asPath);
      props.store.dispatch(MessageActions.showMessage({ show: false }));
    });

    Router.events.on("routeChangeError", () => {
      props.store.dispatch(MessageActions.showMessage({ show: false }));
    });
  }

  componentDidMount() {
    this.connectSift();
  }

  componentWillUnmount() {
    window.removeEventListener("load", this.loadSift);
  }

  componentDidUpdate(prevProps) {
    let prevAuth = this.getAuthProps(prevProps);
    let currAuth = this.getAuthProps(this.props);
    if (!prevAuth.isLoggedIn && currAuth.isLoggedIn) {
      this.connectSift();
    } else if (prevAuth.isLoggedIn && !currAuth.isLoggedIn) {
      this.disconnectSift();
    }
  }

  getAuthProps = (props) => {
    return props.store.getState().auth;
  };

  connectSift = () => {
    let auth = this.getAuthProps(this.props);
    if (auth.isLoggedIn) {
      let _user_id = auth.user.id || "";
      let _session_id = this.uniqueId();
      let _sift = (window._sift = window._sift || []);
      _sift.push(["_setAccount", SIFT_BEACON_KEY]);
      _sift.push(["_setUserId", _user_id]);
      _sift.push(["_setSessionId", _session_id]);
      _sift.push(["_trackPageview"]);

      if (window.attachEvent) {
        window.attachEvent("onload", this.loadSift);
      } else {
        window.addEventListener("load", this.loadSift, false);
      }

      this.loadSift();
    } else {
      this.disconnectSift();
    }
  };

  disconnectSift = () => {
    let sift = document.getElementById("sift");
    sift && sift.parentNode.removeChild(sift);
  };

  loadSift = () => {
    if (!document.getElementById("sift")) {
      // only attach script if it isn't there
      let script = document.createElement("script");
      script.setAttribute("id", "sift");
      script.src = "https://cdn.sift.com/s.js";
      document.body.appendChild(script);
    }
  };

  uniqueId = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  render() {
    const { store } = this.props;
    let keyInt = 0;

    const keygen = () => {
      let keyString = `${Date.now().toString()}_${keyInt++}`;
      return keyString;
    };

    KeyUtils.setGenerator(keygen);

    return (
      <Provider store={store}>
        <Base {...this.props} />
      </Provider>
    );
  }
}

export default withRedux(configureStore)(MyApp);
