import App from "next/app";
import Router from "next/router";
import React from "react";
import withRedux from "next-redux-wrapper";
import { Provider, connect } from "react-redux";
import { configureStore } from "~/redux/configureStore";
import "isomorphic-unfetch";
import "../components/Paper/progressbar.css";
import "react-tagsinput/react-tagsinput.css";
import "../components/SearchSuggestion/authorinput.css";
import { KeyUtils } from "slate";

// Components
import Base from "./Base";
import Head from "~/components/Head";

// Redux
import { MessageActions } from "~/redux/message";

class MyApp extends App {
  constructor(props) {
    super(props);

    Router.events.on("routeChangeStart", () => {
      props.store.dispatch(MessageActions.setMessage(""));
      props.store.dispatch(
        MessageActions.showMessage({ show: true, load: true })
      );
    });
    Router.events.on("routeChangeComplete", () => {
      props.store.dispatch(MessageActions.showMessage({ show: false }));
    });
    Router.events.on("routeChangeError", () => {
      props.store.dispatch(MessageActions.showMessage({ show: false }));
    });
    let oldFetch = fetch;
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
        <Head />
        <Base {...this.props} />
      </Provider>
    );
  }
}

export default withRedux(configureStore)(MyApp);
