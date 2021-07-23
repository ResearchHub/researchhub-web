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

const calculateTimeScope = (scope) => {
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

export const fetchUserVote = (unifiedDocs, isLoggedIn) => {
  const [paperIds, postIds] = [[], []];
  unifiedDocs.forEach(({ documents, document_type }) => {
    if (document_type === "PAPER") {
      paperIds.push(documents.id);
    } else {
      // below assumes we are only getting the first version of post
      documents.length > 0 && postIds.push(documents[0].id);
    }
  });
  if (paperIds.length < 1 && postIds.length < 1) {
    emptyFncWithMsg("Empty Post & Paper IDs. Probable cause: faulty data");
    return unifiedDocs;
  }
  return fetch(
    API.CHECK_USER_VOTE_DOCUMENTS({ postIds, paperIds }),
    API.GET_CONFIG()
  )
    .then(helpers.checkStatus)
    .then(helpers.parseJSON)
    .then((res) => {
      return filterNull(
        unifiedDocs.map((currUniDoc) => {
          const isPaper = currUniDoc.document_type === "PAPER";
          const relatedDocs = currUniDoc.documents;
          const uniDocId = isPaper
            ? relatedDocs.id
            : relatedDocs.length > 0
            ? relatedDocs[0].id
            : null;
          if (uniDocId == null) {
            return null;
          } else if (isPaper) {
            return {
              ...currUniDoc,
              documents: { ...relatedDocs, user_vote: res.papers[uniDocId] },
            };
          } else {
            return {
              ...currUniDoc,
              documents: [
                { ...relatedDocs[0], user_vote: res.posts[uniDocId] },
              ],
            };
          }
        })
      );
    })
    .catch((error) => {
      emptyFncWithMsg(error);
      return unifiedDocs;
    });
};

// TODO: calvinhlee - make this into a TS file so there's no confusion going forward
// type FetchUnifiedDocsArgs = {
//   docTypeFilter: any;
//   hubID: any;
//   isLoggedIn: any;
//   onError: any;
//   onSuccess: any;
//   page: any;
//   subscribedHubs: any;
//   subFilters: any;
// }

export default function fetchUnifiedDocs({
  docTypeFilter,
  hubID,
  isLoggedIn,
  onError,
  onSuccess,
  page,
  subscribedHubs,
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
      onSuccess({
        count,
        hasMore: !isNullOrUndefined(next),
        documents: voteFormattedDocs,
      });
    })
    .catch((err) => {
      // If we get a 401 error it means the token is expired.
      const { response } = err;
      onError(err);
      Sentry.captureException(err);
    });
}
