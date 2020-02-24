import Document, { Head, Main, NextScript } from "next/document";
import { StyleSheetServer } from "aphrodite";
import * as Sentry from "@sentry/browser";

process.on("unhandledRejection", (err) => {
  Sentry.captureException(err);
});

process.on("uncaughtException", (err) => {
  Sentry.captureException(err);
});

export default class MyDocument extends Document {
  static async getInitialProps({ renderPage, res, req }) {
    const { html, css } = StyleSheetServer.renderStatic(() => renderPage());
    const ids = css.renderedClassNames;

    redirectWithoutSlash(res, req);

    return { ...html, css, ids };
  }

  constructor(props) {
    super(props);
    /* Take the renderedClassNames from aphrodite (as generated
    in getInitialProps) and assign them to __NEXT_DATA__ so that they
    are accessible to the client for rehydration. */
    const { __NEXT_DATA__, ids } = props;
    if (ids) {
      __NEXT_DATA__.ids = this.props.ids;
    }
  }

  render() {
    /* Make sure to use data-aphrodite attribute in the style tag here
    so that aphrodite knows which style tag it's in control of when
    the client goes to render styles. If you don't you'll get a second
    <style> tag */
    return (
      <html>
        <Head>
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="/static/favicons/apple-touch-icon.png"
          />
          {/* <!-- Appzi: Capture Insightful Feedback --> */}
          <script
            async
            src="https://app.appzi.io/bootstrap/bundle.js?token=ECg1v"
          ></script>
          {/* <!-- End Appzi --> */}
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/static/favicons/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/static/favicons/favicon-16x16.png"
          />
          <link rel="manifest" href="/static/favicons/site.webmanifest" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />
          <style
            data-aphrodite
            dangerouslySetInnerHTML={{ __html: this.props.css.content }}
          />
          <script
            src="https://kit.fontawesome.com/f57f706c59.js"
            crossOrigin="anonymous"
          ></script>
          <link
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
            rel="stylesheet"
          />

          {/* Meta Tags */}
          <meta
            property="og:image"
            content="https://www.researchhub.com/static/background/facebook-og.jpg"
          />
          <meta property="og:type" content="website" />
        </Head>
        <body style={{ margin: 0, fontFamily: "Roboto, sans-serif" }}>
          <Main />
          <NextScript />
        </body>
      </html>
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
