import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ID } from "~/config/types/root_types";
import listMockData from "../mock/list.json";
import createMockData from "../mock/create.json";
import { Comment, parseComment, COMMENT_TYPES } from "./types";

export const fetchCommentsAPI = ({
  unifiedDocumentId,
}: {
  unifiedDocumentId: ID;
}): Promise<Comment[]> => {
  const rawComments = listMockData;
  const comments = rawComments.map((raw) => parseComment({ raw }));

  return Promise.resolve(comments);
};

export const createCommentAPI = ({
  content,
  postType,
}: {
  content: any;
  postType: COMMENT_TYPES;
}): Promise<Comment> => {
  const comment = parseComment({ raw: createMockData });

  return Promise.resolve(comment);
};

export const updateCommentAPI = ({ id, content }: { id: ID; content: any }) => {
  // TODO: Replace with actual BE update
  const comment = parseComment({ raw: createMockData });
  comment.id = id;
  comment.content = content;

  return Promise.resolve(comment);
};

export const deleteCommentAPI = ({
  id,
  parentId,
}: {
  id: ID;
  parentId?: ID;
}) => {
  console.log("deleting comment via API");
  console.log("id", id);
  console.log("parentId", parentId);

  return Promise.resolve();
};
