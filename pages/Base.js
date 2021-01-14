import React from "react";

// NPM Modules
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import { transitions, positions, Provider as AlertProvider } from "react-alert";

// Components
import Message from "~/components/Loader/Message";
import Navbar from "~/components/Navbar";
import PermissionNotification from "../components/PermissionNotification";
import AlertTemplate from "~/components/Modals/AlertTemplate";

import { AuthActions } from "../redux/auth";
import { HubActions } from "../redux/hub";
import { UniversityActions } from "../redux/universities";
import { TransactionActions } from "../redux/transaction";
import { NotificationActions } from "~/redux/notification";
import PermissionActions from "../redux/permission";
import Footer from "./footer";

class Base extends React.Component {
  componentDidMount = async () => {
    const {
      fetchPermissions,
      getUser,
      getUniversities,
      getWithdrawals,
      getTopHubs,
      getNotifications,
      auth,
    } = this.props;

    getUniversities();
    await getUser();
    getTopHubs(auth);
    if (auth.isLoggedIn) {
      getWithdrawals();
      getNotifications();
    }
    fetchPermissions();
  };

  render() {
    const { Component, pageProps } = this.props;
    const options = {
      position: positions.MIDDLE,
      transition: transitions.SCALE,
    };

    return (
      <AlertProvider template={AlertTemplate} {...options}>
        <div className={css(styles.pageWrapper)}>
          <PermissionNotification />
          <Navbar />
          <Component {...pageProps} />
          <Message />
        </div>
        <Footer />
      </AlertProvider>
    );
  }
}

const styles = StyleSheet.create({
  pageWrapper: {
    width: "100%",
    minHeight: "100vh",
    background: "#FAFAFA",
  },
});

const mapStateToProps = (state) => ({
  authChecked: state.auth.authChecked,
  auth: state.auth,
});

const mapDispatchToProps = {
  getUser: AuthActions.getUser,
  getTopHubs: HubActions.getTopHubs,
  getUniversities: UniversityActions.getUniversities,
  fetchPermissions: PermissionActions.fetchPermissions,
  getWithdrawals: TransactionActions.getWithdrawals,
  getNotifications: NotificationActions.getNotifications,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Base);
