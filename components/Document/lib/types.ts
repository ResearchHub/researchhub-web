import Bounty, { parseBountyList } from "~/config/types/bounty";
import { Hub, parseHub } from "~/config/types/hub";
import {
  EmptyPredictionMarketDetails,
  PredictionMarketDetails,
  parsePredictionMarketDetails,
} from "~/components/PredictionMarket/lib/types";
import { Purchase, parsePurchase } from "~/config/types/purchase";
import {
  AuthorProfile,
  ID,
  Organization,
  RHUser,
  RhDocumentType,
  UnifiedDocument,
  parseAuthorProfile,
  parseOrganization,
  parseUnifiedDocument,
  parseUser,
} from "~/config/types/root_types";
import { parseVote, Vote } from "~/config/types/vote";
import { formatDateStandard } from "~/config/utils/dates";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";
import { stripHTML } from "~/config/utils/string";
import { Fundraise, parseFundraise } from "~/components/Fundraise/lib/types";

export type DocumentFormat = {
  type: "pdf" | "latex";
  url: string;
};
export type DocumentType = "hypothesis" | "paper" | "post" | "question";

export type ContentInstance = {
  id: ID;
  type: RhDocumentType;
  unifiedDocumentId?: ID;
};

export type ApiDocumentType =
  | "researchhubpost"
  | "paper"
  | "hypothesis"
  | "citationentry";

export type DocumentImage = {
  url: string;
  type: "figure" | "preview" | "misc";
};

export type DocumentMetadata = {
  unifiedDocumentId: ID;
  bounties: Bounty[];
  purchases: Purchase[];
  userVote: Vote | null;
  reviewSummary: ReviewSummary;
  discussionCount: number;
  reviewCount: number;
  summaryCount: number;
  predictionMarket?: PredictionMarketDetails;
  fundraise?: Fundraise;
  score: number;
  id: ID;
  hubs: Hub[];
  twitterScore: number;
};

export const parseDocumentMetadata = (raw: any): DocumentMetadata => {
  const document = Array.isArray(raw.documents)
    ? raw.documents[0]
    : raw.documents;

  const parsed = {
    unifiedDocumentId: raw.id,
    bounties: parseBountyList(document?.bounties || []).filter(
      (b) => !b.isExpiredOrClosed
    ),
    purchases: (document.purchases || []).map((p: any) => parsePurchase(p)),
    userVote: document?.user_vote ? parseVote(document.user_vote) : null,
    reviewSummary: parseReviewSummary(raw.reviews),
    discussionCount: document?.discussion_aggregates?.discussion_count || 0,
    reviewCount: document?.discussion_aggregates?.review_count || 0,
    summaryCount: document?.discussion_aggregates?.summary_count || 0,
    predictionMarket: raw.prediction_market
      ? parsePredictionMarketDetails(raw.prediction_market)
      : EmptyPredictionMarketDetails,
    fundraise: raw.fundraise ? parseFundraise(raw.fundraise) : undefined,
    score: raw.score,
    twitterScore: document?.twitter_score || 0,
    id: raw.id,
    hubs: (raw.hubs || []).map((h: any) => parseHub(h)),
  };

  return parsed;
};

export type ReviewSummary = {
  count: number;
  averageRating: number;
};

export interface GenericDocument {
  srcUrl: string;
  id: ID;
  unifiedDocument: UnifiedDocument;
  authors: AuthorProfile[];
  hubs: Hub[];
  score: number;
  createdDate: string;
  publishedDate?: string;
  discussionCount: number;
  userVote: Vote | null;
  title: string;
  createdBy: RHUser | undefined;
  type: DocumentType;
  apiDocumentType: ApiDocumentType;
  doi?: string;
  reviewSummary: ReviewSummary;
  formats: DocumentFormat[];
  raw: any; // Strictly for legacy purposes
  images: DocumentImage[];
  slug?: string;
}

export type Paper = GenericDocument & {
  journal?: string;
  isOpenAccess: boolean;
  laymanTitle: string;
  externalUrl?: string;
  abstract?: string;
  abstractHtml?: TrustedHTML;
  license?: string;
};

export type Post = GenericDocument & {
  postType?: "publication" | "question" | "preregistration";
  note?: Note;
  srcUrl: string;
  postHtml: TrustedHTML;
};

export type Hypothesis = GenericDocument & {
  // FIXME: TBD
};

export interface Props {
  raw: any;
  type: string;
}

export type Note = {
  id: ID;
  organization: Organization;
};

export const parseNote = (raw: any): Note => {
  return {
    id: raw.id,
    organization: parseOrganization(raw.organization),
  };
};

export const parseReviewSummary = (raw: any): ReviewSummary => {
  return {
    count: raw?.count || 0,
    averageRating: raw?.avg || 0,
  };
};

