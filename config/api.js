import { API } from "./api/index";
import { AUTH_TOKEN } from "../config/constants";
import { isNullOrUndefined, doesNotExist } from "~/config/utils/nullchecks";
import { RESEARCHHUB_POST_DOCUMENT_TYPES } from "./utils/getUnifiedDocType";
import { convertToBackendFilters } from "~/components/UnifiedDocFeed/utils/converToBackendFilters";

export const apiRoot = {
  production: "backend.researchhub.com",
  staging: "staging-backend.researchhub.com",
  dev: "localhost:8000",
};

const prepFilters = (filters) => {
  let url = "";
  if (filters && filters.length > 0) {
    for (let i = 0; i < filters.length; i++) {
      url += `${filters[i].name}__${filters[i].filter}=${filters[i].value}&`;
    }
  }
  return url;
};
{
}
/**
 * Function to prep the URL for querystring / url
 * @param { String } url -- the URL we want to manipulate
 * @param { Object } params -- params for querystring
 * @param { String } arrayParamSeparator -- seperator for array values
 */
export const prepURL = (url, params, arrayParamSeparator = ",") => {
  let { querystring, rest, filters } = params;

  let qs = "";
  if (rest) {
    if (rest.id !== null && rest.id !== undefined) {
      url += `${rest.id}/`;
    }

    if (rest.route) {
      url += `${rest.route}/`;
    }
  }

  let querystringKeys = Object.keys(querystring);
  for (let i = 0; i < querystringKeys.length; i++) {
    if (i === 0) {
      qs += `?`;
    }

    let currentKey = querystringKeys[i];
    let value = querystring[currentKey];

    if (value !== null && value !== undefined) {
      // When & is used as a separator, key=val is repeated as many
      // times as array elems per W3C spec.
      if (Array.isArray(value) && arrayParamSeparator === "&") {
        qs += value.map((v) => `${currentKey}=${v}`).join("&") + "&";
      } else {
        qs += `${currentKey}=${value}&`;
      }
    }
  }

  url += qs;

  url += prepFilters(filters);

  if (url.charAt(url.length - 1) === "&") {
    url = url.substring(0, url.length - 1);
  }

  return url;
};

