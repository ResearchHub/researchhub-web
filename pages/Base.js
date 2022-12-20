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
import RootLeftSidebar from "~/components/Home/sidebar/RootLeftSidebar";
import Router from "next/router";
import Script from "next/script";

import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, goerli } from "wagmi/chains";

const DynamicPermissionNotification = dynamic(() =>
  import("../components/PermissionNotification")
);
const DynamicMessage = dynamic(() => import("~/components/Loader/Message"));
const DynamicAlertTemplate = dynamic(() =>
  import("~/components/Modals/AlertTemplate")
);
const DynamicNavbar = dynamic(() => import("~/components/Navbar"));
export const NavbarContext = createContext();

const isProduction = process.env.REACT_APP_ENV === "production";

const chains = [isProduction ? mainnet : goerli];

// Wagmi client
const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: "a3e8904e258fe256bf772b764d3acfab" }),
]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: "web3Modal", chains }),
  provider,
});

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains);

function Base({
  auth,
  Component,
  fetchPermissions,
  getNotifications,
  getTopHubs,
  getUniversities,
  getUser,
  getWithdrawals,
  pageProps,
  rootLeftSidebarForceMin,
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
    {process.env.GA_TRACKING_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_TRACKING_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${process.env.GA_TRACKING_ID}');
          `}
          </Script>
        </>
      )}
      <WagmiConfig client={wagmiClient}>
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
              <RootLeftSidebar
                rootLeftSidebarForceMin={rootLeftSidebarForceMin}
              />
              <Web3Modal
                projectId="a3e8904e258fe256bf772b764d3acfab"
                ethereumClient={ethereumClient}
              />
              <div className={css(styles.main)}>
                <DynamicNavbar />
                <Component {...pageProps} />
              </div>
            </div>
          </NewPostButtonContext.Provider>
        </NavbarContext.Provider>
      </WagmiConfig>
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
    flex: 1,
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
