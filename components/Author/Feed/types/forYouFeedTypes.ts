import {
  Paper,
  Post,
  parsePaper,
  parsePost,
} from "~/components/Document/lib/types";
import Bounty from "~/config/types/bounty";
import { parseContentType } from "~/config/types/contentType";
import { Hub, parseHub } from "~/config/types/hub";
import {
  ID,
  RHUser,
  UnifiedDocument,
  parseUser,
} from "~/config/types/root_types";

export interface ForYouFeedItem {
  item: Paper | Post | Bounty | ForYouFeedCommentObject;
  contentType: string;

  hubs: Hub[];
  unifiedDocument: UnifiedDocument;

  userVote: number | null;
  score: number;

  createdBy: RHUser;
  createdDate: string;
}
export interface ForYouFeedPaperItem extends ForYouFeedItem {
  item: Paper;
}
export interface ForYouFeedPostItem extends ForYouFeedItem {
  item: Post;
}
export interface ForYouFeedBountyItem extends ForYouFeedItem {
  item: Bounty;
}
export interface ForYouFeedCommentItem extends ForYouFeedItem {
  item: ForYouFeedCommentObject;
}

export interface ForYouFeedCommentObject {
  id: ID;
  createdBy: RHUser;
  content: any;
}
export const parseForYouFeedCommentObject = (
  raw: any
): ForYouFeedCommentObject => {
  return {
    id: raw.id,
    createdBy: parseUser(raw.created_by),
    content: raw.comment_content_json,
  };
};

export const parseForYouFeedItem = (raw: any): ForYouFeedItem | null => {
  try {
    const parsed: ForYouFeedItem = {
      contentType: parseContentType({ name: raw.content_type }).name,
      hubs: (raw.hubs || []).map(parseHub),
      unifiedDocument: raw.unified_document,
      userVote: raw.user_vote,
      score: raw.score,
      createdBy: parseUser(raw.created_by),
      createdDate: raw.created_date,
    } as ForYouFeedItem;

    if (parsed.contentType === "paper") {
      parsed.item = parsePaper(raw.item);
    } else if (parsed.contentType === "post") {
      parsed.item = parsePost(raw.item);
    } else if (parsed.contentType === "bounty_contribution") {
      parsed.item = new Bounty(raw.item);
    } else if (parsed.contentType === "comment") {
      parsed.item = parseForYouFeedCommentObject(raw.item);
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
