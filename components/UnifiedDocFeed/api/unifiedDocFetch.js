import { fetchUnifiedDocFeed } from "../../../config/fetch";
import {
  emptyFncWithMsg,
  filterNull,
  isNullOrUndefined,
} from "../../../config/utils/nullchecks";
import * as Sentry from "@sentry/browser";
import API from "~/config/api";
import helpers from "@quantfive/js-web-config/helpers";
import {
  getBEUnifiedDocType,
  RESEARCHHUB_POST_DOCUMENT_TYPES,
} from "~/config/utils/getUnifiedDocType";

export const fetchUserVote = (unifiedDocs = [], isLoggedIn, authToken) => {
  const documentIds = { hypothesis: [], paper: [], posts: [] };

  unifiedDocs.forEach(({ documents, document_type }) => {
    const beDocType = getBEUnifiedDocType(document_type);
    if (RESEARCHHUB_POST_DOCUMENT_TYPES.includes(beDocType)) {
      // below assumes we are only getting the first version of post
      (documents ?? []).length > 0 && documentIds.posts.push(documents[0].id);
    } else {
      documentIds[beDocType]?.push(documents.id);
    }
  });
  const {
    hypothesis: hypothesisIds,
    paper: paperIds,
    posts: postIds,
  } = documentIds;

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
          const currBeDocType = getBEUnifiedDocType(currUniDoc.document_type);
          const isPost =
            RESEARCHHUB_POST_DOCUMENT_TYPES.includes(currBeDocType);
          const docTypeOverride = isPost ? "posts" : currBeDocType;
          const targetDoc = isPost
            ? (currUniDoc.documents ?? [])[0] ?? null
            : currUniDoc.documents;

          if (isNullOrUndefined(targetDoc)) {
            return null;
          }

          return isPost
            ? {
                ...currUniDoc,
                documents: [
                  {
                    ...targetDoc,
                    user_vote: res[docTypeOverride][targetDoc.id],
                  },
                ],
              }
            : {
                ...currUniDoc,
                documents: {
                  ...targetDoc,
                  user_vote: res[docTypeOverride][targetDoc.id],
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

export default function fetchUnifiedDocs(args) {
  const {
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
  } = args;
  const { filterBy, scope, tags } = subFilters;
  console.log("tags", tags);
  fetchUnifiedDocFeed(
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
      } */
    {
      hubId: hubID,
      ordering: filterBy.value,
      tags,
      page,
      subscribedHubs,
      timePeriod: scope.valueForApi,
      type: docTypeFilter,
      hotV2,
    }
  )
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
