// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: "https://423f7b6ddcea48b9b50f7ba4baa0e750@o206202.ingest.sentry.io/1817918",
    release: process.env.SENTRY_RELEASE,
    environment:
      process.env.REACT_APP_ENV === "staging" ? "staging" : "production",
    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 0.25,
    // ...
    // Note: if you want to override the automatic release value, do not set a
    // `release` value here - use the environment variable `SENTRY_RELEASE`, so
    // that it will also get attached to your source maps
  });
}