const routes = (BASE_URL) => {
  return {
    ASYNC_PAPER_UPDATOR: BASE_URL + `paper/async_paper_updator/`,
    BASE_URL,
    CHECK_ACCOUNT: () => {
      return BASE_URL + `user/check_account/`;
    },
    CREATE_ACCOUNT: () => {
      return BASE_URL + `auth/register/`;
    },
    LOGIN_WITH_EMAIL: () => {
      return BASE_URL + `auth/login/`;
    },
    CHANGE_PASSWORD: () => {
      return BASE_URL + `auth/password-change/`;
    },
    RESET_PASSWORD: () => {
      return BASE_URL + `auth/password-reset/`;
    },
    RESET_PASSWORD_CHANGE_PASSWORD: () => {
      return BASE_URL + `auth/confirm/`;
    },
    VERIFY_EMAIL: () => {
      return BASE_URL + `auth/register/verify-email/`;
    },
    CITATIONS: ({ citationID, citationType, hypothesisID }, requestType) => {
      if (requestType === "get") {
        return !isNullOrUndefined(citationID)
          ? BASE_URL + `citation/${citationID}`
          : BASE_URL +
              (isNullOrUndefined(citationType)
                ? `hypothesis/${hypothesisID}/get_citations/`
                : `hypothesis/${hypothesisID}/get_citations/?citation_type=${citationType}`);
      } else if (requestType === "post") {
        return BASE_URL + `citation/`;
      }
    },
    CITATIONS_VOTE: ({ citationID, voteType }) => {
      return BASE_URL + `citation/${citationID}/${voteType}/`;
    },
    EXCLUDE_FROM_FEED: ({ unifiedDocumentId }) => {
      return `${BASE_URL}researchhub_unified_document/${unifiedDocumentId}/exclude_from_feed/`;
    },
    INCLUDE_IN_FEED: ({ unifiedDocumentId }) => {
      return `${BASE_URL}researchhub_unified_document/${unifiedDocumentId}/include_in_feed/`;
    },
    CONTRIBUTIONS: ({ hubId, contentType }) => {
      return (
        BASE_URL +
        "contribution/latest_contributions/?" +
        (hubId ? `hubs=${hubId}&` : "") +
        (contentType ? `contribution_type=${contentType}` : "")
      );
    },
    DISMISS_FLAGGED_CONTENT: () => {
      return BASE_URL + "audit/dismiss_flagged_content/";
    },
    REMOVE_FLAGGED_CONTENT: () => {
      return BASE_URL + "audit/remove_flagged_content/";
    },
    FLAGS: ({ hubId, verdict = "OPEN" }) => {
      return (
        BASE_URL +
        "audit/flagged/?" +
        (hubId ? `hubs=${hubId}&` : "") +
        (verdict ? `verdict=${verdict}&` : "") +
        (verdict === "OPEN"
          ? "ordering=-created_date"
          : "ordering=-verdict_created_date")
      );
    },
    /* GRM = Generic Reaction Model */
    FLAG_GRM_CONTENT: ({ commentPayload, contentID, contentType }) => {
      const {
        commentID = undefined,
        commentType = undefined,
        replyID = undefined,
        threadID = undefined,
      } = commentPayload ?? {};
      if (isNullOrUndefined(commentType)) {
        return `${BASE_URL}${contentType}/${contentID}/flag/`;
      } else {
        if (commentType === "thread") {
          return `${BASE_URL}${contentType}/${contentID}/discussion/${threadID}/flag/`;
        } else if (commentType === "comment") {
          return `${BASE_URL}${contentType}/${contentID}/comments/${commentID}/flag/`;
        } else {
          return `${BASE_URL}${contentType}/${contentID}/discussion/${threadID}/comment/${commentID}/reply/${replyID}/flag/`;
        }
      }
    },
    FEATURE_DOCUMENT: ({ unifiedDocumentId }) => {
      return `${BASE_URL}researchhub_unified_document/${unifiedDocumentId}/feature_document/`;
    },
    REMOVE_FROM_FEATURED: ({ unifiedDocumentId }) => {
      return `${BASE_URL}researchhub_unified_document/${unifiedDocumentId}/remove_from_featured/`;
    },
    FLAG_AND_REMOVE: () => {
      return BASE_URL + "audit/flag_and_remove/";
    },
    FLAG_COUNT: () => {
      return BASE_URL + "audit/flagged_count/";
    },
    ORGANIZATION: ({ userId, orgId, orgSlug, route }) => {
      let url = `${BASE_URL}organization/`;
      let restId = null;
      if (userId) {
        restId = userId;
      } else {
        restId = orgId;
      }

      const params = {
        querystring: {
          slug: orgSlug,
        },
        rest: {
          id: restId,
          route: route ? route : userId ? "get_user_organizations" : null,
        },
      };

      url = prepURL(url, params);
      return url;
    },
    ORGANIZATION_USERS: ({ orgId }) => {
      return `${BASE_URL}organization/${orgId}/get_organization_users`;
    },
    REMOVE_USER_FROM_ORG: ({ orgId }) => {
      return `${BASE_URL}organization/${orgId}/remove_user/`;
    },
    REMOVE_INVITED_USER_FROM_ORG: ({ orgId }) => {
      return `${BASE_URL}organization/${orgId}/remove_invited_user/`;
    },
    INVITE_TO_ORG: ({ orgId }) => {
      return `${BASE_URL}organization/${orgId}/invite_user/`;
    },
    ACCEPT_ORG_INVITE: ({ token }) => {
      return `${BASE_URL}invite/organization/${token}/accept_invite/`;
    },
    ORG_INVITE_DETAILS: ({ token }) => {
      return `${BASE_URL}organization/${token}/get_organization_by_key/`;
    },
    UPDATE_ORG_USER_PERMISSIONS: ({ orgId }) => {
      return `${BASE_URL}organization/${orgId}/update_user_permission/`;
    },

    USER: ({
      userId,
      authorId,
      route,
      referralCode,
      invitedBy,
      page,
      hubIds,
    }) => {
      let url = BASE_URL + "user/";

      let params = {
        querystring: {
          referral_code: referralCode,
          invited_by: invitedBy,
          author_profile: authorId,
          hub_ids: hubIds ? hubIds.join(",") : "",
          page,
        },
        rest: {
          id: userId,
          route: route,
        },
      };

      url = prepURL(url, params);

      return url;
    },
    USER_BOUNTIES: ({ userId, sort }) => {
      if (sort === "earned") {
        return BASE_URL + `user/${userId}/awarded_bounties/`;
      } else {
        return BASE_URL + `user/${userId}/awarded_bounties/`;
      }
    },
    USER_EXTERNAL_API_TOKEN: BASE_URL + "user_external_token/",
    USER_EXTERNAL_API_TOKEN_DELETE:
      BASE_URL + "user_external_token/revoke_token",
    LEADERBOARD: ({ page, limit, hubId, timeframe, type, dateOption }) => {
      let url = BASE_URL + `user/leaderboard/`;
      let params = {
        querystring: {
          page,
          limit,
          hub_id: hubId,
          timeframe,
          dateOption,
          type,
        },
      };
      url = prepURL(url, params);

      return url;
    },
    ANALYTICS_WEBSITEVIEWS: ({}) => {
      let url = BASE_URL + "analytics/websiteviews/";

      return url;
    },
    GOOGLE_LOGIN: BASE_URL + "auth/google/login/",
    GOOGLE_YOLO: BASE_URL + "auth/google/yolo/",
    ORCID_CONNECT: BASE_URL + "auth/orcid/connect/",
    RESEARCHHUB_EDITORS_BY_CONTRIBUTION: ({
      hub_id,
      order_by,
      page = 1,
      startDate,
      endDate,
    }) => {
      return prepURL(BASE_URL + "moderators/get_editors_by_contributions/", {
        querystring: { hub_id, order_by, page, startDate, endDate },
      });
    },
    RESEARCHHUB_POST: ({ created_by, post_id }) => {
      let url = BASE_URL + "researchhubpost/";
      let params = {
        querystring: {
          created_by,
          post_id,
        },
      };
      url = prepURL(url, params);
      return url;
    },
    HYPOTHESIS: ({ created_by, hypothesis_id, upsert }) => {
      let url = `${BASE_URL}hypothesis/${
        !isNullOrUndefined(hypothesis_id) ? hypothesis_id + "/" : ""
      }${upsert ? "upsert/" : ""}`;
      let params = {
        querystring: {
          created_by,
        },
      };
      url = prepURL(url, params);
      return url;
    },
    HYPOTHESIS_VOTE: ({ hypothesisID, voteType }) => {
      return BASE_URL + `hypothesis/${hypothesisID}/${voteType}/`;
    },
    CKEDITOR_TOKEN: () => {
      return `${BASE_URL}ckeditor/token/`;
    },
    NOTE: ({ noteId, orgId, orgSlug }) => {
      let url;
      if (!isNullOrUndefined(orgId)) {
        url = `${BASE_URL}organization/${orgId}/get_organization_notes/`;
      } else if (!isNullOrUndefined(noteId)) {
        url = `${BASE_URL}note/${noteId}/`;
      } else {
        url = `${BASE_URL}note/`;
      }

      if (!isNullOrUndefined(orgSlug)) {
        url = `${BASE_URL}organization/${orgSlug}/get_organization_notes/`;
      }

      return url;
    },
    NOTE_PRIVATE: ({ noteId }) => {
      return `${BASE_URL}note/${noteId}/make_private/`;
    },
    NOTE_DELETE: ({ noteId }) => {
      return `${BASE_URL}note/${noteId}/delete/`;
    },
    NOTE_CONTENT: () => {
      return `${BASE_URL}note_content/`;
    },
    NOTE_TEMPLATE: ({ orgSlug }) => {
      if (!isNullOrUndefined(orgSlug)) {
        return `${BASE_URL}organization/${orgSlug}/get_organization_templates/`;
      } else {
        return `${BASE_URL}note_template/`;
      }
    },
    NOTE_TEMPLATE_DELETE: ({ templateId }) => {
      return `${BASE_URL}note_template/${templateId}/delete/`;
    },
    GET_ACTIVE_CONTRIBUTORS_FOR_EDITORS: ({ startDate, endDate, userIds }) => {
      let url = `${BASE_URL}get_hub_active_contributors/`;

      const params = {
        querystring: {
          startDate,
          endDate,
          userIds,
        },
      };
      url = prepURL(url, params);
      return url;
    },
    NOTE_PERMISSIONS: ({ noteId, method = "GET" }) => {
      if (method === "GET") {
        return `${BASE_URL}note/${noteId}/get_note_permissions/`;
      } else if (method === "PATCH") {
        return `${BASE_URL}note/${noteId}/update_permissions/`;
      } else if (method === "DELETE") {
        return `${BASE_URL}note/${noteId}/remove_permission/`;
      }
    },
    NOTE_INVITE_USER: ({ noteId }) => {
      return `${BASE_URL}note/${noteId}/invite_user/`;
    },
    NOTE_ACCEPT_INVITE: ({ token }) => {
      return `${BASE_URL}invite/note/${token}/accept_invite/`;
    },
    NOTE_REMOVE_INVITED_USER: ({ noteId }) => {
      return `${BASE_URL}note/${noteId}/remove_invited_user/`;
    },
    NOTE_INVITED_USERS: ({ noteId }) => {
      return `${BASE_URL}note/${noteId}/get_invited_users/`;
    },
    NOTE_INVITE_DETAILS: ({ token }) => {
      return `${BASE_URL}note/${token}/get_note_by_key/`;
    },
    SIGNOUT: BASE_URL + "auth/logout/",
    SEND_RSC: () => {
      const url = BASE_URL + "transactions/send_rsc/";
      return url;
    },
    SEARCH: ({
      filters,
      config,
      page,
      size,
      // Facets specified will have their values returned
      // alongside counts in the search response.
      facets = [],
      external_source = true,
    }) => {
      let url = BASE_URL + "search/";
      let params = {
        querystring: {
          ...filters,
          page,
          size,
          external_source,
          facet: facets,
        },
        rest: {
          route: config.route,
        },
      };

      url = prepURL(url, params, "&");

      return url;
    },
    PAPER: ({
      paperId,
      search,
      page,
      filters,
      route,
      progress,
      hidePublic,
    }) => {
      let url = BASE_URL + `paper/`;
      let params = {
        filters,
        querystring: {
          search,
          page,
        },
        rest: {
          route: route,
          id: paperId,
        },
      };

      url = prepURL(url, params);

      if (!hidePublic) {
        url += "make_public=true&";
      }

      if (progress) {
        url += "created_location=progress";
      }

      return url;
    },
    PAPER_CENSOR: ({ paperId, isRemoved }) =>
      BASE_URL +
      `paper/${paperId}/${isRemoved ? "censor_paper" : "restore_paper"}/`,
    PAPER_SUBMISSION: BASE_URL + "paper_submission/",
    PAPER_SUBMISSION_WITH_DOI: BASE_URL + "paper_submission/create_from_doi/",
    AUTHOR: ({ authorId }) => {
      let url = BASE_URL + `author/${authorId}`;

      let params = {
        filters,
        querystring: {
          search,
          page,
        },
        rest: {
          route: route,
          id: authorId,
        },
      };

      url = prepURL(url, params);

      return url;
    },

    AUTHOR_ACTIVITY: ({ authorId, type = "overview" }) => {
      return `${BASE_URL}author/${authorId}/contributions/?type=${type}`;
    },

    AUTHOR_CLAIM_CASE: () => BASE_URL + `author_claim_case/`,
    AUTHOR_CLAIM_CASE_COUNT: () => BASE_URL + "author_claim_case/count/",
    AUTHOR_CLAIM_TOKEN_VALIDATION: () =>
      BASE_URL + `author_claim_case/author_claim_token_validation/`,
    AUTHOR_CLAIM_MODERATORS: ({ case_status, page }) =>
      !isNullOrUndefined(case_status)
        ? BASE_URL +
          `author_claim_case/moderator/?case_status=${case_status}&page=${
            page ?? 1
          }`
        : BASE_URL + `author_claim_case/moderator/`,
    AUTHORED_PAPER: ({ authorId, page }) => {
      let url =
        BASE_URL + `author/${authorId}/get_authored_papers/?page=${page}`;
      return url;
    },

    USER_DISCUSSION: ({ authorId, page }) => {
      let url =
        BASE_URL + `author/${authorId}/get_user_discussions/?page=${page}`;
      return url;
    },

    USER_CONTRIBUTION: ({ authorId }) => {
      let url = BASE_URL + `author/${authorId}/get_user_contributions/`;
      return url;
    },

    USER_POST: ({ authorId }) => {
      let url = BASE_URL + `author/${authorId}/get_user_posts/`;
      return url;
    },

    POST_PAPER: () => {
      let url = BASE_URL + `paper/`;

      return url;
    },

    PAPER_CHAIN: (
      documentType,
      paperId,
      documentId,
      threadId,
      commentId,
      replyId
    ) => {
      let url = buildPaperChainUrl(
        documentType,
        paperId,
        documentId,
        threadId,
        commentId,
        replyId
      );

      return url;
    },

    PERMISSIONS: () => {
      return BASE_URL + "permissions/";
    },

    DISCUSSION: ({
      filter,
      isRemoved,
      page,
      documentId,
      documentType,
      progress,
      source,
      targetId,
      twitter,
    }) => {
      // question is a post behind the scenes and hence needs to be handled as such.
      const docType = RESEARCHHUB_POST_DOCUMENT_TYPES.includes(documentType)
        ? "researchhubpost"
        : documentType;
      let url = `${BASE_URL}${docType}/${documentId}/discussion/${
        targetId != null ? targetId + "/" : ""
      }`;
      let params = {
        querystring: {
          created_location: progress ? "progress" : null,
          page,
          ordering: filter,
          source: source != null ? source : twitter ? "twitter" : "researchhub",
          is_removed: Boolean(isRemoved) ? "True" : "False",
        },
      };

      url = prepURL(url, params);

      return url;
    },

    SUMMARY: ({
      summaryId,
      route,
      progress,
      check_vote,
      proposed_by,
      proposed_by__author_profile,
      page,
    }) => {
      let url = BASE_URL + `summary/`;

      let params = {
        querystring: {
          created_location: progress ? "progress" : null,
          summary_ids: check_vote ? [summaryId] : null,
          proposed_by,
          proposed_by__author_profile,
          page,
        },
        rest: {
          route: route,
          id: !check_vote ? summaryId : null,
        },
      };

      return (url = prepURL(url, params));
    },

    FIRST_SUMMARY: () => {
      let url = BASE_URL + `summary/first/`;

      return url;
    },

    THREAD: (documentType, paperId, documentId, threadId) => {
      const docType = RESEARCHHUB_POST_DOCUMENT_TYPES.includes(documentType)
        ? "researchhubpost"
        : documentType;
      let url =
        `${BASE_URL}${docType}/` +
        (paperId != null ? `${paperId}` : `${documentId}`) +
        `/discussion/${threadId}/`;

      return url;
    },

    GET_EDITS: ({ paperId, page = 1 }) => {
      let url = BASE_URL + `summary/`;

      let params = {
        querystring: {
          page,
          paperId: paperId,
        },
        rest: {
          route: "get_edit_history",
        },
      };

      url = prepURL(url, params);

      return url;
    },

    THREAD_COMMENT: (documentType, paperId, documentId, threadId, page) => {
      // question is a post behind the scenes and hence needs to be handled as such.
      const docType = RESEARCHHUB_POST_DOCUMENT_TYPES.includes(documentType)
        ? "researchhubpost"
        : documentType;
      let url =
        `${BASE_URL}${docType}/` +
        (paperId != null ? `${paperId}` : `${documentId}`) +
        `/discussion/${threadId}/comment/`;

      if (typeof page === "number") {
        url += `?page=${page}`;
      }

      return url;
    },

    THREAD_COMMENT_REPLY: (
      documentType,
      paperId,
      documentId,
      threadId,
      commentId,
      page
    ) => {
      // question is a post behind the scenes and hence needs to be handled as such.
      const docType = RESEARCHHUB_POST_DOCUMENT_TYPES.includes(documentType)
        ? "researchhubpost"
        : documentType;
      let url =
        `${BASE_URL}${docType}/` +
        (paperId != null ? `${paperId}` : `${documentId}`) +
        `/discussion/${threadId}/comment/${commentId}/reply/`;

      if (typeof page === "number") {
        url += `?page=${page}`;
      }

      return url;
    },

    AUTHOR: ({ authorId, search, excludeIds }) => {
      let url = BASE_URL + `author/`;

      if (authorId) {
        url += `${authorId}/?`;
      } else {
        url += "?";
      }

      if (search) {
        url += `search=${search}&`;
      }

      if (excludeIds && excludeIds.length > 0) {
        let ids = excludeIds.join(",");
        url += `id__ne=${ids}&`;
      }

      return url;
    },

    HUB: ({ hubId, search, name, slug, ordering, page }) => {
      let url = BASE_URL + `hub/`;

      if (hubId) {
        url += `${hubId}/?`;
      } else {
        url += "?";
      }

      if (name) {
        url += `name__iexact=${name}&`;
      }

      if (slug) {
        url += `slug=${encodeURIComponent(slug)}&`;
      }

      if (search) {
        url += `name__fuzzy=${search}&`;
      }

      if (ordering) {
        url += `ordering=${ordering}&`;
      }

      if (page) {
        url += `page=${page}&`;
      }

      return url;
    },
    HUB_NEW_EDITOR: BASE_URL + "hub/create_new_editor/",
    HUB_DELETE_EDITOR: BASE_URL + "hub/delete_editor/",
    HUBS_BY_CONTRIBUTION: (params) =>
      prepURL(BASE_URL + "hub/by_contributions/", {
        querystring: params,
      }),
    SORTED_HUB: (params = {}) => {
      let url = BASE_URL + `hub/?ordering=-paper_count,-discussion_count,id`;

      return url;
    },
    GET_HUB_CATEGORIES: () => {
      return BASE_URL + `hub_category/`;
    },
    GET_HUB_PAPERS: ({
      hubId,
      timePeriod,
      ordering,
      page = 1,
      slug,
      subscribedHubs,
      externalSource,
    }) => {
      let url = BASE_URL + `paper/get_hub_papers/`;
      let params = {
        querystring: {
          page,
          slug,
          start_date__gte: timePeriod.start,
          end_date__lte: timePeriod.end,
          ordering,
          hub_id: hubId,
          subscribed_hubs: subscribedHubs,
          external_source: externalSource,
        },
      };
      url = prepURL(url, params);

      return url;
    },
    GET_UNIFIED_DOCS: ({
      externalSource,
      hubId,
      page = 1,
      slug,
      selectedFilters,
    }) => {
      const backendFilters = convertToBackendFilters({
        frontendFilters: selectedFilters,
        hubId,
      });

      const HOME_HUB = 0;
      const isHomeHub = !hubId || hubId === HOME_HUB;
      const hasTags = (backendFilters.tags ?? []).length > 0;

      const url =
        BASE_URL + "researchhub_unified_document/get_unified_documents/";
      const params = {
        querystring: {
          external_source: externalSource,
          hub_id: hubId,
          page,
          slug,
          ordering: backendFilters.sort,
          time: backendFilters.time,
          type: backendFilters.type,
          ...(hasTags && { tags: backendFilters.tags }),
          ...(backendFilters.topLevel === "/my-hubs" && {
            subscribed_hubs: true,
          }),
          ...(isHomeHub && { ignore_excluded_homepage: true }),
        },
      };

      if (backendFilters.type === "bounty") {
        params.querystring.tags = "open";
      }

      const finalUrl = prepURL(url, params);
      return finalUrl;
    },
    UNIFIED_DOC: ({ id }) => {
      const url = BASE_URL + "researchhub_unified_document/";
      const params = {
        querystring: {},
        rest: {
          id: id,
        },
      };
      return prepURL(url, params);
    },
    HUB_SUBSCRIBE: ({ hubId }) => BASE_URL + `hub/${hubId}/subscribe/`,
    HUB_UNSUBSCRIBE: ({ hubId }) => BASE_URL + `hub/${hubId}/unsubscribe/`,
    INVITE_TO_HUB: ({ hubId }) => {
      let url = BASE_URL + `hub/${hubId}/invite_to_hub/`;
      return url;
    },

    USER_VOTE: ({
      paperId,
      threadId,
      commentId,
      replyId,
      documentType,
      documentId,
    }) => {
      let url = buildPaperChainUrl(
        documentType,
        paperId,
        documentId,
        threadId,
        commentId,
        replyId
      );

      return url + "user_vote/";
    },
    RH_POST_UPVOTE: (postId) => {
      // New post types, such as Question
      return `${BASE_URL}researchhubpost/${postId}/upvote/`;
    },
    RH_POST_DOWNVOTE: (postId) => {
      // New post types, such as Question
      return `${BASE_URL}researchhubpost/${postId}/downvote/`;
    },
    UPVOTE: (
      documentType,
      paperId,
      documentId,
      threadId,
      commentId,
      replyId
    ) => {
      let url = buildPaperChainUrl(
        documentType,
        paperId,
        documentId,
        threadId,
        commentId,
        replyId
      );

      return url + "upvote/";
    },

    NEUTRAL_VOTE: (
      documentType,
      paperId,
      documentId,
      threadId,
      commentId,
      replyId
    ) => {
      let url = buildPaperChainUrl(
        documentType,
        paperId,
        documentId,
        threadId,
        commentId,
        replyId
      );

      return url + "neutralvote/";
    },

    DOWNVOTE: (
      documentType,
      paperId,
      documentId,
      threadId,
      commentId,
      replyId
    ) => {
      let url = buildPaperChainUrl(
        documentType,
        paperId,
        documentId,
        threadId,
        commentId,
        replyId
      );

      return url + "downvote/";
    },
    UNIVERSITY: ({ search }) => {
      let url = BASE_URL + `university/`;

      if (search) {
        url += `?search=${search}`;
      }

      return url;
    },
    MAJOR: ({ search }) => {
      let url = BASE_URL + `major/`;

      if (search) {
        url += `?search=${search}`;
      }

      return url;
    },
    NEW_FEATURE: ({ route, feature }) => {
      let url = BASE_URL + "new_feature_release/";
      let params = {
        querystring: {
          feature,
        },
        rest: {
          route: route,
        },
      };
      url = prepURL(url, params);
      return url;
    },
    EMAIL_PREFERENCE: ({ update_or_create, emailRecipientId }) => {
      let url = BASE_URL + "email_recipient/";

      if (update_or_create) {
        url += "update_or_create_email_preference/";
      } else if (emailRecipientId) {
        url += `${emailRecipientId}/subscriptions/`;
      }

      return url;
    },
    // Used to check if url is a valid pdf
    CHECKURL: BASE_URL + "paper/check_url/",
    GET_LIVE_FEED: ({ hubId, page = 1, filter }) => {
      let url = BASE_URL + `hub/`;
      if (!isNullOrUndefined(hubId)) {
        url += `${hubId}/latest_actions/?page=${page}`;
      }
      if (!isNullOrUndefined(filter) && typeof filter === "string") {
        url += `&ordering=${filter}`;
      }
      return url;
    },
    GET_CSL_ITEM: BASE_URL + "paper/get_csl_item/",
    SEARCH_BY_URL: BASE_URL + "paper/search_by_url/",
    USER_VERIFICATION: ({ route }) => {
      let url = BASE_URL + "user_verification/";

      let params = {
        querystring: {},
        rest: {
          route: route,
        },
      };
      url = prepURL(url, params);
      return url;
    },
    REFERRED_USERS: () => {
      const url = BASE_URL + `user/get_referred_users/`;
      return url;
    },
    SHOW_REFERRALS: () => {
      const url = BASE_URL + `user/get_referral_reputation/`;
      return url;
    },
    SEND_REFERRAL_INVITE: () => {
      return BASE_URL + `referral/`;
    },
    TRANSACTIONS: ({ transactionId, page }) => {
      let url = BASE_URL + "transactions/";

      if (page && typeof page === "number") {
        url += `?page=${page}`;
      }

      if (transactionId) {
        url += `${transactionId}/`;
      }

      return url;
    },
    // Ethereum
    WITHDRAW_COIN: ({ transactionId, page }) => {
      let url = BASE_URL + "withdrawal/";

      if (page && typeof page === "number") {
        url += `?page=${page}`;
      }

      if (transactionId) {
        url += `${transactionId}/`;
      }

      return url;
    },
    WITHDRAWAL_FEE: BASE_URL + "withdrawal/transaction_fee/",
    TRANSFER: BASE_URL + "deposit/start_deposit_rsc/",
    USER_FIRST_COIN: BASE_URL + "user/has_seen_first_coin_modal/",
    USER_ORCID_CONNECT_MODAL: BASE_URL + "user/has_seen_orcid_connect_modal/",
    FLAG_PAPER: ({ paperId }) => {
      let url = BASE_URL + "paper/";

      if (paperId !== undefined && paperId !== null) {
        url += `${paperId}/flag/`;
      }

      return url;
    },
    FLAG_POST: ({
      documentType,
      paperId,
      threadId,
      commentId,
      replyId,
      documentId,
    }) => {
      let url = buildPaperChainUrl(
        documentType,
        paperId,
        documentId,
        threadId,
        commentId,
        replyId
      );

      return url + "flag/";
    },
    CENSOR_PAPER: ({ paperId }) => {
      return BASE_URL + `paper/${paperId}/censor/`;
    },
    CENSOR_PAPER_PDF: ({ paperId }) => {
      return BASE_URL + `paper/${paperId}/censor_pdf/`;
    },
    CENSOR_POST: ({
      documentType,
      paperId,
      threadId,
      commentId,
      replyId,
      documentId,
    }) => {
      let url = buildPaperChainUrl(
        documentType,
        paperId,
        documentId,
        threadId,
        commentId,
        replyId
      );

      return url + "censor/";
    },
    CENSOR_DOC: ({ documentId }) => {
      return `${BASE_URL}researchhub_unified_document/${documentId}/censor/`;
    },
    RESTORE_DOC: ({ documentId }) => {
      return `${BASE_URL}researchhub_unified_document/${documentId}/restore/`;
    },
    CENSOR_HUB: ({ hubId }) => {
      return BASE_URL + `hub/${hubId}/censor/`;
    },

    BULLET_POINT: ({ paperId, ordinal__isnull, type, progress }) => {
      let url = BASE_URL + `paper/${paperId}/bullet_point/`;
      let params = {
        querystring: {
          ordinal__isnull,
        },
      };
      if (type !== undefined || type !== null) {
        if (typeof type === "string") {
          params.filters = [
            {
              name: "bullet",
              filter: "type",
              value: type,
            },
          ];
        }
      }

      url = prepURL(url, params);

      if (progress) {
        url += "created_location=progress";
      }

      return url;
    },

    EDIT_BULLET_POINT: ({ paperId, bulletId }) => {
      let url = BASE_URL + `paper/${paperId}/bullet_point/${bulletId}/edit/`;
      return url;
    },
    KEY_TAKEAWAY: ({ bulletId = null, route, querystring = {} }) => {
      let url = BASE_URL + `bullet_point/`;

      let params = {
        querystring,
        rest: {
          route: route,
          id: bulletId,
        },
      };

      return (url = prepURL(url, params));
    },
    NOTIFICATION: ({ notifId, ids }) => {
      let url = BASE_URL + `notification/`;

      if (!doesNotExist(notifId)) {
        url += `${notifId}/`;
      }

      if (!doesNotExist(ids)) {
        url += `mark_read/`;
      }

      return url;
    },
    FIGURES: ({ paperId, route }) => {
      let url = BASE_URL + `figure/`;

      let params = {
        querystring: {},
        rest: {
          route: route,
          id: paperId,
        },
      };

      url = prepURL(url, params);

      return url;
    },
    GET_PAPER_FIGURES: ({ paperId }) => {
      return BASE_URL + `figure/${paperId}/get_all_figures/`;
    },
    GET_PAPER_FIGURES_ONLY: ({ paperId }) => {
      return BASE_URL + `figure/${paperId}/get_regular_figures/`;
    },
    ADD_FIGURE: ({ paperId, progress }) => {
      let url = BASE_URL + `figure/${paperId}/add_figure/`;

      if (progress) {
        url += `?created_location=progress`;
      }

      return url;
    },
    DELETE_FIGURE: ({ figureId }) => {
      return BASE_URL + `figure/${figureId}/delete_figure`;
    },
    PAPER_FILES: ({ paperId }) => {
      return BASE_URL + `paper/${paperId}/additional_file/`;
    },
    GATEKEEPER_CURRENT_USER: ({ type }) =>
      BASE_URL + `gatekeeper/check_current_user/?type=${type}`,
    GOOGLE_ANALYTICS: ({ ignorePaper, ignoreUser, manual }) => {
      let url = BASE_URL + "events/forward_event/";
      if (ignorePaper) {
        url += "?ignore_paper=true&";
      }
      if (ignoreUser && !ignorePaper) {
        url += "?ignore_user=true&";
      } else if (ignoreUser && ignorePaper) {
        url += "ignore_user=true&";
      }
      if (manual) {
        url += "?manual=true";
      }

      return url;
    },
    AMP_ANALYTICS: BASE_URL + "events/amplitude/forward_event/",
    PROMOTION_STATS: ({ paperId, interaction, route }) => {
      let url = BASE_URL + "events/paper/";

      if (!doesNotExist(paperId)) {
        url += `?paper=${paperId}&ordering=-created_date&paper_is_boosted=True&interaction=${interaction}`;
      } else {
        let params = {
          querystring: {},
          rest: {
            route: route,
          },
        };

        return (url = prepURL(url, params));
      }

      return url;
    },
    PROMOTE: BASE_URL + "purchase/",
    PROMOTION: ({ purchaseId }) => {
      let url = BASE_URL + `purchase/${purchaseId}/`;
      return url;
    },
    PROMOTION_TRANSACTIONS: ({ userId }) => {
      let url = BASE_URL + `purchase/${userId}/user_transactions/`;
      return url;
    },
    AGGREGATE_USER_PROMOTIONS: ({ userId }) =>
      BASE_URL + `purchase/${userId}/aggregate_user_promotions/`,
    SAVE_IMAGE: BASE_URL + "paper/discussion/file/",
    CAPTCHA_VERIFY: BASE_URL + "auth/captcha_verify/",
    CHECK_USER_VOTE: ({ paperIds = null }) => {
      let url = BASE_URL + "paper/check_user_vote/";
      let query;
      if (paperIds && paperIds.length) {
        query = `?paper_ids=`;

        paperIds.forEach((id, i) => {
          query += id;
          if (i < paperIds.length - 1) {
            query += ",";
          }
        });
      }
      return url + query;
    },

    CHECK_USER_VOTE_DOCUMENTS: ({
      hypothesisIds = [],
      paperIds = [],
      postIds = [],
    }) => {
      // NOTE: calvinhlee - this is a terrible way to handle vote. There has to be a better way
      const url = BASE_URL + "researchhub_unified_document/check_user_vote/";
      let query = null;
      if (paperIds.length > 0) {
        query = `?paper_ids=`;
        query += paperIds.join(",");
      }
      if (postIds.length > 0) {
        Boolean(query) ? (query += `&post_ids=`) : (query = `?post_ids=`);
        query += postIds.join(",");
      }
      if (hypothesisIds.length > 0) {
        Boolean(query)
          ? (query += `&hypothesis_ids=`)
          : (query = `?hypothesis_ids=`);
        query += hypothesisIds.join(",");
      }
      return url + query;
    },

    SUPPORT: BASE_URL + "support/",

    PEER_REVIEW_REQUESTS: () => {
      return BASE_URL + "peer_review_requests/";
    },
    PEER_REVIEW_INVITE_REVIEWER: () => {
      return BASE_URL + "peer_review_invites/invite/";
    },
    REVIEW: ({ unifiedDocumentId, reviewId }) => {
      if (reviewId) {
        return (
          BASE_URL +
          `researchhub_unified_document/${unifiedDocumentId}/review/${reviewId}/`
        );
      } else {
        return (
          BASE_URL + `researchhub_unified_document/${unifiedDocumentId}/review/`
        );
      }
    },

    buildPaperChainUrl: buildPaperChainUrl,
    BASE_URL,
  };

  function buildPaperChainUrl(
    documentType,
    paperId,
    documentId,
    threadId,
    commentId,
    replyId
  ) {
    const docType = RESEARCHHUB_POST_DOCUMENT_TYPES.includes(documentType)
      ? "researchhubpost"
      : documentType;
    let url =
      `${BASE_URL}${docType}/` +
      (paperId != null ? `${paperId}` : `${documentId}`) +
      `/`;

    if (!doesNotExist(threadId)) {
      url += `discussion/${threadId}/`;
      if (!doesNotExist(commentId)) {
        url += `comment/${commentId}/`;
        if (!doesNotExist(replyId)) {
          url += `reply/${replyId}/`;
        }
      }
    }

    return url;
  }
};

const api = API({
  authTokenName: AUTH_TOKEN,
  apiRoot,
  routes,
});

export default api;

export const generateApiUrl = (url, queryparams) => {
  return `${api.BASE_URL}${url}/${queryparams ? queryparams : ""}`;
};

export const buildQueryString = (queryObj) => {
  return Object.keys(queryObj).reduce(
    (str, key) => str + (str === "" ? "?" : "&") + key + "=" + queryObj[key],
    ""
  );
};

export const buildQuerystringListParam = ({ delimiter, list = [] }) => {
  const regex = new RegExp(delimiter + "$");
  return list
    .reduce((str, cur) => str + "model=" + cur + delimiter, "")
    .replace(regex, "");
};
