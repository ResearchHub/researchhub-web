import { Component, createContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";

// NPM Modules
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import Router from "next/router";

// Components
import { AuthActions } from "../redux/auth";
import { HubActions } from "../redux/hub";
import { UniversityActions } from "../redux/universities";
import { TransactionActions } from "../redux/transaction";
import { NotificationActions } from "~/redux/notification";
import PermissionActions from "../redux/permission";
import { isDevEnv } from "~/config/utils/env";

const DynamicPermissionNotification = dynamic(() =>
  import("../components/PermissionNotification")
);
const DynamicMessage = dynamic(() => import("~/components/Loader/Message"));
const DynamicAlertTemplate = dynamic(() =>
  import("~/components/Modals/AlertTemplate")
);
const DynamicFooter = dynamic(() => import("./footer"));
const DynamicNavbar = dynamic(() => import("~/components/Navbar"));

export const NavbarContext = createContext();

function Base({
  fetchPermissions,
  getUser,
  getUniversities,
  getWithdrawals,
  getTopHubs,
  getNotifications,
  auth,
  Component,
  pageProps,
}) {
  const [numNavInteractions, setNumNavInteractions] = useState(0);

  useEffect(async () => {
    getUniversities();
    await getUser();
    getTopHubs(auth);
    if (auth.isLoggedIn) {
      getWithdrawals();
      getNotifications();
    }
    fetchPermissions();
  }, []);

  /*
    This component is used in situations where we fetch data through
    getInitialProps. In these cases, we cannot intercept the data and replace
    it with a fixture. In order to bypass this restriction we basically
    trigger a reload of the current page programatically which then runs the
    fetch on the client side and allow to intercept.
  */
  const SPEC__reloadClientSideData = () => {
    const _reloadPage = () =>
      Router.push({ pathname: Router.pathname, query: Router.query });
    return (
      <span
        onClick={_reloadPage}
        className={css(styles.hide)}
        data-test="reload-client-side-data"
      ></span>
    );
  };

  const options = {
    position: positions.MIDDLE,
    transition: transitions.SCALE,
  };

  return (
    <AlertProvider template={DynamicAlertTemplate} {...options}>
      <NavbarContext.Provider
        value={{ numNavInteractions, setNumNavInteractions }}
      >
        {isDevEnv() && SPEC__reloadClientSideData()}
        <div className={css(styles.pageWrapper)}>
          <DynamicPermissionNotification />
          <DynamicNavbar />
          <Component {...pageProps} />
          <DynamicMessage />
        </div>
        <DynamicFooter />
      </NavbarContext.Provider>
    </AlertProvider>
  );
}

const styles = StyleSheet.create({
  pageWrapper: {
    width: "100%",
    minHeight: "100vh",
    // background: "#FAFAFA",
    background: "#FCFCFC",
  },
  hide: {
    display: "none",
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

export default connect(mapStateToProps, mapDispatchToProps)(Base);
