import {
  AuthorProfile,
  ID,
  KeyOf,
  parseAuthorProfile,
  parseUnifiedDocument,
  parseUser,
  RHUser,
  UnifiedDocument,
} from "./root_types";
import { FLAG_REASON } from "~/components/Flag/config/flag_constants";
import { parseContentType, ContentType } from "./contentType";
import { parseHub, Hub } from "./hub";
import { formatBountyAmount } from "~/config/types/bounty";
import { POST_TYPES } from "~/components/TextEditor/config/postTypes";

export type RelatedBountyItem = {
  contentType: ContentType;
  unifiedDocument: UnifiedDocument;
};

export type RscSupportSourceItem = {
  id: ID;
  plainText: string;
  unifiedDocument: UnifiedDocument;
  contentType: ContentType;
};

export type CommentContributionItem = {
  text?: any;
  unifiedDocument: UnifiedDocument;
  createdBy: RHUser;
  createdDate: string;
  id: ID;
  content: any;
  postType: POST_TYPES;
};

export type PaperContributionItem = {
  unifiedDocument: UnifiedDocument;
  title: string;
  slug: string;
  createdBy: RHUser;
  createdDate: string;
  id: ID;
  abstract?: string;
};

export type HypothesisContributionItem = {
  unifiedDocument: UnifiedDocument;
  title: string;
  slug: string;
  createdBy: RHUser;
  createdDate: string;
  id: ID;
};

export type RscSupportContributionItem = {
  createdBy: RHUser;
  createdDate: string;
  recipient: RHUser;
  amount: number;
  source: RscSupportSourceItem;
};

export type BountyContributionItem = {
  unifiedDocument: UnifiedDocument;
  createdBy: RHUser;
  createdDate: string;
  amount: number;
  id: ID;
};

export type PostContributionItem = {
  unifiedDocument: UnifiedDocument;
  title: string;
  slug: string;
  createdBy: RHUser;
  createdDate: string;
  id: ID;
};

export type FlaggedBy = {
  firstName: string;
  lastName: string;
  id: ID;
  authorProfile: AuthorProfile;
};

export type Verdict = {
  createdBy: RHUser;
  verdictChoice: string;
  createdDate: string;
};

export type Contribution = {
  raw: any;
  item:
    | PaperContributionItem
    | PostContributionItem
    | HypothesisContributionItem
    | CommentContributionItem
    | BountyContributionItem
    | RscSupportContributionItem;
  createdDate: Date;
  contentType: ContentType;
  flaggedBy?: FlaggedBy | null;
  verdict?: Verdict;
  reason?: string;
  relatedItem?: RelatedBountyItem;
  reasonChoice?: KeyOf<typeof FLAG_REASON>;
  id?: ID;
  _raw: any;
  hubs: Array<Hub>;
};

export const parseBountyRelatedItem = (raw: any): RelatedBountyItem => {
  const uniDoc =
    typeof raw.unified_document === "object" ? raw.unified_document : raw;
  return {
    contentType: parseContentType(raw.content_type),
    unifiedDocument: parseUnifiedDocument(uniDoc),
  };
};

export const parseVerdict = (raw: any): Verdict => {
  const mapped = {
    verdictChoice: raw.verdict_choice,
    createdBy: parseUser(raw.created_by),
    createdDate: raw.created_date,
  };

  return mapped;
};

export const parseFlaggedBy = (raw: any): FlaggedBy | null => {
  return parseUser(raw);
};

export const parseContribution = (raw: any): Contribution => {
  const mapped = {
    raw: raw,
    createdDate: raw.created_date,
    contentType: parseContentType(raw.content_type),
    id: raw.id,
    // Note: On paper, hubs is available on nested "item" key due to async nature of paper upload
    // "hubs" not available during creation of "user action" record so we need to get it elsewhere.
    hubs: (raw.hubs?.length
      ? raw.hubs
      : raw.item?.hubs?.length
      ? raw.item.hubs
      : []
    ).map((h) => parseHub(h)),
  };

  if (["thread", "comment", "reply"].includes(raw.content_type.name)) {
    mapped["item"] = parseCommentContributionItem(raw);
  } else if (["rhcommentmodel"].includes(raw.content_type.name)) {
    mapped["item"] = parseCommentContributionV2Item(raw);
  } else if (raw.content_type.name === "paper") {
    mapped["item"] = parsePaperContributionItem(raw);
  } else if (
    raw.content_type.name === "researchhubpost" ||
    raw.content_type.name === "researchhubunifieddocument"
  ) {
    if (
      raw?.item?.unified_document?.document_type?.toLowerCase() === "question"
    ) {
      mapped.contentType.name = "question";
    }
    mapped["item"] = parsePostContributionItem(raw);
  } else if (raw.content_type.name === "hypothesis") {
    mapped["item"] = parseHypothesisContributionItem(raw);
  } else if (raw.content_type.name === "bounty") {
    mapped["item"] = parseBountyContributionItem(raw);
    mapped["relatedItem"] = parseBountyRelatedItem(raw.item.item);
  } else if (raw.content_type.name === "purchase") {
    mapped["item"] = parseRscSupportContributionItem(raw);
  } else {
    throw Error(
      "Could not parse object with content_type=" + raw.content_type.name
    );
  }

  if (raw.flagged_by) {
    mapped["flaggedBy"] = parseFlaggedBy(raw.flagged_by);
  }
  if (raw.verdict) {
    mapped["verdict"] = parseVerdict(raw.verdict);
  }
  if (raw.reason) {
    mapped["reason"] = raw.reason;
  }
  if (raw.reason_choice) {
    mapped["reasonChoice"] = raw.reason_choice;
  }

  mapped["_raw"] = raw;

  /* @ts-ignore */
  return mapped;
};

