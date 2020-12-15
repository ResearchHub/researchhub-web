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

import { AuthActions } from "../redux/auth";
import { HubActions } from "../redux/hub";
import { UniversityActions } from "../redux/universities";
import { TransactionActions } from "../redux/transaction";
import { NotificationActions } from "~/redux/notification";
import { BannerActions } from "~/redux/banner";

import PermissionActions from "../redux/permission";
import Footer from "./footer";

class Base extends React.Component {
  componentDidMount = async () => {
    const {
      fetchPermissions,
      fetchPermissionsPending,
      getCategories,
      getHubs,
      getUser,
      getUniversities,
      getUserBannerPreference,
      getWithdrawals,
      getTopHubs,
      getNotifications,
      determineBanner,
      auth,
    } = this.props;

    await getUser();
    getTopHubs(auth);
    getUniversities();
    if (auth.isLoggedIn) {
      getWithdrawals();
      getNotifications();
    }
    getUserBannerPreference();
    determineBanner();
    fetchPermissionsPending();
    await fetchPermissions();
  };

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

const mapStateToProps = (state) => ({
  authChecked: state.auth.authChecked,
  auth: state.auth,
});

const mapDispatchToProps = {
  getUser: AuthActions.getUser,
  getCategories: HubActions.getCategories,
  getHubs: HubActions.getHubs,
  getTopHubs: HubActions.getTopHubs,
  getUniversities: UniversityActions.getUniversities,
  getUserBannerPreference: AuthActions.getUserBannerPreference,
  fetchPermissions: PermissionActions.fetchPermissions,
  fetchPermissionsPending: PermissionActions.fetchPermissionsPending,
  getWithdrawals: TransactionActions.getWithdrawals,
  getNotifications: NotificationActions.getNotifications,
  determineBanner: BannerActions.determineBanner,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Base);
