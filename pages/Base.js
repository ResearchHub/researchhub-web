import React from "react";
import dynamic from "next/dynamic";

// NPM Modules
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import { transitions, positions, Provider as AlertProvider } from "react-alert";

// Components
import { AuthActions } from "../redux/auth";
import { HubActions } from "../redux/hub";
import { UniversityActions } from "../redux/universities";
import { TransactionActions } from "../redux/transaction";
import { NotificationActions } from "~/redux/notification";
import PermissionActions from "../redux/permission";

const DynamicPermissionNotification = dynamic(() =>
  import("../components/PermissionNotification")
);
const DynamicMessage = dynamic(() => import("~/components/Loader/Message"));
const DynamicAlertTemplate = dynamic(() =>
  import("~/components/Modals/AlertTemplate")
);
const DynamicFooter = dynamic(() => import("./footer"));
const DynamicNavbar = dynamic(() => import("~/components/Navbar"));

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
      <AlertProvider template={DynamicAlertTemplate} {...options}>
        <div className={css(styles.pageWrapper)}>
          <DynamicPermissionNotification />
          <DynamicNavbar />
          <Component {...pageProps} />
          <DynamicMessage />
        </div>
        <DynamicFooter />
      </AlertProvider>
    );
  }
}

const styles = StyleSheet.create({
  pageWrapper: {
    width: "100%",
    minHeight: "100vh",
    // background: "#FAFAFA",
    background: "#FCFCFC",
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
