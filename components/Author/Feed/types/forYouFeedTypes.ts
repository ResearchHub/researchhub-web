import {
  Paper,
  Post,
  parsePaper,
  parsePost,
} from "~/components/Document/lib/types";
import { parseContentType } from "~/config/types/contentType";
import {
  BountyContributionItem,
  parseBountyContributionItem,
} from "~/config/types/contribution";
import { Hub, parseHub } from "~/config/types/hub";
import {
  ID,
  RHUser,
  UnifiedDocument,
  parseUnifiedDocument,
  parseUser,
} from "~/config/types/root_types";

export interface FeedItem {
  item: Paper | Post | BountyContributionItem | FeedCommentObject;
  contentType: string;

  hubs: Hub[];
  unifiedDocument: UnifiedDocument;

  userVote: number | null;
  score: number;

  createdBy: RHUser;
  createdDate: string;
}
export interface FeedPaperItem extends FeedItem {
  item: Paper;
}
export interface FeedPostItem extends FeedItem {
  item: Post;
}
export interface FeedBountyItem extends FeedItem {
  item: BountyContributionItem;
}
export interface FeedCommentItem extends FeedItem {
  item: FeedCommentObject;
}

export interface FeedCommentObject {
  id: ID;
  createdBy: RHUser;
  content: any;
}
export const parseFeedCommentObject = (raw: any): FeedCommentObject => {
  return {
    id: raw.id,
    createdBy: parseUser(raw.created_by),
    content: raw.comment_content_json,
  };
};

export const parseFeedItem = (raw: any): FeedItem | null => {
  try {
    const parsed: FeedItem = {
      contentType: parseContentType({ name: raw.content_type }).name,
      hubs: (raw.hubs || []).map(parseHub),
      unifiedDocument: parseUnifiedDocument(raw.unified_document),
      userVote: raw.user_vote,
      score: raw.score,
      createdBy: parseUser(raw.created_by),
      createdDate: raw.created_date,
    } as FeedItem;

    if (parsed.contentType === "paper") {
      parsed.item = parsePaper(raw.item);
    } else if (
      parsed.contentType === "post" ||
      parsed.contentType === "question" ||
      parsed.contentType === "preregistration"
    ) {
      parsed.item = parsePost(raw.item);
    } else if (parsed.contentType === "bounty") {
      parsed.item = parseBountyContributionItem(raw);
    } else if (parsed.contentType === "comment") {
      parsed.item = parseFeedCommentObject(raw.item);
    } else {
      console.error(
        `Could not parse item with content_type=${parsed.contentType}`
      );
      return null;
    }
    return parsed;
  } catch (e) {
    console.error("Error parsing feed item", e);
  }

  return null;
};
