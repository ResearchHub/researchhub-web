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
  SIDEBAR = "SIDEBAR",
  DRAWER = "DRAWER",
  ANNOTATION = "ANNOTATION",
  FEED = "FEED",
}

export type Annotation = {
  threadId: ID | "new-annotation";
  serialized: SerializedAnchorPosition;
  anchorCoordinates: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  threadCoordinates: {
    x: number;
    y: number;
  };
  xrange: any;
};

type SerializedAnchorPosition = {
  startContainerPath: string;
  startOffset: number;
  endContainerPath: string;
  endOffset: number;
  collapsed: boolean;
  textContent: string;
  page?: number;
  type: "text";
};

// export type AnnotationAnchorPosition = {
//   threadId: ID | "new-thread";
//   serialized: SerializedAnchorPosition;
//   anchorCoordinates: Array<{
//     x: number;
//     y: number;
//     width: number;
//     height: number;
//   }>;
//   xrange: any;
// };

// export type AnnotationThreadPosition = {
//   threadId: ID | "new-thread";
//   x: number;
//   y: number;
// }

export type CommentThread = {
  id: ID;
  threadType: COMMENT_TYPES;
  anchor?: SerializedAnchorPosition | null;
};

export type Comment = {
  id: ID;
  threadId: ID;
  createdDate: string;
  updatedDate: string;
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

// export type UnrenderedAnnotation = {
//   comment?: Comment;
//   xrange: any | null;
//   isNew?: boolean;
// };

// export type RenderedAnnotation = {
//   comment?: Comment;
//   isNew?: boolean;
//   xrange: any;
//   anchorCoordinates: Array<{
//     x: number;
//     y: number;
//     width: number;
//     height: number;
//   }>;
//   commentCoordinates: { x: number; y: number };
// };

export const createAnnotation = ({
  serializedAnchorPosition,
  xrange,
  canvasEl,
  threadId,
}: {
  xrange: any;
  canvasEl?: any;
  threadId?: ID | "new-thread";
  serializedAnchorPosition?: SerializedAnchorPosition;
}): Annotation => {
  const highlightCoords = xrange.getCoordinates({
    relativeEl: canvasEl,
  });

  return {
    threadId: threadId || "new-thread",
    serialized: xrange.serialize() || serializedAnchorPosition,
    anchorCoordinates: highlightCoords,
    threadCoordinates: {
      x: highlightCoords[0].x,
      y: highlightCoords[0].y, // Initial position on first render before adjustment
    },
    xrange,
  };
};

export const parseAnchor = (raw: any): SerializedAnchorPosition => {
  return {
    type: raw.type,
    startContainerPath: raw.position?.startContainerPath,
    startOffset: raw.position?.startOffset,
    endContainerPath: raw.position?.endContainerPath,
    endOffset: raw.position?.endOffset,
    collapsed: raw.position?.collapsed,
    textContent: raw.position?.textContent,
    page: raw.position?.page || null,
  };
};

export const parseThread = (raw: any): CommentThread => {
  return {
    id: raw.id,
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
    threadId: raw.thread,
    createdDate: formatDateStandard(raw.created_date),
    updatedDate: formatDateStandard(raw.updated_date),
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
    thread: parseThread(raw.thread),
  };

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
