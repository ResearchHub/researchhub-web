import App from "next/app";
import React from "react";
import withRedux from "next-redux-wrapper";
import { Provider } from "react-redux";
import { configureStore } from "~/redux/configureStore";
import "isomorphic-unfetch";
import "../components/Paper/progressbar.css";
import "react-tagsinput/react-tagsinput.css";
import "../components/SearchSuggestion/authorinput.css";
import { KeyUtils } from "slate";

// Components
import Base from "./Base";

class MyApp extends App {
  constructor(props) {
    super(props);
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
