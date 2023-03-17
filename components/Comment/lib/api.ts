import { ID, RhDocumentType } from "~/config/types/root_types";
import listMockData from "../mock/list.json";
import createMockData from "../mock/create.json";
import { Comment, parseComment, COMMENT_TYPES } from "./types";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

export const fetchCommentsAPI = async ({
  documentType,
  documentId,
  url,
}: {
  documentType: RhDocumentType;
  documentId: ID;
  url?: string;
}): Promise<{ comments: Comment[], next: string, prev: string }> => {
  const _url = url || API.BASE_URL + `${documentType}/${documentId}/comments`;
  const response =
    await fetch(_url, API.GET_CONFIG())
      .then((res):any => Helpers.parseJSON(res));

  return {
    comments: response.results.map((raw:any) => parseComment({ raw })),
    next: response.next,
    prev: response.prev,
  };

  // const rawComments = listMockData;
  // const comments = rawComments.map((raw) => parseComment({ raw }));
  // return Promise.resolve(comments);
};

export const createCommentAPI = ({
  content,
  postType,
  documentType,
  documentId,
}: {
  content: any;
  postType: COMMENT_TYPES;
  documentType: RhDocumentType;
  documentId: ID;
}): Promise<Comment> => {
  const comment = parseComment({ raw: createMockData });

  return Promise.resolve(comment);
};

export const updateCommentAPI = ({
  id,
  content,
  documentType,
  documentId,
}: {
  id: ID;
  content: any;
  documentType: RhDocumentType;
  documentId: ID;
}) => {
  // TODO: Replace with actual BE update
  const comment = parseComment({ raw: createMockData });
  comment.id = id;
  comment.content = content;

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
