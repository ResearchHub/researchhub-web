import { userVoteToConstant } from "../constants";
import { formatDateStandard } from "../utils/dates";
import { Hub, parseHub } from "./hub";
import {
  AuthorProfile,
  RHUser,
  parseAuthorProfile,
  parseUnifiedDocument,
  parseUser,
  TopLevelDocument,
  UnifiedDocument,
  ID,
} from "./root_types";

export type CitationConsensus = {
  total: number;
  neutral: number;
  rejecting: number;
  supporting: number;
};

export const parseConsensus = (raw: any): CitationConsensus => {
  return {
    total: raw.citation_count || 0,
    neutral: raw.neutral_count || 0,
    rejecting: raw.down_count || 0,
    supporting: raw.up_count || 0,
  };
};

export class Hypothesis implements TopLevelDocument {
  _id: ID;
  _authors: AuthorProfile[];
  _unifiedDocument: UnifiedDocument;
  _hubs: Hub[];
  _score: number;
  _createdDate: string;
  _discussionCount: number;
  _userVote?: "downvote" | "upvote" | "neutralvote" | undefined | null;
  _doi?: string;
  _title: string;
  _createdBy: RHUser;
  _datePublished?: string;
  _note?: any;
  _markdown?: string;
  _isReady: boolean;
  _boostAmount: number;
  _consensus: CitationConsensus | undefined;

  constructor(raw: any) {
    this._authors = (raw.authors || []).map((a) => parseAuthorProfile(a));
    this._unifiedDocument = parseUnifiedDocument(raw.unified_document);
    this._score = raw.score;
    this._discussionCount = raw.discussion_count || 0;
    this._createdDate = formatDateStandard(raw.created_date);
    this._datePublished = formatDateStandard(raw.created_date);
    this._createdBy = parseUser(raw.created_by);
    this._hubs = (raw.hubs || []).map((h) => parseHub(h));
    this._title = raw.title;
    this._note = raw.note;
    this._boostAmount = raw.boost_amount || 0;
    this._id = raw.id;
    this._markdown = raw.full_markdown;
    this._isReady = raw.id ? true : false;

    if (raw.aggregate_citation_consensus) {
      this._consensus = parseConsensus(raw.aggregate_citation_consensus);
    }
    if (raw.user_vote) {
      this._userVote = userVoteToConstant(raw.user_vote);
    }
    if (raw.doi) {
      this._doi = raw.doi;
    }
  }

  get id(): ID {
    return this._id;
  }

  get unifiedDocument(): UnifiedDocument {
    return this._unifiedDocument;
  }

  get authors(): Array<AuthorProfile> {
    return this._authors;
  }

  get boostAmount(): number {
    return this._boostAmount;
  }  

  get score(): number {
    return this._score;
  }

  get userVote(): "downvote" | "upvote" | "neutralvote" | undefined | null {
    return this._userVote;
  }

  get discussionCount(): number {
    return this._discussionCount;
  }

  get createdDate(): string {
    return this._createdDate;
  }

  get datePublished(): string | undefined {
    return this._datePublished;
  }

  get doi(): string | undefined {
    return this._doi;
  }

  get consensus(): CitationConsensus | undefined {
    return this._consensus;
  }

  get title(): string | undefined {
    return this._title;
  }

  get markdown(): string | undefined {
    return this._markdown;
  }

  get note(): any | undefined {
    return this._note;
  }

  get createdBy(): RHUser{
    return this._createdBy;
  }

  get isReady(): boolean {
    return this._isReady;
  }

  get hubs(): Array<Hub> {
    return this._hubs;
  }
}
