import { fetchPaperFeed } from "../../../config/fetch";
import * as moment from "dayjs";
import * as Sentry from "@sentry/browser";

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
  filter,
  subFilters,
  onSuccess,
  onError,
  page,
}) {
  const { filterBy, scope } = subFilters;
  const PARAMS = {
    timePeriod: calculateScope(scope),
    ordering: filterBy.value,
    page,
  };

  fetchPaperFeed(PARAMS)
    .then((res) => {
      const { count, next, results } = res;
      const papers = results.data;
      onSuccess({
        count,
        next,
        papers,
        papersLoading: false,
        doneFetching: true,
        noResults: results.no_results,
        feedType: results.feed_type,
      });
    })
    .catch((err) => {
      // If we get a 401 error it means the token is expired.
      const { response } = err;
      onError(err);
      Sentry.captureException(err);
    });
}
