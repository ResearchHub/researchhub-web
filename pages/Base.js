import { AuthActions } from "../redux/auth";
import { createContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { HubActions } from "../redux/hub";
import { isDevEnv, isProduction } from "~/config/utils/env";
import { NewPostButtonContext } from "~/components/contexts/NewPostButtonContext.ts";
import { NavigationContextProvider } from "~/components/contexts/NavigationContext";
import { SavedCitationsContextProvider } from "~/components/contexts/SavedCitationsContext";
import { ReferenceManagerSettingsProvider } from "~/components/contexts/ReferenceManagerSettings";
import { NotificationActions } from "~/redux/notification";
import { StyleSheet, css } from "aphrodite";
import { TransactionActions } from "../redux/transaction";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import { UniversityActions } from "../redux/universities";
import dynamic from "next/dynamic";
import PermissionActions from "../redux/permission";
import RootLeftSidebar, {
  LEFT_SIDEBAR_MIN_WIDTH,
} from "~/components/Home/sidebar/RootLeftSidebar";
import Router from "next/router";
import Script from "next/script";
import { ExchangeRateContextProvider } from "~/components/contexts/ExchangeRateContext";
import OrganizationContextProvider from "~/components/contexts/OrganizationContext";
import CustomHead from "../components/Head";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { createPublicClient, http } from "viem";
import { mainnet, sepolia, base, baseSepolia } from "wagmi/chains";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { ModalActions } from "~/redux/modals";
import { publicProvider } from "wagmi/providers/public";
import { infuraProvider } from "wagmi/providers/infura";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { ToastContainer, cssTransition } from "react-toastify";
import {
  HistoryManagerProvider,
  useHistoryManager,
} from "~/components/contexts/HistoryManagerContext";
import showGenericToast from "~/components/Notifications/lib/showGenericToast";
import { MathJaxContext, MathJax } from "better-react-mathjax";

LEFT_SIDEBAR_MIN_WIDTH;
// WalletConnect project ID
const projectId = "a3e8904e258fe256bf772b764d3acfab";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [isProduction() ? mainnet : sepolia, isProduction() ? base : baseSepolia],
  [
    w3mProvider({ projectId }),
    infuraProvider({
      apiKey: "42fa8ef2001944acac0803b74614f301",
    }),
    publicProvider(),
  ]
);

const config = createConfig({
  autoConnect: true,
  connectors: [
    ...w3mConnectors({ projectId, chains }),
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "wagmi",
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
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

const ethereumClient = new EthereumClient(config, chains);

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
  openRecaptchaPrompt,
}) {
  const [numNavInteractions, setNumNavInteractions] = useState(0);
  const [numProfileDeletes, setNumProfileDeletes] = useState(0);
  const [newPostButtonValues, setNewPostButtonValues] = useState({
    isOpen: false,
    paperID: null,
  });
  const historyManager = useHistoryManager();

  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (url, options = {}) => {
      const response = await originalFetch(url, options);

      if (parseInt(response.status, 10) === 429) {
        // Handle the rate limit error here. You can throw an error, show a
        // notification, retry the request, etc.

        openRecaptchaPrompt(true);
      }

      return response;
    };
  }, []);

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

  const fadeTransition = cssTransition({
    collapse: false,
    collapseDuration: 500,
    enter: "fade-in",
    exit: "fade-out",
  });

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
      <MathJaxContext>
        <HistoryManagerProvider value={historyManager}>
          <ReferenceManagerSettingsProvider>
            <OrganizationContextProvider user={auth.user}>
              <SavedCitationsContextProvider>
                <NavigationContextProvider>
                  <ExchangeRateContextProvider>
                    <WagmiConfig config={config}>
                      <NavbarContext.Provider
                        value={{
                          numNavInteractions,
                          setNumNavInteractions,
                          numProfileDeletes,
                          setNumProfileDeletes,
                        }}
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
                                rootLeftSidebarForceMin={
                                  rootLeftSidebarForceMin
                                }
                              />
                            )}
                            <div className={css(styles.main)}>
                              {withNavbar && <DynamicNavbar />}
                              <Component {...pageProps} {...appProps} />
                            </div>
                          </div>
                          <ToastContainer
                            transition={fadeTransition}
                            style={{ zIndex: 99999999999 }}
                          />
                        </NewPostButtonContext.Provider>
                      </NavbarContext.Provider>
                    </WagmiConfig>
                    <Web3Modal
                      projectId={projectId}
                      ethereumClient={ethereumClient}
                    />
                  </ExchangeRateContextProvider>
                </NavigationContextProvider>
              </SavedCitationsContextProvider>
            </OrganizationContextProvider>
          </ReferenceManagerSettingsProvider>
        </HistoryManagerProvider>
      </MathJaxContext>
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
    // Account for left sidebar in order to prevent page to overflow beyond 100vw
    width: `calc(100% - ${LEFT_SIDEBAR_MIN_WIDTH}px)`,
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
  openRecaptchaPrompt: ModalActions.openRecaptchaPrompt,
};

export default connect(mapStateToProps, mapDispatchToProps)(Base);
