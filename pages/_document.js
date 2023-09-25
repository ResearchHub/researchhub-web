import { StyleSheetServer } from "aphrodite";
import * as Sentry from "@sentry/browser";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { GOOGLE_CLIENT_ID } from "~/config/constants";

process.on("unhandledRejection", (err) => {
  Sentry.captureException(err);
});

process.on("uncaughtException", (err) => {
  Sentry.captureException(err);
});

export default class MyDocument extends Document {
  static async getInitialProps({ renderPage, res, req }) {
    const { html, css } = StyleSheetServer.renderStatic(() => renderPage());
    const _html = await html;
    const ids = css.renderedClassNames;

    redirectWithoutSlash(res, req);
    return { ..._html, css, ids };
  }

  render() {
    /* Make sure to use data-aphrodite attribute in the style tag here
    so that aphrodite knows which style tag it's in control of when
    the client goes to render styles. If you don't you'll get a second
    <style> tag */
    const { css, ids } = this.props;
    return (
      <Html>
        <Head>
          {/* Google one tap */}
          <script
            src="https://accounts.google.com/gsi/client"
            async
            defer
          ></script>
          <link rel="preconnect" href="https://fonts.gstatic.com/"></link>
          <link
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
            rel="stylesheet"
            preload="true"
          />
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="/static/favicons/apple-touch-icon.png"
            preload="true"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/static/favicons/favicon-32x32.png"
            preload="true"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/static/favicons/favicon-16x16.png"
            preload="true"
          />
          <link rel="manifest" href="/static/favicons/site.webmanifest" async />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />
          <style
            data-aphrodite
            dangerouslySetInnerHTML={{ __html: css.content }}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:1876155,hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`,
            }}
          />
          <script src="https://accounts.google.com/gsi/client" async></script>
        </Head>
        <body style={{ margin: 0, fontFamily: "Roboto, sans-serif" }}>
          <Main />
          <NextScript />
          {ids && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.__REHYDRATE_IDS = ${JSON.stringify(ids)}
                `,
              }}
            />
          )}
        </body>
      </Html>
    );
  }
}

function redirectWithoutSlash(res, req) {
  /*
  Copied from
  https://github.com/DevSpeak/next-trailingslash/blob/master/pages/_error.js

  Handling ?= should be solved differently if you use dynamic routing,
  this will only remove the 404 for those urls.
  */
  let urlParts = req.url.split("?");
  if (urlParts[0].endsWith("/") && !isIndexUrl(req.url)) {
    urlParts[0] = urlParts[0].substring(0, urlParts[0].length - 1);
    res.writeHead(301, { Location: urlParts.join("?") });
    res.end();
  }
}

function isIndexUrl(url) {
  let qs = url.indexOf("?");
  url = url.substring(0, qs != -1 ? qs : url.length);
  return url == "/";
}
