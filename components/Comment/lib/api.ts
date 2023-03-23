import { ID, RhDocumentType } from "~/config/types/root_types";
import listMockData from "../mock/list.json";
// import createMockData from "../mock/create.json";
import { Comment, parseComment, COMMENT_TYPES } from "./types";
import API, { generateApiUrl } from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

export const fetchCommentsAPI = async ({
  documentType,
  documentId,
  url,
}: {
  documentType: RhDocumentType;
  documentId: ID;
  url?: string;
}): Promise<{ comments: Comment[], next: string, prev: string, count: number }> => {
  // const rawComments = listMockData;
  // const comments = rawComments.map((raw) => parseComment({ raw }));
  // return Promise.resolve({comments, next: "", prev: ""});
  
  const baseFetchUrl = generateApiUrl(`${documentType}/${documentId}/comments`);
  const _url = url || baseFetchUrl;
  const response =
    await fetch(_url, API.GET_CONFIG())
      .then((res):any => Helpers.parseJSON(res));

  return {
    comments: response.results.map((raw:any) => parseComment({ raw })).slice(0),
    next: response.next,
    prev: response.prev,
    count: response.count,
  };
};

export const createCommentAPI = async ({
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
  const _url = generateApiUrl(`${documentType}/${documentId}/comments/create_rh_comment`);
  const response =
    await fetch(_url, API.POST_CONFIG({
      "comment_content_json": content,
    }))
      .then((res):any => Helpers.parseJSON(res));

  const comment = parseComment({ raw: response });
  return Promise.resolve(comment);
};

export const updateCommentAPI = async ({
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
  const _url = generateApiUrl(`${documentType}/${documentId}/comments/${id}`);
  const response =
    await fetch(_url, API.POST_CONFIG({
      "comment_content_json": content,
    }))
      .then((res):any => Helpers.parseJSON(res));

  const comment = parseComment({ raw: response });
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
