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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faMessagesQuestion,
  faStar,
} from "@fortawesome/pro-solid-svg-icons";
import {
  PEER_REVIEW_STATUSES,
  PeerReview,
} from "~/components/PeerReview/lib/types";

export enum COMMENT_TYPES {
  DISCUSSION = "GENERIC_COMMENT",
  SUMMARY = "SUMMARY",
  REVIEW = "REVIEW",
  PEER_REVIEW = "PEER_REVIEW",
  ANSWER = "ANSWER",
  ANNOTATION = "INNER_CONTENT_COMMENT",
  REPLICABILITY_COMMENT = "REPLICABILITY_COMMENT",
  BOUNTIES = "BOUNTIES",
}

export const COMMENT_TYPE_OPTIONS = [
  {
    value: COMMENT_TYPES.REVIEW,
    label: "Peer Review",
    icon: <FontAwesomeIcon icon={faStar} />,
  },
  {
    value: COMMENT_TYPES.ANSWER,
    label: "Answer to Question",
    icon: <FontAwesomeIcon icon={faMessagesQuestion} />,
  },
  {
    value: COMMENT_TYPES.DISCUSSION,
    label: "Other",
    icon: <FontAwesomeIcon icon={faComments} />,
  },
];

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
  peerReview?: {
    id: ID;
    status: PEER_REVIEW_STATUSES;
  };
};

export type CommentPrivacyFilter = "PUBLIC" | "PRIVATE" | "WORKSPACE";

export type ContentFormat = "QUILL_EDITOR" | "TIPTAP";

export type Comment = {
  id: ID;
  createdDate: string;
  updatedDate: string;
  updatedTimestamp: number;
  awardedBountyAmount: number;
  bounties: Bounty[];
  timeAgo: string;
  createdBy: RHUser;
  content: any;
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
  contentFormat?: ContentFormat;
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
    ...(raw.peer_review && {
      peerReview: {
        id: raw.peer_review.id,
        status: raw.peer_review.status,
      },
    }),
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
    contentFormat:
      raw.comment_content_type === "TIPTAP" ? "TIPTAP" : "QUILL_EDITOR",
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

/**
 * Represents a TipTap mark (formatting)
 */
export interface TipTapMark {
  type: string;
  attrs?: Record<string, any>;
}

/**
 * Represents a TipTap text node
 */
export interface TipTapTextNode {
  type: "text";
  text: string;
  marks?: Array<TipTapMark>;
}

/**
 * Represents a TipTap node (paragraph, heading, etc.)
 */
export interface TipTapNode {
  type: string;
  content?: Array<TipTapNode | TipTapTextNode>;
  attrs?: Record<string, any>;
  text?: string;
  marks?: Array<TipTapMark>;
}

/**
 * Represents a TipTap document
 */
export interface TipTapDocument {
  type: "doc";
  content: Array<TipTapNode>;
}

/**
 * Represents a nested TipTap document (sometimes found in the API)
 */
export interface NestedTipTapDocument {
  content: TipTapDocument;
}

/**
 * Represents all possible comment content formats
 */
export type CommentContent =
  | TipTapDocument
  | NestedTipTapDocument
  | { content: Array<TipTapNode> }
  | { type: string; content: any[] }
  | string;
