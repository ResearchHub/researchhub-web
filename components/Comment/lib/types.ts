import Bounty from "~/config/types/bounty";
import { RHUser, parseUser, ID } from "~/config/types/root_types";
import { formatDateStandard, timeSince } from "~/config/utils/dates";

export enum COMMENT_TYPES {
  DISCUSSION = "DISCUSSION",
  SUMMARY = "SUMMARY",
  REVIEW = "REVIEW",
  ANSWER = "ANSWER",
}

export type Comment = {
  id: ID;
  createdDate: string;
  updatedDate: string;
  bounties: Bounty[];
  timeAgo: string;
  createdBy: RHUser;
  content: object;
  score: number;
  userVote: any;
  isEdited: boolean;
  postType: COMMENT_TYPES;
  parent?: Comment;
  children: Comment[];
};

type parseCommentArgs = {
  raw: any;
  parent?: Comment;
};

export const parseComment = ({ raw, parent }: parseCommentArgs): Comment => {
  const parsed = {
    id: raw.id,
    createdDate: formatDateStandard(raw.created_date),
    updatedDate: formatDateStandard(raw.created_date),
    timeAgo: timeSince(raw.created_date),
    createdBy: parseUser(raw.created_by),
    bounties: (raw.bounties || []).map((b:any) => new Bounty(b)),
    content: raw.content || {},
    score: raw.score,
    userVote: raw.user_vote,
    isEdited: raw.is_edited,
    postType: raw.post_type,
    children: [] as Comment[],
    ...(parent && { parent }),
  };

  parsed.children = (raw.children ?? []).map((child: any) =>
    parseComment({ raw: child, parent: parsed })
  );

  return parsed;
};
