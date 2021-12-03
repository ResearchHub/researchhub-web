import { fetchUnifiedDocFeed } from "../../../config/fetch";
import {
  emptyFncWithMsg,
  filterNull,
  isNullOrUndefined,
} from "../../../config/utils/nullchecks";
import * as moment from "dayjs";
import * as Sentry from "@sentry/browser";
import API from "~/config/api";
import helpers from "@quantfive/js-web-config/helpers";
import { getUnifiedDocType } from "~/config/utils/getUnifiedDocType";

const calculateTimeScope = (scope) => {
  const result = {
    start: 0,
    end: 0,
  };

  const scopeId = scope.value;
  const now = moment();
  const today = moment().startOf("day");
  const week = moment().startOf("day").subtract(7, "days");
  const month = moment().startOf("day").subtract(30, "days");
  const year = moment().startOf("day").subtract(365, "days");

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

export const fetchUserVote = (unifiedDocs = [], isLoggedIn, authToken) => {
  const userVoteIds = { hypothesis: [], paper: [], post: [] };
  unifiedDocs.forEach(({ documents, document_type }) => {
    const formattedDocType = getUnifiedDocType(document_type);
    if (formattedDocType === "post") {
      // below assumes we are only getting the first version of post
      documents.length > 0 && userVoteIds.post.push(documents[0].id);
    } else {
      userVoteIds[formattedDocType]?.push(documents.id);
    }
  });
  const {
    hypothesis: hypothesisIds,
    paper: paperIds,
    post: postIds,
  } = userVoteIds;
  if (hypothesisIds.length < 1 && paperIds.length < 1 && postIds.length < 1) {
    emptyFncWithMsg("Empty Post & Paper IDs. Probable cause: faulty data");
    return unifiedDocs;
  }
  return fetch(
    API.CHECK_USER_VOTE_DOCUMENTS({ hypothesisIds, postIds, paperIds }),
    !isNullOrUndefined(authToken) ? API.GET_CONFIG(authToken) : API.GET_CONFIG()
  )
    .then(helpers.checkStatus)
    .then(helpers.parseJSON)
    .then((res) => {
      return filterNull(
        unifiedDocs.map((currUniDoc) => {
          const formattedDocType = getUnifiedDocType(currUniDoc.document_type);
          const isPost = formattedDocType === "post";
          const targetDoc = isPost
            ? (currUniDoc.documents ?? [])[0] ?? null
            : currUniDoc.documents;

          if (isNullOrUndefined(targetDoc)) {
            return null;
          }

          const userVoteKey =
            formattedDocType + (formattedDocType !== "hypothesis" ? "s" : "");

          return isPost
            ? {
                ...currUniDoc,
                documents: [
                  {
                    ...targetDoc,
                    user_vote: res[userVoteKey][targetDoc.id],
                  },
                ],
              }
            : {
                ...currUniDoc,
                documents: {
                  ...targetDoc,
                  user_vote: res[userVoteKey][targetDoc.id],
                },
              };
        })
      );
    })
    .catch((error) => {
      emptyFncWithMsg(error);
      return unifiedDocs;
    });
};

export default function fetchUnifiedDocs({
  docTypeFilter,
  hubID,
  isLoggedIn,
  onError,
  onSuccess,
  page,
  subscribedHubs,
  subFilters,
  prevDocuments = [],
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
    subscribedHubs,
    timePeriod: calculateTimeScope(scope),
    type: docTypeFilter,
  };
  fetchUnifiedDocFeed(PARAMS)
    .then(async (res) => {
      const { count, next, results: fetchedUnifiedDocs } = res;
      const voteFormattedDocs = await fetchUserVote(
        filterNull(fetchedUnifiedDocs),
        isLoggedIn
      );
      console.warn("FETCHED: ", fetchedUnifiedDocs.length);
      console.warn("currentPageHasMore: ", !isNullOrUndefined(next));
      onSuccess({
        count,
        page,
        hasMore: !isNullOrUndefined(next),
        documents: voteFormattedDocs,
        prevDocuments,
      });
    })
    .catch((err) => {
      // If we get a 401 error it means the token is expired.
      const { response } = err;
      onError(err);
      Sentry.captureException(err);
    });
}
