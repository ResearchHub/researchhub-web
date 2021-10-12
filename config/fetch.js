import { emailPreference } from "./shims";
import { fetchUserVote } from "~/components/UnifiedDocFeed/api/unifiedDocFetch";
import { Helpers } from "@quantfive/js-web-config";
import API from "~/config/api";

export const fetchNotePermissions = ({ noteId }) => {
  return fetch(API.NOTE_PERMISSIONS({ noteId }), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const fetchNoteByInviteToken = ({ token }) => {
  return fetch(API.NOTE_INVITE_DETAILS({ token }), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const updateNoteUserPermissions = ({
  noteId,
  orgId,
  userId,
  accessType,
}) => {
  const params = {
    organization: orgId || userId,
    access_type: accessType,
  };

  return fetch(
    API.NOTE_PERMISSIONS({ noteId, method: "PATCH" }),
    API.GET_CONFIG(params)
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const removeUserPermissionsFromNote = ({ noteId, userId }) => {
  return fetch(API.NOTE({ noteId }), API.DELETE_CONFIG({ user: userId }))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const inviteUserToNote = ({
  noteId,
  email,
  expire = 4320,
  accessType = "EDITOR",
}) => {
  const params = {
    email,
    expire,
    access_type: accessType,
  };

  return fetch(API.NOTE_INVITE_USER({ noteId }), API.POST_CONFIG(params))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const acceptNoteInvite = ({ token }) => {
  return fetch(API.NOTE_ACCEPT_INVITE({ token }), API.POST_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const fetchInvitedNoteUsers = ({ noteId }) => {
  return fetch(API.NOTE_INVITED_USERS({ noteId }), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const removeInvitedUserFromNote = ({ noteId, email }) => {
  return fetch(
    API.NOTE_REMOVE_INVITED_USER({ noteId }),
    API.PATCH_CONFIG({ email })
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const updateOrgProfileImg = ({ orgId, file }) => {
  const config = API.PATCH_FILE_CONFIG(file);
  return fetch(API.ORGANIZATION({ orgId }), config)
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const updateOrgUserPermissions = ({ orgId, userId, accessType }) => {
  return fetch(
    API.UPDATE_ORG_USER_PERMISSIONS({ orgId }),
    API.PATCH_CONFIG({ access_type: accessType, user: userId })
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const createNoteContent = ({ editorData, noteId }, authToken) => {
  const noteContentParams = {
    full_src: editorData,
    plain_text: "",
    note: noteId,
  };

  return fetch(
    API.NOTE_CONTENT(),
    API.POST_CONFIG(noteContentParams, authToken)
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const fetchNote = ({ noteId }, authToken) => {
  return fetch(API.NOTE({ noteId }), API.GET_CONFIG(authToken))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const createNewNote = ({ orgSlug, title }, authToken) => {
  const params = {
    organization_slug: orgSlug,
    title: title ? title : "Untitled",
  };

  return fetch(API.NOTE({}), API.POST_CONFIG(params, authToken))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const deleteNote = (noteId) => {
  return fetch(API.NOTE_DELETE({ noteId }), API.POST_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const fetchOrgNotes = ({ orgId, slug, orgSlug }, authToken) => {
  return fetch(API.NOTE({ orgId, slug, orgSlug }), API.GET_CONFIG(authToken))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const fetchUserOrgs = ({ user }) => {
  return fetch(API.ORGANIZATION({ userId: user.id }), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const acceptInviteToOrg = ({ token }) => {
  return fetch(API.ACCEPT_ORG_INVITE({ token }), API.POST_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const fetchOrgByInviteToken = ({ token }) => {
  return fetch(API.ORG_INVITE_DETAILS({ token }), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const inviteUserToOrg = ({
  orgId,
  email,
  expire = 4320,
  accessType = "MEMBER",
}) => {
  return fetch(
    API.INVITE_TO_ORG({ orgId }),
    API.POST_CONFIG({ email, expire, access_type: accessType })
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const createOrg = (payload) => {
  return fetch(API.ORGANIZATION({}), API.POST_CONFIG(payload))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const updateOrgDetails = ({ orgId, updatedName }) => {
  return fetch(
    API.ORGANIZATION({ orgId }),
    API.PATCH_CONFIG({ name: updatedName })
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const removeUserFromOrg = ({ orgId, userId }) => {
  const config = {
    ...API.DELETE_CONFIG(),
    body: JSON.stringify({ user: userId }),
  };
  return fetch(API.REMOVE_USER_FROM_ORG({ orgId }), config)
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const removeInvitedUserFromOrg = ({ orgId, email }) => {
  const config = { ...API.PATCH_CONFIG(), body: JSON.stringify({ email }) };
  return fetch(API.REMOVE_INVITED_USER_FROM_ORG({ orgId }), config)
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const fetchOrgUsers = ({ orgId }) => {
  return fetch(API.ORGANIZATION_USERS({ orgId }), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const fetchOrg = ({ orgId }) => {
  return fetch(API.ORGANIZATION({ orgId }), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

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
    const formattedResults = await fetchUserVote(docPayload.results, authToken);
    docPayload.results = formattedResults;
    return docPayload;
  }
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
