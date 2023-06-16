import {
  ID,
  RHUser,
  RhDocumentType,
  parseUser,
} from "~/config/types/root_types";
import { Comment, parseComment, COMMENT_TYPES } from "./types";
import API, { generateApiUrl, buildQueryString } from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import config from "./config";
import { sortOpts } from "./options";
import { parseVote, Vote } from "~/config/types/vote";
import uniqBy from "lodash/uniqBy";

export const fetchCommentsAPI = async ({
  documentType,
  documentId,
  sort = sortOpts[0].value,
  filter,
  page,
}: {
  documentType: RhDocumentType;
  documentId: ID;
  sort?: string | null;
  filter?: string | null;
  page?: number;
}): Promise<{ comments: any[]; count: number }> => {
  const query = {
    ...(filter && { filtering: filter }),
    ...(sort && { ordering: sort }),
    ...(page && page > 1 && { page: page }),
    child_count: config.feed.childPageSize,
    page_size: config.feed.rootLevelPageSize,
    ascending: "FALSE",
  };

  const baseFetchUrl = generateApiUrl(`${documentType}/${documentId}/comments`);
  const url = baseFetchUrl + buildQueryString(query);
  const response = await fetch(url, API.GET_CONFIG()).then((res): any =>
    Helpers.parseJSON(res)
  );

  if (response?.detail) {
    // FIXME: Log to sentry
    throw Error(response.detail);
  } else if (!response?.results) {
    // FIXME: Log to sentry
    throw Error("Unexpected error fetching more comments");
  }

  return {
    comments: response.results,
    count: response.count,
  };
};

export const fetchSingleCommentAPI = async ({
  commentId,
  documentType,
  documentId,
  parentComment,
  childOffset = 0,
  sort = sortOpts[0].value,
  filter,
}: {
  commentId: ID;
  documentType: RhDocumentType;
  documentId: ID;
  parentComment?: Comment;
  childOffset: number;
  sort?: string | null;
  filter?: string | null;
}): Promise<Comment> => {
  const query = {
    ...(filter && { filtering: filter }),
    ...(sort && { ordering: sort }),
    child_count: config.feed.repliesPageSize,
    child_offset: childOffset,
    ascending: "FALSE",
  };

  const baseFetchUrl = generateApiUrl(
    `${documentType}/${documentId}/comments` +
      (commentId ? `/${commentId}` : "")
  );
  const url = baseFetchUrl + buildQueryString(query);
  const response = await fetch(url, API.GET_CONFIG()).then((res): any =>
    Helpers.parseJSON(res)
  );

  if (response.detail) {
    // FIXME: Log to sentry
    throw Error(response.detail);
  } else if (!response) {
    // FIXME: Log to sentry
    throw Error(`Unexpected error fetching comment ${commentId}`);
  }

  return parseComment({ raw: response, parent: parentComment });
};

export const createCommentAPI = async ({
  content,
  commentType = COMMENT_TYPES.DISCUSSION,
  documentType,
  documentId,
  parentComment,
  bountyAmount,
  mentions = [],
}: {
  content: any;
  commentType?: COMMENT_TYPES;
  documentType: RhDocumentType;
  documentId: ID;
  parentComment?: Comment;
  bountyAmount?: number;
  mentions?: Array<string>;
}): Promise<Comment> => {
  const _url = generateApiUrl(
    `${documentType}/${documentId}/comments/` +
      (bountyAmount ? "create_comment_with_bounty" : "create_rh_comment")
  );
  const response = await fetch(
    _url,
    API.POST_CONFIG({
      comment_content_json: content,
      thread_type: commentType,
      mentions: uniqBy(mentions),
      ...(parentComment && { parent_id: parentComment.id }),
      ...(bountyAmount && { amount: bountyAmount }),
    })
  ).then((res): any => Helpers.parseJSON(res));

  const comment = parseComment({ raw: response, parent: parentComment });
  return Promise.resolve(comment);
};

