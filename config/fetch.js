import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { emailPreference } from "./shims";
import { emptyFncWithMsg, filterNull } from "~/config/utils/nullchecks";

export const inviteUserToOrg = ({ orgId, email, expire = 4320, accessType = "EDITOR" }) => {
  return fetch(API.INVITE_TO_ORG({ orgId }), API.POST_CONFIG({ email, expire, access_type: accessType }))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
}

export const createOrg = (payload) => {
  return fetch(API.ORGANIZATION({}), API.POST_CONFIG(payload))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
}

export const fetchOrgUsers = ({ orgId }) => {
  return fetch(API.ORGANIZATION_USERS({ orgId }), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
}

export const fetchOrg = ({ orgId }) => {
  return fetch(API.ORGANIZATION({ orgId }), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
}

export const fetchEmailPreference = async () => {
  const params = API.GET_CONFIG();
  const data = await fetch(API.EMAIL_PREFERENCE({}), params)
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
  if (data.results) {
    if (data.results.length === 1) {
      return emailPreference(data.results[0]);
    }
  }
};

export const updateEmailPreference = async (emailRecipientId, data) => {
  const params = API.PATCH_CONFIG(data);
  return await fetch(API.EMAIL_PREFERENCE({ emailRecipientId }), params)
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const subscribeToHub = async ({ hubId }) => {
  return await fetch(API.HUB_SUBSCRIBE({ hubId }), API.POST_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const unsubscribeFromHub = async ({ hubId }) => {
  return await fetch(API.HUB_UNSUBSCRIBE({ hubId }), API.POST_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const sendAmpEvent = async (payload, cb) => {
  return fetch(API.AMP_ANALYTICS, API.POST_CONFIG(payload))
    .then(Helpers.checkStatus)
    .then((res) => cb && cb(res));
};

export const bulletVote = async ({ type, bulletId }, callback) => {
  return fetch(API.KEY_TAKEAWAY({ bulletId, route: type }), API.POST_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((res) => callback(res))
    .catch((err) => {
      //Todo: handle error
    });
};

export const summaryVote = async ({ type, summaryId }, callback) => {
  return fetch(API.SUMMARY({ summaryId, route: type }), API.POST_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((res) => callback(res))
    .catch((err) => {
      //Todo: handle error
    });
};

export const checkSummaryVote = async ({ summaryId }, callback) => {
  return fetch(
    API.SUMMARY({ summaryId, route: "check_user_vote", check_vote: true }),
    API.GET_CONFIG()
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .catch((err) => {
      //Todo: handle error
    });
};

export const supportContent = async ({ contentType, objectId, amount }) => {
  const PAYLOAD = {
    content_type: contentType,
    object_id: objectId,
    amount,
    purchase_type: "BOOST",
    purchase_method: "OFF_CHAIN",
  };

  return fetch(API.PROMOTE, API.POST_CONFIG(PAYLOAD))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const setSectionBounty = async ({ paperId, type, amount }) => {
  const PAYLOAD = { [type]: amount };

  return fetch(
    API.PAPER({ paperId, route: "bounty" }),
    API.POST_CONFIG(PAYLOAD)
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const reviewBounty = ({ paperId, PAYLOAD }) => {
  return fetch(
    API.PAPER({ paperId, route: "review_bounty" }),
    API.POST_CONFIG(PAYLOAD)
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const checkUserVotesOnPapers = async ({ paperIds }) => {
  return await fetch(API.CHECK_USER_VOTE({ paperIds }), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const fetchPaperFeed = async (PARAMS, authToken = null) => {
  return await fetch(API.GET_HUB_PAPERS(PARAMS), API.GET_CONFIG(authToken))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const fetchUnifiedDocFeed = async (
  PARAMS,
  authToken = null,
  withVotes = false
) => {
  const docPayload = await fetch(
    API.GET_UNIFIED_DOCS(PARAMS),
    API.GET_CONFIG(authToken)
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
  if (!withVotes) {
    return docPayload;
  } else {
    return await fetchAndUpdateFeedWithVotes(docPayload, authToken);
  }
};

const fetchAndUpdateFeedWithVotes = async (docPayload, authToken) => {
  const unifiedDocs = docPayload.results;
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
    return docPayload;
  }
  return fetch(
    API.CHECK_USER_VOTE_DOCUMENTS({ postIds, paperIds }),
    API.GET_CONFIG(authToken)
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((res) => {
      const uniDocsWithVotes = filterNull(
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
      return { ...docPayload, results: uniDocsWithVotes };
    })
    .catch((error) => {
      emptyFncWithMsg(error);
      return docPayload;
    });
};

export const fetchLeaderboard = async (PARAMS) => {
  fetch(API.LEADERBOARD(PARAMS), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const fetchTopHubs = async () => {
  fetch(API.SORTED_HUB(), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const fetchURL = async (URL) => {
  return await fetch(URL, API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const fetchPaperFigures = async (paperId) => {
  return fetch(
    API.FIGURES({ paperId, route: "get_all_figures" }),
    API.GET_CONFIG()
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const fetchPaperDraft = ({ paperId }) => {
  return fetch(
    API.PAPER({
      paperId: paperId,
      hidePublic: true,
      route: "pdf_extract",
    }),
    API.GET_CONFIG()
  );
};

export const fetchLatestActivity = ({ hubIds }) => {
  return fetch(
    API.USER({ route: "following_latest_activity", hubIds }),
    API.GET_CONFIG()
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .catch((_) => {
      return { error: true };
    });
};

export const followUser = ({ userId, followeeId }) => {
  const PAYLOAD = {
    followee_id: followeeId,
  };

  return fetch(API.USER({ userId, route: "follow" }), API.POST_CONFIG(PAYLOAD))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const isFollowingUser = ({ authorId: userId }) => {
  return fetch(API.USER({ route: "check_follow", userId }), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};
