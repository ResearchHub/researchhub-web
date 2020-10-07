import React, { Fragment } from "react";

// NPM Modules
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import { transitions, positions, Provider as AlertProvider } from "react-alert";

// Components
import Message from "~/components/Loader/Message";
import Navbar from "~/components/Navbar";
import PermissionNotification from "../components/PermissionNotification";
import AlertTemplate from "~/components/modal/AlertTemplate";

import { AuthActions } from "../redux/auth";
import { HubActions } from "../redux/hub";
import { UniversityActions } from "../redux/universities";
import { TransactionActions } from "../redux/transaction";
import { NotificationActions } from "~/redux/notification";
import { BannerActions } from "~/redux/banner";

import PermissionActions from "../redux/permission";
import Footer from "./footer";
import { SIFT_BEACON_KEY } from "~/config/constants";

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
      this.connectSift();
    }
    getUserBannerPreference();
    determineBanner();
    fetchPermissionsPending();
    await fetchPermissions();
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.auth.isLoggedIn && this.props.auth.isLoggedIn) {
      this.connectSift();
    } else if (prevProps.auth.isLoggedIn && !this.props.auth.isLoggedIn) {
      this.disconnectSift();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("load", this.loadSift);
  }

  connectSift = () => {
    let _user_id = this.props.auth.user.id;
    let _session_id = this.uniqueId();
    let _sift = (window._sift = window._sift || []);
    _sift.push(["_setAccount", SIFT_BEACON_KEY]);
    _sift.push(["_setUserId", _user_id]);
    _sift.push(["_setSessionId", _session_id]);
    _sift.push(["_trackPageview"]);

    if (window.attachEvent) {
      window.attachEvent("onload", this.loadSift);
    } else {
      window.addEventListener("load", this.loadSift, false);
    }

    this.loadSift();
  };

  disconnectSift = () => {
    let sift = document.getElementById("sift");
    sift.parentNode.removeChild(sift);
  };

  loadSift = () => {
    if (this.props.auth.isLoggedIn) {
      if (!document.getElementById("sift")) {
        // only attach script if it isn't there
        let script = document.createElement("script");
        script.setAttribute("id", "sift");
        script.src = "https://cdn.sift.com/s.js";
        document.body.appendChild(script);
      }
    } else {
      this.disconnectSift();
    }
  };

  uniqueId = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
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
