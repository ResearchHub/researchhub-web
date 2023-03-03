import { ID } from "~/config/types/root_types";
import listMockData from "../mock/list.json";
import createMockData from "../mock/create.json";
import { Comment, parseComment, POST_TYPES } from "./types";

export const fetchCommentsAPI = ({ unifiedDocumentId }: { unifiedDocumentId: ID }): Promise<Comment[]> => {
  console.log('Fetching comment via API');
  const rawComments = listMockData;
  const comments = rawComments.map((raw) => parseComment(raw));

  return Promise.resolve(comments);
}

export const createCommentAPI = ({ content, postType }: { content: any, postType: POST_TYPES }): Promise<Comment> => {
  console.log('Creating comment via API');
  console.log('content', content);
  const comment = parseComment(createMockData);

  return Promise.resolve(comment);
}

export const updateCommentAPI = ({ id, content }: { id: ID, content: any }) => {
  console.log('Updating comment via API');
  console.log('content', content);
  console.log('id', id);

  // TODO: Replace with actual BE update
  const comment = parseComment(createMockData);
  comment.id = id;
  comment.content = content;

  return Promise.resolve(comment);
}

export const deleteCommentAPI = ({ id, parentId }: { id: ID, parentId?: ID }) => {
  console.log('deleting comment via API');
  console.log('id', id);
  console.log('parentId', parentId);

  return Promise.resolve();
}
