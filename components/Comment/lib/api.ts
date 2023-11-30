import {
  ID,
  RHUser,
  RhDocumentType,
  parseUser,
} from "~/config/types/root_types";
import {
  Comment,
  parseComment,
  COMMENT_TYPES,
  COMMENT_FILTERS,
  CommentPrivacyFilter,
} from "./types";
import API, { generateApiUrl, buildQueryString } from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { apiConfig } from "./config";
import { sortOpts } from "./options";
import { parseVote, Vote } from "~/config/types/vote";
import uniqBy from "lodash/uniqBy";
import { SerializedAnchorPosition } from "../modules/annotation/lib/types";
import { captureEvent } from "~/config/utils/events";

export const fetchCommentsAPI = async ({
  documentType,
  documentId,
  sort = sortOpts[0].value,
  filter,
  page,
  pageSize = apiConfig.feed.pageSize,
  childPageSize = apiConfig.feed.childPageSize,
  ascending = false,
  privacyType = "PUBLIC",
  organizationId,
  tabName,
  parent__isnull,
}: {
  documentType: RhDocumentType;
  documentId: ID;
  sort?: string | null;
  filter?: COMMENT_FILTERS | null;
  page?: number;
  pageSize?: number;
  childPageSize?: number;
  ascending?: boolean;
  privacyType?: CommentPrivacyFilter;
  organizationId?: ID;
  tabName?: string | undefined | null;
  parent__isnull?: boolean;
}): Promise<{ comments: any[]; count: number }> => {
  const query = {
    ...(filter && { filtering: filter }),
    ...(sort && { ordering: sort }),
    ...(page && page > 1 && { page: page }),
    ...(parent__isnull && { parent__isnull: true }),
    child_count: childPageSize,
    page_size: pageSize,
    ascending: ascending ? "TRUE" : "FALSE",
    privacy_type: privacyType,
  };

  if (tabName === "conversation") {
    query["parent__isnull"] = true;
  }

  const baseFetchUrl = generateApiUrl(`${documentType}/${documentId}/comments`);
  const url = baseFetchUrl + buildQueryString(query);
  const response = await fetch(
    url,
    API.GET_CONFIG(
      undefined,
      organizationId ? { "x-organization-id": organizationId } : undefined
    )
  ).then((res): any => Helpers.parseJSON(res));

  if (response?.detail) {
    captureEvent({
      msg: "Failed to fetch comment",
      data: { documentId, page },
    });
    throw Error(response.detail);
  } else if (!response?.results) {
    captureEvent({
      msg: "Failed to fetch comments",
      data: { documentId, page },
    });
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
  ascending = false,
  childOffset = 0,
  sort = sortOpts[0].value,
}: {
  commentId: ID;
  documentType: RhDocumentType;
  documentId: ID;
  parentComment?: Comment;
  ascending?: boolean;
  childOffset: number;
  sort?: string | null;
}): Promise<Comment> => {
  const query = {
    ...(sort && { ordering: sort }),
    child_count: apiConfig.feed.repliesPageSize,
    child_offset: childOffset,
    ascending: ascending ? "TRUE" : "FALSE",
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
    captureEvent({
      msg: "Failed to fetch single comment",
      data: { documentId, detail: response.detail },
    });
    throw Error(response.detail);
  } else if (!response) {
    throw Error(`Unexpected error fetching comment ${commentId}`);
  }

  return parseComment({ raw: response, parent: parentComment });
};

export const createCommentAPI = async ({
  content,
  commentType = COMMENT_TYPES.DISCUSSION,
  documentType,
  documentId,
  threadId,
  parentComment,
  bountyAmount,
  privacy = "PUBLIC",
  mentions = [],
  anchor = null,
  organizationId,
  bountyType,
}: {
  content: any;
  commentType?: COMMENT_TYPES;
  documentType: RhDocumentType;
  documentId: ID;
  threadId?: ID;
  parentComment?: Comment;
  bountyAmount?: number;
  privacy?: CommentPrivacyFilter;
  mentions?: Array<string>;
  anchor?: null | SerializedAnchorPosition;
  organizationId?: ID;
  bountyType?: COMMENT_TYPES;
}): Promise<Comment> => {
  const _url = generateApiUrl(
    `${documentType}/${documentId}/comments/` +
      (bountyAmount ? "create_comment_with_bounty" : "create_rh_comment")
  );
  const response = await fetch(
    _url,
    API.POST_CONFIG(
      {
        comment_content_json: content,
        thread_type: commentType,
        comment_type: commentType,
        privacy_type: privacy,
        mentions: uniqBy(mentions),
        ...(parentComment && { parent_id: parentComment.id }),
        ...(bountyAmount && { amount: bountyAmount, bounty_type: bountyType }),
        ...(anchor && { anchor }),
        ...(threadId && { thread_id: threadId }),
      },
      undefined,
      organizationId ? { "x-organization-id": organizationId } : undefined
    )
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
    captureEvent({
      msg: "Failed to mark accepted answer",
      data: { documentId, commentId },
    });

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
      captureEvent({
        msg: "Failed to delete comment",
        data: { id },
      });

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
    if (error.response.status === 429) {
      throw null;
    }
    if (isExpectedError) {
      throw error;
    } else {
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

  return fetch(
    API.REVIEW({ reviewId, unifiedDocumentId }),
    API.PATCH_CONFIG(payload)
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};
