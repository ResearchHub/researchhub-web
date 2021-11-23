import { API } from "@quantfive/js-web-config";

import { AUTH_TOKEN } from "../config/constants";
import { isNullOrUndefined, doesNotExist } from "~/config/utils/nullchecks";

const apiRoot = {
  production: "backend.researchhub.com",
  staging: "staging-backend.researchhub.com",
  dev: "localhost:8000",
  // dev: "staging-backend.researchhub.com",
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

/**
 * Function to prep the URL for querystring / url
 * @param { String } url -- the URL we want to manipulate
 * @param { Object } params -- params for querystring
 * @param { String } arrayParamSeparator -- seperator for array values
 */
const prepURL = (url, params, arrayParamSeparator = ",") => {
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

  return url;
};

const routes = (BASE_URL) => {
  return {
    BASE_URL,
    CITATIONS: ({ citationID, hypothesisID }, requestType) => {
      if (requestType === "get") {
        return !isNullOrUndefined(citationID)
          ? BASE_URL + `citation/${citationID}`
          : BASE_URL + `hypothesis/${hypothesisID}/get_citations/`;
      } else if (requestType === "post") {
        return BASE_URL + `citation/`;
      }
    },
    CITATIONS_VOTE: ({ citationID, voteType }) => {
      return BASE_URL + `citation/${citationID}/${voteType}/`;
    },
    ORGANIZATION: ({ userId, orgId, orgSlug }) => {
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
          route: userId ? "get_user_organizations" : null,
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
    RESEARCHHUB_POSTS: ({ created_by, post_id }) => {
      let url = BASE_URL + "researchhub_posts/";
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
    JUPYTER: ({ noteId }) => {
      return `${BASE_URL}jupyter_session/${noteId}/get_jupyterhub_file/`;
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

    AUTHOR_CLAIM_CASE: () => BASE_URL + `author_claim_case/`,
    AUTHOR_CLAIM_TOKEN_VALIDATION: () =>
      BASE_URL + `author_claim_token_validation/`,
    MODERATORS_AUTHOR_CLAIM: ({ case_status }) =>
      !isNullOrUndefined(case_status)
        ? BASE_URL + `moderators/author_claim_case/?case_status=${case_status}`
        : BASE_URL + `moderators/author_claim_case/`,
    MODERATORS_AUTHOR_CLAIM_CASE_COUNT: () =>
      BASE_URL + "moderators/author_claim_case/counts/",
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
      let url = `${BASE_URL}${documentType}/${documentId}/discussion/${
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
      let url =
        `${BASE_URL}${documentType}/` +
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
      let url =
        `${BASE_URL}${documentType}/` +
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
      let url =
        `${BASE_URL}${documentType}/` +
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

    HUB: ({ hubId, search, name, pageLimit, slug }) => {
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
        url += `slug=${encodeURIComponent(slug)}`;
      }

      if (search) {
        url += `name__fuzzy=${search}&`;
      }

      if (!doesNotExist(pageLimit)) {
        url += `page_limit=${pageLimit}&`;
      }

      return url;
    },
    SORTED_HUB: (params = {}) => {
      // hard codedlimit to 10
      let url = BASE_URL + `hub/?ordering=-score&page_limit=10`;

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
      ordering,
      page = 1,
      slug,
      subscribedHubs,
      timePeriod,
      type, // docType
    }) => {
      const url =
        BASE_URL + "researchhub_unified_documents/get_unified_documents/";
      const params = {
        querystring: {
          end_date__lte: timePeriod.end,
          external_source: externalSource,
          hub_id: hubId,
          ordering,
          page,
          slug,
          start_date__gte: timePeriod.start,
          subscribed_hubs: subscribedHubs,
          type,
        },
      };
      return prepURL(url, params);
    },
    UNIFIED_DOC: ({ id }) => {
      const url = BASE_URL + "researchhub_unified_documents/";
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

    USER_VOTE: (paperId, threadId, commentId, replyId) => {
      let url = buildPaperChainUrl(paperId, null, threadId, commentId, replyId);

      return url + "user_vote/";
    },
    RH_POST_UPVOTE: (postId) => {
      // New post types, such as Question
      return `${BASE_URL}researchhub_posts/${postId}/upvote/`;
    },
    RH_POST_DOWNVOTE: (postId) => {
      // New post types, such as Question
      return `${BASE_URL}researchhub_posts/${postId}/downvote/`;
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
    TRANSFER: BASE_URL + "transfer/",
    USER_FIRST_COIN: BASE_URL + "user/has_seen_first_coin_modal/",
    USER_ORCID_CONNECT_MODAL: BASE_URL + "user/has_seen_orcid_connect_modal/",
    FLAG_PAPER: ({ paperId }) => {
      let url = BASE_URL + "paper/";

      if (paperId !== undefined && paperId !== null) {
        url += `${paperId}/flag/`;
      }

      return url;
    },
    FLAG_POST: ({ paperId, threadId, commentId, replyId, postId }) => {
      let url = buildPaperChainUrl(
        paperId,
        postId,
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
      const url = BASE_URL + "researchhub_unified_documents/check_user_vote/";
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
  };

  function buildPaperChainUrl(
    documentType,
    paperId,
    documentId,
    threadId,
    commentId,
    replyId
  ) {
    let url =
      `${BASE_URL}${documentType}/` +
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
