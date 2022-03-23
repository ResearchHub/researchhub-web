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
  hotV2,
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
    timePeriod: scope.valueForApi,
    type: docTypeFilter,
    hotV2,
  };
  fetchUnifiedDocFeed(PARAMS)
    .then(async (res) => {
      const { count, next, results: fetchedUnifiedDocs = [] } = res ?? {};
      const voteFormattedDocs = await fetchUserVote(
        filterNull(fetchedUnifiedDocs),
        isLoggedIn
      );
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
