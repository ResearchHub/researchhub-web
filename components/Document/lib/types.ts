import { Hub, parseHub } from "~/config/types/hub";
import { Purchase } from "~/config/types/purchase";
import {
  AuthorProfile,
  ID,
  RHUser,
  UnifiedDocument,
  parseAuthorProfile,
  parseUnifiedDocument,
  parseUser,
} from "~/config/types/root_types";
import { parseVote, Vote } from "~/config/types/vote";
import { formatDateStandard } from "~/config/utils/dates";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";

export type PaperFormat = {
  type: "pdf" | "latex";
  url: string;
};

export type DocumentType = "hypothesis" | "paper" | "post" | "question";

export type ReviewSummary = {
  count: number;
  averageRating: number;
};

export type ApiDocumentType = "researchhub_post" | "paper" | "hypothesis";

export interface GenericDocument {
  id: ID;
  authors: AuthorProfile[];
  unifiedDocument: UnifiedDocument;
  hubs: Hub[];
  score: number;
  createdDate: string;
  discussionCount: number;
  userVote: Vote | null;
  title: string;
  createdBy: RHUser | undefined;
  type: DocumentType;
  apiDocumentType: ApiDocumentType;
  doi?: string;
  purchases: Purchase[];
  reviewSummary: ReviewSummary;
  raw: any; // Strictly for legacy purposes
}

export type Paper = GenericDocument & {
  journal?: string;
  isOpenAccess: boolean;
  laymanTitle: string;
  publishedDate?: string;
  externalUrl?: string;
  formats: PaperFormat[];
};

export type Post = GenericDocument & {
  // FIXME: TBD
};

export type Hypothesis = GenericDocument & {
  // FIXME: TBD
};

export interface Props {
  raw: any;
  type: string;
}

export const parseReviewSummary = (raw: any): ReviewSummary => {
  return {
    count: raw.count,
    averageRating: raw.avg,
  };
};

export const parsePaper = (raw: any): Paper => {
  const parsed: Paper = {
    id: raw.id,
    authors: parsePaperAuthors(raw),
    unifiedDocument: parseUnifiedDocument(raw.unified_document),
    hubs: (raw.hubs || []).map((h: any) => parseHub(h)),
    score: raw.score,
    createdDate: formatDateStandard(raw.created_date),
    discussionCount: raw.discussion_count || 0,
    userVote: raw.user_vote ? parseVote(raw.user_vote) : null,
    title: raw.paper_title,
    createdBy: parseUser(raw.uploaded_by),
    type: "paper",
    apiDocumentType: "paper",
    doi: raw.doi,
    journal: raw.external_source,
    isOpenAccess: Boolean(raw.is_open_access),
    laymanTitle: raw.title,
    publishedDate: formatDateStandard(raw.paper_publish_date),
    externalUrl: raw.url,
    tipAmount: raw.boost_amount,
    reviewSummary: parseReviewSummary(raw.unified_document.reviews),
    ...(raw.file && { formats: [{ type: "pdf", url: raw.file }] }),

    raw,
  };

  return parsed;
};

export const getConcreteDocument = (
  document: GenericDocument
): Paper | Hypothesis | Post => {
  if (document.type === "paper") {
    return document as Paper;
  } else if (document.type === "post") {
    return document as Post;
  } else if (document.type === "hypothesis") {
    return document as Hypothesis;
  }

  throw new Error(`Invalid document type. Type was ${document.type}`);
};

export const isPaper = (document: GenericDocument): document is Paper => {
  return (document as Paper).type === "paper";
};

const getDocumentFromRaw = ({
  raw,
  type,
}: Props): Paper | Post | Hypothesis => {
  if (type === "paper") {
    return parsePaper(raw);
  } else if (type === "post") {
    // return new Post(raw);
  } else if (type === "hypothesis") {
    // return new Hypothesis(raw);
  }

  throw new Error(`Invalid document type. Type was ${type}`);
};

export const parsePaperAuthors = (rawPaper: any): Array<AuthorProfile> => {
  const rawAuthors = rawPaper.raw_authors || [];
  const claimedAuthors = rawPaper.authors || [];
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
