import App from "next/app";
import React from "react";
import withReduxStore from "../redux/with-redux-store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

class MyApp extends App {
  render() {
    const { Component, pageProps, reduxStore, persistor } = this.props;
    return (
      <Provider store={reduxStore}>
        <PersistGate persistor={persistor} loading={null}>
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
    );
  }
}
export default withReduxStore(MyApp);