/**
 * @deprecated use useSelector to fetch user directly from state instead. Using this method will result in old state
 */
export const parseCommentContributionItem = (
  raw: any
): CommentContributionItem => {
  const mapped = {
    plainText: raw.item.plain_text,
    createdBy: parseUser(raw.created_by || raw.item.created_by),
    unifiedDocument: parseUnifiedDocument(raw.item.unified_document),
    id: raw.item.id,
    content: {},
    createdDate: raw.created_date,
    postType: raw.item.discussion_post_type,
  };

  return mapped;
};

export const parseCommentContributionV2Item = (
  raw: any
): CommentContributionItem => {
  raw.item.unified_document = {
    "documents": [
        {
            "id": 899,
            "title": "Possibly anomalous insulin / blood glucose event",
            "slug": "possibly-anomalous-insulin-blood-glucose-event"
        }
    ],
    "document_type": "DISCUSSION"
}
  const mapped = {
    content: raw.item.comment_content_json,
    createdBy: parseUser(raw.created_by || raw.item.created_by),
    unifiedDocument: parseUnifiedDocument(raw.item.unified_document),
    id: raw.item.id,
    createdDate: raw.created_date,
    postType: raw.item.discussion_post_type,
  };

  return mapped;
};

export const parseBountyContributionItem = (
  raw: any
): BountyContributionItem => {

  raw.item.item = {
    "item": {
      "id": 1199,
      "thread": {
        "content_object": {
          "id": 51,
          "unified_document": {
            "id": 1549,
            "documents": [
              {
                "id": 51,
                "renderable_text": "this is a new question",
                "title": "new question",
                "slug": "new-question"
              }
            ],
            "document_type": "QUESTION"
          }
        }
      },
      "comment_content_json": {
        "ops": [
          {
            "insert": "Replying 3rd level Replying 3rd level Replying 3rd level Replying 3rd level Replying 3rd level Replying 3rd level\n"
          }
        ]
      }
    },
    "content_type": {
      "id": 118,
      "name": "rhcommentmodel"
    },
    "created_by": {
      "id": 8,
      "author_profile": {
        "id": 416,
        "first_name": "Kobe",
        "last_name": "Attias",
        "profile_image": "https://lh3.googleusercontent.com/a/AATXAJxMWwF8N8q__74Pl5_Fvp_srsuekx5iNmsB54eBURA=s96-c"
      },
      "first_name": "Kobe",
      "last_name": "Attias"
    },
    "hubs": [
      {
        "id": 227,
        "name": "agronomy",
        "hub_image": null,
        "slug": "agronomy"
      }
    ],
    "created_date": "2023-04-04T19:10:06.717838Z"
  }
  raw.item.item.content_type = raw.item.content_type;

  const mapped = {
    createdBy: parseUser(raw.created_by),
    unifiedDocument: parseUnifiedDocument(raw.item.unified_document),
    id: raw.id,
    createdDate: raw.created_date,
    amount: formatBountyAmount({ amount: raw.item.amount }),
  };

  return mapped;
};

export const parsePaperContributionItem = (raw: any): PaperContributionItem => {
  const mapped = {
    id: raw.item.id,
    title: raw.item.title,
    slug: raw.item.slug,
    createdBy: parseUser(
      raw.created_by ||
        raw.uploaded_by ||
        raw.item.created_by ||
        raw.item.uploaded_by
    ),
    unifiedDocument: parseUnifiedDocument(raw.item.unified_document),
    createdDate: raw.created_date,
    abstract: raw.item.abstract,
  };

  return mapped;
};

export const parseHypothesisContributionItem = (
  raw: any
): HypothesisContributionItem => {
  const mapped = {
    title: raw.item.title,
    slug: raw.item.slug,
    createdBy: parseUser(raw.created_by),
    unifiedDocument: parseUnifiedDocument(raw.item.unified_document),
    id: raw.item.id,
    createdDate: raw.created_date,
    ...raw.item,
  };

  return mapped;
};

export const parseSupportSourceItem = (
  raw: any,
  contentType: any
): RscSupportSourceItem => {  
  return {
    unifiedDocument: parseUnifiedDocument(raw.unified_document),
    plainText: raw.plain_text,
    id: raw.id,
    contentType: parseContentType(contentType),
  };
};

export const parseRscSupportContributionItem = (
  raw: any
): RscSupportContributionItem => {
  let createdBy;
  let recipient;


  if (raw.item.content_type.app_label === "discussion") {
    createdBy = parseUser(raw.created_by);
    recipient = parseUser(raw.item.user);
  } else {
    createdBy = parseUser(raw.item.user);
    recipient = parseUser(raw.created_by);
  }
  const mapped = {
    createdBy: createdBy,
    createdDate: raw.created_date,
    source: parseSupportSourceItem(raw.item.source, raw.item.content_type),
    amount: parseFloat(raw.item.amount),
    recipient: recipient,
  };

  return mapped;
};

export const parsePostContributionItem = (raw: any): PostContributionItem => {
  const mapped = {
    title: raw.item.title,
    slug: raw.item.slug,
    createdBy: parseUser(raw.created_by || raw.item.created_by),
    unifiedDocument: parseUnifiedDocument(raw.item.unified_document),
    id: raw.item.id,
    createdDate: raw.created_date,
  };

  return mapped;
};
