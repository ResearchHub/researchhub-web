import { API } from "@quantfive/js-web-config";

import { AUTH_TOKEN } from "../config/constants";
import { doesNotExist } from "~/config/utils";

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
 */
const prepURL = (url, params) => {
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
      qs += `${currentKey}=${value}&`;
    }
  }

  url += qs;

  url += prepFilters(filters);

  return url;
};

const routes = (BASE_URL) => {
  return {
    USER: ({ userId }) => {
      let url = BASE_URL + "user/";

      if (userId) {
        url += `${userId}/`;
      }

      return url;
    },
    LEADERBOARD: ({ page, limit, hubId }) => {
      let url = BASE_URL + `user/leaderboard/`;
      let params = {
        querystring: {
          page,
          limit,
          hub_id: hubId,
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
    ORCID_CONNECT: BASE_URL + "auth/orcid/connect/",
    SIGNOUT: BASE_URL + "auth/logout/",
    SEARCH: ({ search, config, page, size, external_search = true }) => {
      let url = BASE_URL + "search/";
      let params = {
        querystring: {
          search,
          page,
          size,
          external_search,
        },
        rest: {
          route: config.route,
        },
      };
      url = prepURL(url, params);

      return url;
    },
    PAPER: ({ paperId, search, page, filters, highlights, route }) => {
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

      if (highlights) {
        for (let i = 0; i < highlights.length; i++) {
          url += `highlight=${highlights[i]}&`;
        }
      }

      url += "make_public=true&";
      return url;
    },

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

    USER_CONTRIBUTION: ({
      authorId,
      commentOffset,
      replyOffset,
      paperUploadOffset,
    }) => {
      let url =
        BASE_URL +
        `author/${authorId}/get_user_contributions/?commentOffset=${commentOffset}&replyOffset=${replyOffset}&paperUploadOffset=${paperUploadOffset}`;
      return url;
    },

    POST_PAPER: () => {
      let url = BASE_URL + `paper/`;

      return url;
    },

    PAPER_CHAIN: (paperId, threadId, commentId, replyId) => {
      let url = buildPaperChainUrl(paperId, threadId, commentId, replyId);

      return url;
    },

    PERMISSIONS: () => {
      return BASE_URL + "permissions/";
    },

    DISCUSSION: (paperId, filter, page) => {
      let url = `${BASE_URL}paper/${paperId}/discussion/`;

      if (typeof page === "number") {
        url += `?page=${page}`;
      }

      if (filter !== undefined || filter !== null) {
        if (typeof filter === "string") {
          url += `&ordering=${filter}`;
        }
      }

      return url;
    },

    SUMMARY: ({ summaryId }) => {
      let url = BASE_URL + `summary/`;

      if (summaryId) {
        url += `${summaryId}/?`;
      } else {
        url += "?";
      }

      return url;
    },

    FIRST_SUMMARY: () => {
      let url = BASE_URL + `summary/first/`;

      return url;
    },

    THREAD: (paperId, threadId) => {
      let url = `${BASE_URL}paper/${paperId}/discussion/${threadId}/`;

      return url;
    },

    GET_EDITS: ({ paperId }) => {
      let url = BASE_URL + `summary/get_edit_history/?paperId=${paperId}`;
      return url;
    },

    THREAD_COMMENT: (paperId, threadId, page) => {
      let url = `${BASE_URL}paper/${paperId}/discussion/${threadId}/comment/`;

      if (typeof page === "number") {
        url += `?page=${page}`;
      }

      return url;
    },

    THREAD_COMMENT_REPLY: (paperId, threadId, commentId, page) => {
      let url = `${BASE_URL}paper/${paperId}/discussion/${threadId}/comment/${commentId}/reply/`;

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
        url += `search=${search}&`;
      }

      if (!doesNotExist(pageLimit)) {
        url += `page_limit=${pageLimit}&`;
      }

      return url;
    },
    SORTED_HUB: ({ filter }) => {
      // hard codedlimit to 10
      let url = BASE_URL + `hub/?ordering=-score&page_limit=10`;

      // if (filter !== undefined || filter !== null) {
      //   if (typeof filter === "string") {
      //     url += `&ordering=${filter}`;
      //   }
      // }

      return url;
    },
    GET_HUB_PAPERS: ({ hubId, timePeriod, ordering, page = 1 }) => {
      let url = BASE_URL + `paper/get_hub_papers/`;
      let params = {
        querystring: {
          page,
          start_date__gte: timePeriod.start,
          end_date__lte: timePeriod.end,
          ordering,
          hub_id: hubId,
        },
      };
      url = prepURL(url, params);

      return url;
    },
    HUB_SUBSCRIBE: ({ hubId }) => BASE_URL + `hub/${hubId}/subscribe/`,
    HUB_UNSUBSCRIBE: ({ hubId }) => BASE_URL + `hub/${hubId}/unsubscribe/`,
    INVITE_TO_HUB: ({ hubId }) => {
      let url = BASE_URL + `hub/${hubId}/invite_to_hub/`;
      return url;
    },

    USER_VOTE: (paperId, threadId, commentId, replyId) => {
      let url = buildPaperChainUrl(paperId, threadId, commentId, replyId);

      return url + "user_vote/";
    },

    UPVOTE: (paperId, threadId, commentId, replyId) => {
      let url = buildPaperChainUrl(paperId, threadId, commentId, replyId);

      return url + "upvote/";
    },

    DOWNVOTE: (paperId, threadId, commentId, replyId) => {
      let url = buildPaperChainUrl(paperId, threadId, commentId, replyId);

      return url + "downvote/";
    },
    UNIVERSITY: ({ search }) => {
      let url = BASE_URL + `university/`;

      if (search) {
        url += `?search=${search}`;
      }

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

      if (hubId !== undefined && hubId !== null) {
        url += `${hubId}/latest_actions/?page=${page}`;
      }

      if (filter !== undefined || filter !== null) {
        if (typeof filter === "string") {
          url += `&ordering=${filter}`;
        }
      }

      return url;
    },
    GET_CSL_ITEM: BASE_URL + "paper/get_csl_item/",
    SEARCH_BY_URL: BASE_URL + "paper/search_by_url/",
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
    USER_FIRST_COIN: BASE_URL + "user/has_seen_first_coin_modal/",
    USER_ORCID_CONNECT_MODAL: BASE_URL + "user/has_seen_orcid_connect_modal/",
    FLAG_PAPER: ({ paperId }) => {
      let url = BASE_URL + "paper/";

      if (paperId !== undefined && paperId !== null) {
        url += `${paperId}/flag/`;
      }

      return url;
    },
    FLAG_POST: ({ paperId, threadId, commentId, replyId }) => {
      let url = buildPaperChainUrl(paperId, threadId, commentId, replyId);

      return url + "flag/";
    },
    CENSOR_PAPER: ({ paperId }) => {
      return BASE_URL + `paper/${paperId}/censor/`;
    },
    CENSOR_PAPER_PDF: ({ paperId }) => {
      return BASE_URL + `paper/${paperId}/censor_pdf/`;
    },
    CENSOR_POST: ({ paperId, threadId, commentId, replyId }) => {
      let url = buildPaperChainUrl(paperId, threadId, commentId, replyId);

      return url + "censor/";
    },
    BULLET_POINT: ({ paperId, ordinal__isnull, type }) => {
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
      return url;
    },
    EDIT_BULLET_POINT: ({ paperId, bulletId }) => {
      let url = BASE_URL + `paper/${paperId}/bullet_point/${bulletId}/edit/`;
      return url;
    },
    REORDER_BULLETS: () => {
      return BASE_URL + `bullet_point/reorder_all/`;
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
      // return BASE_URL + `notification/${userId}`
    },
    GET_PAPER_FIGURES: ({ paperId }) => {
      return BASE_URL + `figure/${paperId}/get_all_figures/`;
    },
    GET_PAPER_FIGURES_ONLY: ({ paperId }) => {
      return BASE_URL + `figure/${paperId}/get_regular_figures/`;
    },
    ADD_FIGURE: ({ paperId }) => {
      return BASE_URL + `figure/${paperId}/add_figure/`;
    },
    MAKE_PAPER_PUBLIC: ({ paperId }) => {
      return BASE_URL + `paper/${paperId}/?make_public=true/`;
    },
    PAPER_FILES: ({ paperId }) => {
      return BASE_URL + `paper/${paperId}/additional_file/`;
    },
    GOOGLE_ANALYTICS: () => {
      return BASE_URL + "google_analytics/forward_event/";
    },
  };

  function buildPaperChainUrl(paperId, threadId, commentId, replyId) {
    let url = `${BASE_URL}paper/${paperId}/`;

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

export default API({
  authTokenName: AUTH_TOKEN,
  apiRoot,
  routes,
});
