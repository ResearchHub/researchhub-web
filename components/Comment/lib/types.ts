import Bounty, { parseBountyList, RelatedItem } from "~/config/types/bounty";
import { parsePurchase, Purchase } from "~/config/types/purchase";
import {
  RHUser,
  parseUser,
  ID,
  Review,
  parseReview,
} from "~/config/types/root_types";
import { parseVote, Vote } from "~/config/types/vote";
import { formatDateStandard, timeSince } from "~/config/utils/dates";
import { isEmpty } from "~/config/utils/nullchecks";
import {
  parseAnchor,
  SerializedAnchorPosition,
} from "../modules/annotation/lib/types";
import { ContentInstance } from "~/components/Document/lib/types";

export enum COMMENT_TYPES {
  DISCUSSION = "GENERIC_COMMENT",
  SUMMARY = "SUMMARY",
  REVIEW = "REVIEW",
  ANSWER = "ANSWER",
  ANNOTATION = "INNER_CONTENT_COMMENT",
}

export enum COMMENT_FILTERS {
  BOUNTY = "BOUNTY",
  REVIEW = "REVIEW",
  ANNOTATION = "INNER_CONTENT_COMMENT",
}

export enum COMMENT_CONTEXTS {
  GENERIC = "GENERIC",
  SIDEBAR = "SIDEBAR", // Deprecated
  DRAWER = "DRAWER",
  ANNOTATION = "ANNOTATION",
  FEED = "FEED",
  REF_MANAGER = "REF_MANAGER",
}

export type CommentThreadGroup = {
  threadId: string;
  thread: CommentThread;
  comments: Comment[];
};

export type CommentThread = {
  id: ID;
  threadType: COMMENT_TYPES;
  anchor?: SerializedAnchorPosition | null;
  relatedContent: ContentInstance;
  privacy: CommentPrivacyFilter;
};

export type CommentPrivacyFilter = "PUBLIC" | "PRIVATE" | "WORKSPACE";

export type Comment = {
  id: ID;
  createdDate: string;
  updatedDate: string;
  updatedTimestamp: number;
  awardedBountyAmount: number;
  bounties: Bounty[];
  timeAgo: string;
  createdBy: RHUser;
  content: object;
  score: number;
  userVote: Vote | null;
  isEdited: boolean;
  commentType: COMMENT_TYPES;
  parent?: Comment;
  children: Comment[];
  childrenCount: number;
  tips: Purchase[];
  isAcceptedAnswer: boolean;
  review?: Review;
  thread: CommentThread;
};

export const parseThread = (raw: any): CommentThread => {
  return {
    id: String(raw.id),
    relatedContent: {
      id: raw.object_id,
      type: raw.content_type.model,
    },
    privacy: raw.privacy_type,
    threadType: raw.thread_type,
    anchor: raw.anchor ? parseAnchor(raw.anchor) : null,
  };
};

export const parseComment = ({
  raw,
  parent,
}: {
  raw: any;
  parent?: Comment;
}): Comment => {
  const parsed: Comment = {
    id: raw.id,
    createdDate: formatDateStandard(raw.created_date),
    updatedDate: formatDateStandard(raw.updated_date),
    updatedTimestamp: new Date(raw.updated_date).getTime(),
    timeAgo: timeSince(raw.created_date),
    createdBy: parseUser(raw.created_by),
    isEdited: raw.is_edited,
    content: raw.comment_content_json || {},
    score: raw.score,
    userVote: raw.user_vote ? parseVote(raw.user_vote) : null,
    awardedBountyAmount: raw.awarded_bounty_amount || 0,
    commentType: raw.thread?.thread_type || COMMENT_TYPES.DISCUSSION,
    bounties: [] as Bounty[],
    children: [] as Comment[],
    childrenCount: raw.children_count || 0,
    ...(parent && { parent }),
    tips: (raw.purchases || []).map((p: any) => parsePurchase(p)),
    isAcceptedAnswer: Boolean(raw.is_accepted_answer),
    ...(raw.review && { review: parseReview(raw.review) }),
  };

  // Only parent comments have threads
  if (raw.thread) {
    parsed.thread = parseThread(raw.thread);
  }

  const relatedItem: RelatedItem = {
    type: "comment",
    object: parsed,
  };

  parsed.children = (raw.children ?? [])
    .filter((child: any) => !isEmpty(child))
    .map((child: any) => parseComment({ raw: child, parent: parsed }));
  parsed.bounties = parseBountyList(raw.bounties || [], relatedItem);

  return parsed;
};

export const groupByPageNumber = (
  commentThreadGroups: CommentThreadGroup[]
): { [pageNumber: string]: CommentThreadGroup } => {
  const groups: { [pageNumber: string]: CommentThreadGroup } = {};
  commentThreadGroups.forEach((group) => {
    const pageNumber = group.thread.anchor?.pageNumber || "0";
    if (!groups[pageNumber]) {
      groups[pageNumber] = group;
    } else {
      groups[pageNumber].comments = groups[pageNumber].comments.concat(
        group.comments
      );
    }
  });

  return groups;
};

export const groupByThread = (
  comments: Comment[]
): { [threadId: string]: CommentThreadGroup } => {
  const threadGroups: { [threadId: string]: CommentThreadGroup } = {};
  comments.forEach((c) => {
    if (c.thread.id) {
      if (!threadGroups[c.thread.id]) {
        threadGroups[c.thread.id] = {
          thread: c.thread,
          comments: [],
          threadId: String(c.thread.id),
        };
      }
      threadGroups[String(c.thread.id)].comments.push(c);
    }
  });

  return threadGroups;
};
