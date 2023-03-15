import { ID, RhDocumentType } from "~/config/types/root_types";
import listMockData from "../mock/list.json";
import createMockData from "../mock/create.json";
import { Comment, parseComment, COMMENT_TYPES } from "./types";

export const fetchCommentsAPI = ({
  documentType,
  documentId,
}: {
  documentType: RhDocumentType;
  documentId: ID;
}): Promise<Comment[]> => {
  const rawComments = listMockData;
  const comments = rawComments.map((raw) => parseComment({ raw }));

  return Promise.resolve(comments);
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
