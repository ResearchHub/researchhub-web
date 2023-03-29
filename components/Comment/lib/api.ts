import { ID, RhDocumentType } from "~/config/types/root_types";
import listMockData from "../mock/list.json";
// import createMockData from "../mock/create.json";
import { Comment, parseComment, COMMENT_TYPES } from "./types";
import API, { generateApiUrl, buildQueryString } from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

export const fetchCommentsAPI = async ({
  documentType,
  documentId,
  sort,
  filter,
  page,
}: {
  documentType: RhDocumentType;
  documentId: ID;
  sort?: string | null;
  filter?: string | null;
  page?: number;
}): Promise<{ comments: Comment[]; count: number }> => {
  // const rawComments = listMockData;
  // const comments = rawComments.map((raw) => parseComment({ raw }));
  // return Promise.resolve({comments, next: "", prev: ""});

  const query = {
    ...(filter && { thread_type: filter }),
    ...(sort && { ordering: sort }),
    ...(page && page > 1 && { page: page }),
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
    comments: response.results.map((raw: any) => parseComment({ raw })),
    count: response.count,
  };
};

export const fetchSingleCommentAPI = async ({
  commentId,
  documentType,
  documentId,
  parentComment,
}: {
  commentId: ID;
  documentType: RhDocumentType;
  documentId: ID;
  parentComment?: Comment;
}): Promise<Comment> => {
  const url = generateApiUrl(
    `${documentType}/${documentId}/comments` +
      (commentId ? `/${commentId}` : "")
  );
  const response = await fetch(url, API.GET_CONFIG()).then((res): any =>
    Helpers.parseJSON(res)
  );

  if (response.detail) {
    // FIXME: Log to sentry
    throw Error(response.detail);
  } else if (!response) {
    // FIXME: Log to sentry
    throw Error(`Unexpected error fetching comment for ${commentId}`);
  }

  return parseComment({ raw: response, parent: parentComment });
};

export const createCommentAPI = async ({
  content,
  commentType,
  documentType,
  documentId,
  parentComment,
}: {
  content: any;
  commentType: COMMENT_TYPES;
  documentType: RhDocumentType;
  documentId: ID;
  parentComment?: Comment;
}): Promise<Comment> => {
  const _url = generateApiUrl(
    `${documentType}/${documentId}/comments/create_rh_comment`
  );
  const response = await fetch(
    _url,
    API.POST_CONFIG({
      comment_content_json: content,
      thread_type: commentType || COMMENT_TYPES.DISCUSSION,
      ...(parentComment && { parent_id: parentComment.id }),
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
  currentUser,
}: {
  id: ID;
  content: any;
  documentType: RhDocumentType;
  documentId: ID;
}) => {
  const _url = generateApiUrl(`${documentType}/${documentId}/comments/${id}`);
  const response = await fetch(
    _url,
    API.PATCH_CONFIG({
      comment_content_json: content,
    })
  ).then((res): any => Helpers.parseJSON(res));

  const comment = parseComment({ raw: response });
  // FIXME: Temporary fix until we add created_by as obj from BE
  comment.createdBy = currentUser;
  return Promise.resolve(comment);
};

export const deleteCommentAPI = ({
  id,
  parentId,
  documentType,
  documentId,
}: {
  id: ID;
  parentId?: ID;
  documentType: RhDocumentType;
  documentId: ID;
}) => {
  console.log("deleting comment via API");
  console.log("id", id);
  console.log("parentId", parentId);

  return Promise.resolve();
};
