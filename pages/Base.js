import React, { Fragment } from "react";

// NPM Modules
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";

// Components
import Navbar from "~/components/Navbar";
import { AuthActions } from "../redux/auth";

class Base extends React.Component {
  componentDidMount = () => {
    let { getUser } = this.props;
    getUser();
  };
  render() {
    const { Component, pageProps, store } = this.props;
    return (
      <Fragment>
        {this.props.authChecked ? (
          <div className={css(styles.pageWrapper)}>
            <Navbar />
            <Component {...pageProps} />
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
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Base);
