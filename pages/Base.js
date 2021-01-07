import React, { Fragment } from "react";

// NPM Modules
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import { transitions, positions, Provider as AlertProvider } from "react-alert";

// Components
import Message from "~/components/Loader/Message";
import Navbar from "~/components/Navbar";
import PermissionNotification from "../components/PermissionNotification";
import AlertTemplate from "~/components/Modals/AlertTemplate";
import Footer from "./footer";

class Base extends React.Component {
  render() {
    const { Component, pageProps } = this.props;
    const options = {
      position: positions.MIDDLE,
      transition: transitions.SCALE,
    };

    return (
      <Fragment>
        <Fragment>
          <AlertProvider template={AlertTemplate} {...options}>
            <div className={css(styles.pageWrapper)}>
              <PermissionNotification />
              <Navbar />
              <Component {...pageProps} />
              <Message />
            </div>
            <Footer />
          </AlertProvider>
        </Fragment>
      </Fragment>
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

export default Base;
