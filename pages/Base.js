import React, { Fragment } from "react";

// NPM Modules
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";

// Components
import Navbar from "~/components/Navbar";
import { AuthActions } from "../redux/auth";
import Message from "~/components/Loader/Message";
import { HubActions } from "../redux/hub";

class Base extends React.Component {
  componentDidMount = async () => {
    let { getUser, getHubs } = this.props;
    getUser();
    getHubs();
  };

  render() {
    const { Component, pageProps, store } = this.props;
    return (
      <Fragment>
        {this.props.authChecked ? (
          <div className={css(styles.pageWrapper)}>
            <Navbar />
            <Component {...pageProps} />
            <Message />
          </div>
        ) : null}
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

const mapStateToProps = (state) => ({
  authChecked: state.auth.authChecked,
});

const mapDispatchToProps = {
  getUser: AuthActions.getUser,
  getHubs: HubActions.getHubs,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Base);
