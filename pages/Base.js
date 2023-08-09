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
import { ExchangeRateContextProvider } from "~/components/contexts/ExchangeRateContext";
import OrganizationContextProvider from "~/components/contexts/OrganizationContext";
import CustomHead from "../components/Head";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { createPublicClient, http } from "viem";
import { mainnet, goerli } from "wagmi/chains";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";

const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: mainnet,
    transport: http(),
  }),
});

const DynamicPermissionNotification = dynamic(() =>
  import("../components/PermissionNotification")
);
const DynamicMessage = dynamic(() => import("~/components/Loader/Message"));
const DynamicAlertTemplate = dynamic(() =>
  import("~/components/Modals/AlertTemplate")
);
const DynamicNavbar = dynamic(() => import("~/components/Navbar"));
export const NavbarContext = createContext();

const chains = [mainnet, goerli];
const projectId = "a3e8904e258fe256bf772b764d3acfab";

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

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
  appProps,
  rootLeftSidebarForceMin,
  withSidebar = true,
  withNavbar = true,
}) {
  const [numNavInteractions, setNumNavInteractions] = useState(0);
  const [newPostButtonValues, setNewPostButtonValues] = useState({
    isOpen: false,
    paperID: null,
  });

  useEffect(() => {
    getUniversities();
    getUser().then(() => {
      getTopHubs(auth);
      if (auth.isLoggedIn) {
        getWithdrawals();
        getNotifications();
      }
      fetchPermissions();
    });
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
      <CustomHead />
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
      <OrganizationContextProvider user={auth.user}>
        <ExchangeRateContextProvider>
          <WagmiConfig config={config}>
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
                  {withSidebar && (
                    <RootLeftSidebar
                      rootLeftSidebarForceMin={rootLeftSidebarForceMin}
                    />
                  )}
                  <div className={css(styles.main)}>
                    {withNavbar && <DynamicNavbar />}
                    <Component {...pageProps} {...appProps} />
                  </div>
                </div>
              </NewPostButtonContext.Provider>
            </NavbarContext.Provider>
          </WagmiConfig>
          <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
        </ExchangeRateContextProvider>
      </OrganizationContextProvider>
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
