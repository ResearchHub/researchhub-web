import { API } from "@quantfive/js-web-config";

import { AUTH_TOKEN } from "../config/constants";
import { doesNotExist } from "~/config/utils";

const apiRoot = {
  production: "backend.researchhub.com",
  staging: "localhost:8000",
  dev: "localhost:8000",
  //dev: 'https://staging.solestage.com/api/',
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
    GOOGLE_LOGIN: BASE_URL + "auth/google/login/",
    SIGNOUT: BASE_URL + "auth/logout/",
    PAPER: ({ paperId, search, page }) => {
      let url = BASE_URL + `paper/`;

      if (paperId) {
        url += `${paperId}/?`;
      } else {
        url += "?";
      }

      if (search) {
        url += `search=${search}&`;
      }

      if (typeof page === "number") {
        url += `page=${page}`;
      }

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

    DISCUSSION: (paperId) => {
      let url = `${BASE_URL}paper/${paperId}/discussion/`;

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

    HUB: ({ hubId, search }) => {
      let url = BASE_URL + `hub/`;

      if (hubId) {
        url += `${hubId}/?`;
      } else {
        url += "?";
      }

      if (search) {
        url += `search=${search}`;
      }

      return url;
    },
    HUB_SUBSCRIBE: ({ hubId }) => BASE_URL + `hub/${hubId}/subscribe/`,
    HUB_UNSUBSCRIBE: ({ hubId }) => BASE_URL + `hub/${hubId}/unsubscribe/`,
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