export const parseGenericDocument = (raw: any): GenericDocument => {
  const parsed: GenericDocument = {
    // @ts-ignore
    type: undefined, // Will be defined in concrete types
    // @ts-ignore
    apiDocumentType: undefined, // Will be defined in concrete types
    id: raw.id,
    authors: [], // Will be overriden by specific document type
    unifiedDocument: parseUnifiedDocument(raw.unified_document),
    hubs: (raw.hubs || []).map((h: any) => parseHub(h)),
    score: raw.score,
    createdDate: formatDateStandard(raw.created_date, "MMM D, YYYY"),
    discussionCount: raw.discussion_count || 0,
    userVote: raw.user_vote ? parseVote(raw.user_vote) : null,
    title: stripHTML(raw.title),
    createdBy: parseUser(raw.uploaded_by || raw.created_by),
    doi: raw.doi,
    publishedDate: formatDateStandard(raw.created_date, "MMM D, YYYY"),
    reviewSummary: parseReviewSummary(raw?.unified_document?.reviews),
    // @ts-ignore
    formats: [...(raw.file ? [{ type: "pdf", url: raw.file }] : [])],
    raw, // For legacy compatibility purposes
    images: [],
  };

  return parsed;
};

export const parsePaper = (raw: any): Paper => {
  const commonAttributes = parseGenericDocument(raw);
  const parsed: Paper = {
    ...commonAttributes,
    title: stripHTML(raw.paper_title || raw.title),
    authors: parsePaperAuthors(raw),
    journal: raw.external_source,
    isOpenAccess: Boolean(raw.is_open_access),
    laymanTitle: stripHTML(raw.title),
    publishedDate: formatDateStandard(raw.paper_publish_date, "MMM D, YYYY"),
    externalUrl: raw.url,
    abstract: stripHTML(raw.abstract),
    abstractHtml: raw.abstract_src_markdown,
    type: "paper",
    apiDocumentType: "paper",
    pdfCopyrightAllowsDisplay: Boolean(raw.pdf_copyright_allows_display),
    ...(raw.pdf_license && { license: raw.pdf_license }),
  };

  if (raw.first_preview) {
    parsed.images.push({
      url: raw?.first_preview?.file,
      type: "preview",
    });
  }

  return parsed;
};

export const parsePost = (raw: any): Post => {
  const commonAttributes = parseGenericDocument(raw);
  let postType = "publication";
  if (raw?.unified_document?.document_type === "QUESTION") {
    postType = "question";
  } else if (raw?.unified_document?.document_type === "PREREGISTRATION") {
    postType = "preregistration";
  }

  const parsed: Post = {
    ...commonAttributes,
    authors: (raw.authors || []).map((a: any) => parseAuthorProfile(a)),
    type: "post",
    apiDocumentType: "researchhubpost",
    srcUrl: raw.post_src,
    postHtml: raw.postHtml || "",
    postType: postType as any,
  };

  if (raw.note) {
    parsed.note = parseNote(raw.note);
  }

  return parsed;
};

export const getConcreteDocument = (
  document: GenericDocument
): Paper | Hypothesis | Post => {
  if (document.type === "paper") {
    return document as Paper;
  } else if (document.type === "post") {
    return document as Post;
  }
  throw new Error(`Invalid document type. Type was ${document.type}`);
};

export const isPaper = (document: GenericDocument): document is Paper => {
  return (document as Paper)?.type === "paper";
};

export const isPost = (document: GenericDocument): document is Post => {
  return (document as Post)?.type === "post";
};

const getDocumentFromRaw = ({
  raw,
  type,
}: Props): Paper | Post | Hypothesis => {
  if (type === "paper") {
    return parsePaper(raw);
  } else if (type === "post") {
    return parsePost(raw);
  } else if (type === "hypothesis") {
    // return new Hypothesis(raw);
  }

  throw new Error(`Invalid document type. Type was ${type}`);
};

export const parsePaperAuthors = (rawPaper: any): Array<AuthorProfile> => {
  const rawAuthors = rawPaper?.raw_authors || [];
  const claimedAuthors = rawPaper?.authors || [];
  const nameToObjMap = {};

  for (let i = 0; i < rawAuthors.length; i++) {
    try {
      const current = rawAuthors[i];
      const key = (current.first_name + " " + current.last_name).toLowerCase();
      nameToObjMap[key] = parseAuthorProfile(current);
    } catch (error) {
      emptyFncWithMsg(`Error parsing author ${rawAuthors[i]}`);
    }
  }

  for (let i = 0; i < claimedAuthors.length; i++) {
    try {
      const current = claimedAuthors[i];
      const key = (current.first_name + " " + current.last_name).toLowerCase();
      // Override raw_author if claimed author exists
      nameToObjMap[key] = {
        ...nameToObjMap[key],
        ...parseAuthorProfile(current),
      };
    } catch (error) {
      emptyFncWithMsg(`Error parsing author ${claimedAuthors[i]}`);
    }
  }

  const finalAuthors = Object.values(nameToObjMap).sort((a: any, b: any) => {
    return a.sequence === "first" && b.sequence === "first"
      ? 0
      : a.sequence === "first"
      ? -1
      : 1;
  });

  // @ts-ignore
  return finalAuthors;
};

export default getDocumentFromRaw;
