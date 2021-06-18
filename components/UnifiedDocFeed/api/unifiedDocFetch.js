import { fetchUnifiedDocFeed } from "../../../config/fetch";
import * as moment from "dayjs";
import * as Sentry from "@sentry/browser";
import { isNullOrUndefined } from "../../../config/utils/nullchecks";
import API from "~/config/api";

// import { AUTH_TOKEN } from "~/config/constants";
// import nookies from "nookies";

// const cookies = nookies.get(ctx);
// const authToken = cookies[AUTH_TOKEN];

const calculateScope = (scope) => {
  const result = {
    start: 0,
    end: 0,
  };

  const scopeId = scope.value;
  const now = moment();
  const today = moment().startOf("day");
  const week = moment()
    .startOf("day")
    .subtract(7, "days");
  const month = moment()
    .startOf("day")
    .subtract(30, "days");
  const year = moment()
    .startOf("day")
    .subtract(365, "days");

  scope.end = now.unix();
  if (scopeId === "day") {
    scope.start = today.unix();
  } else if (scopeId === "week") {
    scope.start = week.unix();
  } else if (scopeId === "month") {
    scope.start = month.unix();
  } else if (scopeId === "year") {
    scope.start = year.unix();
  } else if (scopeId === "all-time") {
    const start = "2019-01-01";
    const diff = now.diff(start, "days") + 1;
    const alltime = now.startOf("day").subtract(diff, "days");
    scope.start = alltime.unix();
  }
  return scope;
};

export default function fetchUnifiedDocs({
  docTypeFilter,
  hubID,
  onError,
  onSuccess,
  page,
  subFilters,
}) {
  const { filterBy, scope } = subFilters;
  /* PARAMS is: 
    { 
      externalSource,
      hubId,
      ordering,
      page,
      slug,
      subscribedHubs,
      timePeriod,
      type, // docType
    }
  */
  const PARAMS = {
    hubId: hubID,
    ordering: filterBy.value,
    page,
    timePeriod: calculateScope(scope),
    type: docTypeFilter,
  };

  fetchUnifiedDocFeed(PARAMS)
    .then((res) => {
      const { count, next, results } = res;
      onSuccess({
        count,
        hasMore: !isNullOrUndefined(next),
        documents: results,
      });
    })
    .catch((err) => {
      // If we get a 401 error it means the token is expired.
      const { response } = err;
      onError(err);
      Sentry.captureException(err);
    });
}
