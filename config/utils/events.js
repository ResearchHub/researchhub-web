import * as Sentry from "@sentry/nextjs";

export const captureEvent = ({ error, msg = null, tags = {}, data = {} }) => {
  if (error) {
    Sentry.withScope((scope) => {
      scope.setTags(tags);
      Object.keys(data).map((k) => {
        scope.setExtra(k, data[k]);
      });

      // Overriding error message but maintaining the original
      if (msg) {
        error.message = `${msg} (Exception: ${error.message})`;
      }

      Sentry.captureException(error);
      console.error(error.message, error, data);
    });
  } else if (msg && !error) {
    Sentry.withScope((scope) => {
      scope.setTags(tags);
      Object.keys(data).map((k) => {
        scope.setExtra(k, data[k]);
      });
      Sentry.captureMessage(msg);
      console.error(msg, data);
    });
  }
};
