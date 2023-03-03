import { parseCreatedBy } from "~/config/types/contribution";
import { CreatedBy, ID } from "~/config/types/root_types";
import { formatDateStandard, timeSince } from "~/config/utils/dates";

export enum POST_TYPES {
  DISCUSSION = "DISCUSSION",
  SUMMARY = "SUMMARY",
  REVIEW = "REVIEW",
  ANSWER = "ANSWER",
}

export type Comment = {
  id: ID,
  createdDate: string,
  updatedDate: string,
  timeAgo: string,
  createdBy: CreatedBy | null,
  content: any,
  score: number,
  userVote: any,
  isEdited: boolean,
  postType: POST_TYPES,
  children: Comment[]
}

export const parseComment = (raw:any): Comment => {
  const parsed = {
    id: raw.id,
    createdDate: formatDateStandard(raw.created_date),
    updatedDate: formatDateStandard(raw.created_date),
    timeAgo: timeSince(raw.created_date),
    createdBy: parseCreatedBy(raw.created_by),
    content: raw.content,
    score: raw.score,
    userVote: raw.user_vote,
    isEdited: raw.is_edited,
    postType: raw.post_type,
    children: (raw.children ?? []).map(child => parseComment(child)),
  }

  return parsed;
}