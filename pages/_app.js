import App from "next/app";
import React from "react";
import withRedux from "next-redux-wrapper";
import { Provider } from "react-redux";
import { configureStore } from "~/redux/configureStore";
import "isomorphic-unfetch";
import { StyleSheet, css } from "aphrodite";
import "../components/Paper/progressbar.css";
import "react-tagsinput/react-tagsinput.css";
import "../components/SearchSuggestion/authorinput.css";
import { KeyUtils } from "slate";

// Components
import Navbar from "~/components/Navbar";
import Base from "./Base";

class MyApp extends App {
  constructor(props) {
    super(props);

    this.state = {
      keyInt: 0,
    };
  }

  render() {
    const { Component, pageProps, store } = this.props;
    const keygen = () => {
      let { keyInt } = this.state;
      let keyString = `${Date.now().toString()}_${keyInt}`;
      this.setState({
        keyInt: keyInt + 1,
      });

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

const styles = StyleSheet.create({
  pageWrapper: {
    width: "100%",
    minHeight: "100vh",
    background: "#fff",
  },
});

export default withRedux(configureStore)(MyApp);
