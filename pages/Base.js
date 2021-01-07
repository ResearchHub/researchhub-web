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
import { TransactionActions } from "../redux/transaction";
import { NotificationActions } from "~/redux/notification";
import { BannerActions } from "~/redux/banner";

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

// const mapStateToProps = (state) => ({
//   authChecked: state.auth.authChecked,
//   auth: state.auth,
// });

// const mapDispatchToProps = {
//   getUser: AuthActions.getUser,
//   getUserBannerPreference: AuthActions.getUserBannerPreference,
//   determineBanner: BannerActions.determineBanner,
//   getWithdrawals: TransactionActions.getWithdrawals,
//   getNotifications: NotificationActions.getNotifications,
//   fetchPermissions: PermissionActions.fetchPermissions
// };

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(Base);

export default Base;
