import App from "next/app";
import Router, { useRouter } from "next/router";
import withRedux from "next-redux-wrapper";
import { Provider } from "react-redux";
import { configureStore } from "~/redux/configureStore";
import "isomorphic-unfetch";
import { useEffect, useState } from "react";

// Components
import Base from "./Base";

// Stylesheets
import "./stylesheets/App.css";
import "../components/Paper/progressbar.css";
import "react-tagsinput/react-tagsinput.css";
import "../components/SearchSuggestion/authorinput.css";
import "../components/CKEditor/CKEditor.css";

import "../components/Modals/Stylesheets/Dnd.css";
import "react-quill/dist/quill.snow.css";
import "../components/TextEditor/stylesheets/QuillTextEditor.css";
import "../components/Paper/Tabs/stylesheets/ReactPdf.css";
import "~/components/Paper/Tabs/stylesheets/paper.css";
import "~/pages/paper/[paperId]/[paperName]/styles/anchor.css";
import "~/pages/user/stylesheets/toggle.css";
import "react-placeholder/lib/reactPlaceholder.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "katex/dist/katex.min.css";

// Redux
import { MessageActions } from "~/redux/message";

const MyApp = ({ Component, pageProps, store }) => {
  const router = useRouter();

  const [prevPath, setPrevPath] = useState(router.asPath);

  // Scroll to top on page change
  useEffect(() => {
    if (prevPath !== router.pathname) {
      window.scroll({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    }

    setPrevPath(router.pathname);
  }, [router.asPath]);

  useEffect(() => {
    router.events.on("routeChangeComplete", (url) => {
      store.dispatch(MessageActions.showMessage({ show: false }));
    });

    Router.events.on("routeChangeError", () => {
      store.dispatch(MessageActions.showMessage({ show: false }));
    });
  }, []);

  return (
    <Provider store={store}>
      <Base pageProps={pageProps} Component={Component} />
    </Provider>
  );
};

// FIXME: This approach is only needed while there are pages containg
// getStaticProps or getServerSideProps and also others containing getInitialProps. Once all calls
// to getInitialProps removed, this can be removed safely.
MyApp.getInitialProps = async (appContext) => {
  const staticOrServerSidePropsPaths = [
    "/paper/[paperId]/[paperName]",
    "/hubs",
    "/user/[authorId]/[tabName]",
    "/[orgSlug]/notebook/[noteId]",
    "/[orgSlug]/notebook",
  ];

  if (
    process.browser ||
    !staticOrServerSidePropsPaths.includes(appContext.router.route)
  ) {
    const appProps = await App.getInitialProps(appContext);
    return { ...appProps };
  }
};

export default withRedux(configureStore)(MyApp);
