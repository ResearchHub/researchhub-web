// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn:
      SENTRY_DSN ||
      "https://423f7b6ddcea48b9b50f7ba4baa0e750@o206202.ingest.sentry.io/1817918",
    environment:
      process.env.REACT_APP_ENV === "staging" ? "staging" : "production",
  });
}
