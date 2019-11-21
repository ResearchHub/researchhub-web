import React, { Fragment } from "react";

// NPM Modules
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";

// Components
import Message from "~/components/Loader/Message";
import Navbar from "~/components/Navbar";
import PermissionNotification from "../components/PermissionNotification";

import { AuthActions } from "../redux/auth";
import { HubActions } from "../redux/hub";
import { UniversityActions } from "../redux/universities";
import PermissionActions from "../redux/permission";

class Base extends React.Component {
  componentDidMount = async () => {
    const {
      fetchPermissions,
      fetchPermissionsPending,
      getHubs,
      getUser,
      getUniversities,
      getUserBannerPreference,
    } = this.props;

    getUser();
    getHubs();
    getUniversities();
    getUserBannerPreference();
    fetchPermissionsPending();
    await fetchPermissions();
  };

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Fragment>
        {this.props.authChecked ? (
          <div className={css(styles.pageWrapper)}>
            <PermissionNotification />
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
  getUniversities: UniversityActions.getUniversities,
  getUserBannerPreference: AuthActions.getUserBannerPreference,
  fetchPermissions: PermissionActions.fetchPermissions,
  fetchPermissionsPending: PermissionActions.fetchPermissionsPending,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Base);