export const updateCommentAPI = async ({
  id,
  content,
  documentType,
  documentId,
  mentions,
}: {
  id: ID;
  content: any;
  documentType: RhDocumentType;
  documentId: ID;
  mentions?: Array<string>;
}) => {
  const _url = generateApiUrl(`${documentType}/${documentId}/comments/${id}`);
  const response = await fetch(
    _url,
    API.PATCH_CONFIG({
      comment_content_json: content,
      mentions: uniqBy(mentions),
    })
  ).then((res): any => Helpers.parseJSON(res));

  const comment = parseComment({ raw: response });
  return Promise.resolve(comment);
};

export const markAsAcceptedAnswerAPI = async ({
  commentId,
  documentType,
  documentId,
}: {
  commentId: ID;
  documentType: RhDocumentType;
  documentId: ID;
}) => {
  const url = generateApiUrl(
    `${documentType}/${documentId}/comments/${commentId}/mark_as_accepted_answer`
  );

  try {
    const response = await fetch(url, API.POST_CONFIG()).then((res): any =>
      Helpers.parseJSON(res)
    );
  } catch (error) {
    // FIXME: Log to sentry
    throw Error(`Unexpected error for ${commentId}`);
  }
};

export const deleteCommentAPI = async ({
  id,
  documentType,
  documentId,
}: {
  id: ID;
  parentId?: ID;
  documentType: RhDocumentType;
  documentId: ID;
}) => {
  const url = generateApiUrl(
    `${documentType}/${documentId}/comments/${id}/censor`
  );

  try {
    await fetch(url, API.PUT_CONFIG({})).then(Helpers.checkStatus);
  } catch (error: any) {
    const isExpectedError = error.response.status < 500;
    if (isExpectedError) {
      throw error;
    } else {
      // FIXME: Log to sentry
      throw Error("Unexpected error while deleting comment");
    }
  }
};

export const voteForComment = async ({
  voteType,
  documentType,
  documentId,
  commentId,
}: {
  voteType: "upvote" | "downvote" | "neutralvote";
  documentType: RhDocumentType;
  documentId: ID;
  commentId: ID;
}): Promise<Vote> => {
  const url = generateApiUrl(
    `${documentType}/${documentId}/comments/${commentId}/${voteType}`
  );

  try {
    const response = await fetch(url, API.POST_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON);

    return parseVote(response);
  } catch (error: any) {
    const isExpectedError = error.response.status < 500;
    if (isExpectedError) {
      throw error;
    } else {
      // FIXME: Log to sentry
      throw Error("Unexpected error while casting vote");
    }
  }
};

export const flagComment = async ({
  commentId,
  documentType,
  documentId,
  flagReason,
}: {
  commentId: ID;
  documentType: RhDocumentType;
  documentId: ID;
  flagReason: string;
}) => {
  const url = generateApiUrl(
    `${documentType}/${documentId}/comments/${commentId}/flag`
  );

  try {
    const response = await fetch(
      url,
      API.POST_CONFIG({ reason_choice: flagReason })
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON);

    return true;
  } catch (error: any) {
    const isAlreadyFlagged = error.response.status === 409;
    if (isAlreadyFlagged) {
      throw "This comment has already been flagged";
    } else {
      // FIXME: Log to sentry
      throw "Unexpected error while Flagging";
    }
  }
};

export const getFileUrl = ({ fileString, type }) => {
  const payload = {
    content_type: type.split("/")[1],
    content: fileString,
  };
  return fetch(API.SAVE_IMAGE, API.POST_CONFIG(payload))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((res) => {
      return res;
    });
};

export const createPeerReview = ({
  unifiedDocumentId,
  commentId,
  score,
}: {
  unifiedDocumentId: ID;
  commentId: ID;
  score: number;
}) => {
  const payload = {
    score,
    object_id: commentId,
    content_type: "rhcommentmodel",
  };

  return fetch(API.REVIEW({ unifiedDocumentId }), API.POST_CONFIG(payload))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const updatePeerReview = ({
  unifiedDocumentId,
  reviewId,
  score,
}: {
  unifiedDocumentId: ID;
  reviewId: ID;
  score: number;
}) => {
  const payload = {
    score,
  };

  console.log("reviewId", reviewId);

  return fetch(
    API.REVIEW({ reviewId, unifiedDocumentId }),
    API.PATCH_CONFIG(payload)
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};
