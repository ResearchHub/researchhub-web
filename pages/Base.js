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
import { ModalActions } from "../redux/modals";
import PermissionsActions from "../redux/permissions";

class Base extends React.Component {
  componentDidMount = async () => {
    const {
      fetchPermissions,
      fetchPermissionsPending,
      getHubs,
      getUser
    } = this.props;

    getUser();
    getHubs();
    fetchPermissionsPending();
    await fetchPermissions();
  };

  closePermissionNotification = () => {
    ModalActions.openPermissionNotificationModal(false);
  };

  render() {
    const { Component, pageProps, store } = this.props;
    return (
      <Fragment>
        {this.props.authChecked ? (
          <div className={css(styles.pageWrapper)}>
            <PermissionNotification close={this.closePermissionNotification} />
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
  fetchPermissions: PermissionsActions.fetchPermissions,
  fetchPermissionsPending: PermissionsActions.fetchPermissionsPending,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Base);
