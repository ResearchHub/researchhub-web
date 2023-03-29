import Bounty from "~/config/types/bounty";
import { RHUser, parseUser, ID, VoteType } from "~/config/types/root_types";
import { formatDateStandard, timeSince } from "~/config/utils/dates";
import { isEmpty } from "~/config/utils/nullchecks";

export enum COMMENT_TYPES {
  DISCUSSION = "DISCUSSION",
  SUMMARY = "SUMMARY",
  REVIEW = "REVIEW",
  ANSWER = "ANSWER",
}

export type Comment = {
  id: ID;
  threadId: ID;
  tipped: number;
  createdDate: string;
  updatedDate: string;
  bounties: Bounty[];
  timeAgo: string;
  createdBy: RHUser;
  content: object;
  score: number;
  userVote: VoteType|null;
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
    threadId: raw.thread,
    createdDate: formatDateStandard(raw.created_date),
    updatedDate: formatDateStandard(raw.updated_date),
    timeAgo: timeSince(raw.created_date),
    createdBy: parseUser(raw.created_by),
    isEdited: raw.is_edited,
    bounties: (raw.bounties || []).map((b:any) => new Bounty(b)),
    tipped: raw.promoted || 0,
    content: raw.comment_content_json || {},
    score: raw.score,
    userVote: raw.user_vote,
    postType: raw.post_type,
    children: [] as Comment[],
    ...(parent && { parent }),
  };

  parsed.children = (raw.children ?? []).filter((child:any) => !isEmpty(child)).map((child: any) =>
    parseComment({ raw: child, parent: parsed })
  );

  return parsed;
};
