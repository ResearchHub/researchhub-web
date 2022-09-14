import { AuthActions } from "../redux/auth";
import { createContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { HubActions } from "../redux/hub";
import { isDevEnv } from "~/config/utils/env";
import { NewPostButtonContext } from "~/components/contexts/NewPostButtonContext.ts";
import { NotificationActions } from "~/redux/notification";
import { StyleSheet, css } from "aphrodite";
import { TransactionActions } from "../redux/transaction";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import { UniversityActions } from "../redux/universities";
import dynamic from "next/dynamic";
import PermissionActions from "../redux/permission";
import Router from "next/router";

const DynamicPermissionNotification = dynamic(() =>
  import("../components/PermissionNotification")
);
const DynamicMessage = dynamic(() => import("~/components/Loader/Message"));
const DynamicAlertTemplate = dynamic(() =>
  import("~/components/Modals/AlertTemplate")
);
// const DynamicFooter = dynamic(() => import("./footer"));
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
  const [newPostButtonValues, setNewPostButtonValues] = useState({
    isOpen: false,
    paperID: null,
  });

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
        <NewPostButtonContext.Provider
          value={{
            values: newPostButtonValues,
            setValues: setNewPostButtonValues,
          }}
        >
          {isDevEnv() && SPEC__reloadClientSideData()}
          <div className={css(styles.pageWrapper)}>
            <DynamicPermissionNotification />
            <DynamicMessage />
            <div className={css(styles.main)}>
              <DynamicNavbar />
              <Component {...pageProps} />
            </div>
          </div>
        </NewPostButtonContext.Provider>
      </NavbarContext.Provider>
    </AlertProvider>
  );
}

const styles = StyleSheet.create({
  pageWrapper: {
    background: "#fff",
    display: "flex",
    minHeight: "100vh",
    position: "relative",
    width: "100%",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
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
