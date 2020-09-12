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

// Components
import Base from "./Base";
import Head from "~/components/Head";
import "./stylesheets/App.css";

// Redux
import { MessageActions } from "~/redux/message";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: "https://423f7b6ddcea48b9b50f7ba4baa0e750@sentry.io/1817918",
    release: process.env.SENTRY_RELEASE,
    environment:
      process.env.REACT_APP_ENV === "staging" ? "staging" : "production",
  });
}

class MyApp extends App {
  constructor(props) {
    super(props);

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

    Router.events.on("routeChangeComplete", () => {
      // window.scroll({
      //   top: 0,
      //   left: 0,
      //   behavior: "auto",
      // });
      ReactGA.pageview(props.router.asPath);
      props.store.dispatch(MessageActions.showMessage({ show: false }));
    });

    Router.events.on("routeChangeError", () => {
      props.store.dispatch(MessageActions.showMessage({ show: false }));
    });
  }

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
