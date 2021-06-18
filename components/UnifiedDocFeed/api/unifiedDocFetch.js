import { fetchUnifiedDocFeed } from "../../../config/fetch";
import * as moment from "dayjs";
import * as Sentry from "@sentry/browser";
import { isNullOrUndefined } from "../../../config/utils/nullchecks";
import API from "~/config/api";
import helpers from "@quantfive/js-web-config/helpers";

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

const fetchUserVote = (documents) => {
  let postIds = [];
  let paperIds = [];
  for (let i = 0; i < documents.length; i++) {
    let curDoc = documents[i];
    if (curDoc.document_type === "PAPER") {
      paperIds.push(curDoc.documents.id);
    } else {
      postIds.push(curDoc.documents[0].id);
    }
  }

  return fetch(
    API.CHECK_USER_VOTE_DOCUMENTS({ postIds, paperIds }),
    API.GET_CONFIG()
  )
    .then(helpers.checkStatus)
    .then(helpers.parseJSON)
    .then((res) => {
      let newDocs = [...documents];

      for (let i = 0; i < newDocs.length; i++) {
        let curDoc = newDocs[i];
        if (curDoc.document_type === "PAPER") {
          let docId = curDoc.documents.id;
          curDoc.documents.user_vote = res.papers[docId];
        } else {
          let docId = curDoc.documents[0].id;
          curDoc.documents[0].user_vote = res.posts[docId];
        }
      }

      return newDocs;
    })
    .catch((_) => {
      return documents;
    });
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
    .then(async (res) => {
      const { count, next, results } = res;
      let docs = await fetchUserVote(results);
      onSuccess({
        count,
        hasMore: !isNullOrUndefined(next),
        documents: docs,
      });
    })
    .catch((err) => {
      // If we get a 401 error it means the token is expired.
      const { response } = err;
      onError(err);
      Sentry.captureException(err);
    });
}
