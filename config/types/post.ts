import { userVoteToConstant } from "../constants";
import { formatDateStandard } from "../utils/dates";
import Bounty, { BOUNTY_STATUS } from "./bounty";
import { Hub, parseHub } from "./hub";
import {
  AuthorProfile,
  RHUser,
  parseUser,
  ID,
  parseAuthorProfile,
  parseUnifiedDocument,
  TopLevelDocument,
  UnifiedDocument,
  RhDocumentType,
  ApiDocumentType,
} from "./root_types";

export class Post implements TopLevelDocument {
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
  _bounties: Bounty[];
  _bountyType: string;
  _slug: string;
  _documentType: RhDocumentType;
  _apiDocumentType: ApiDocumentType

  constructor(raw: any) {
    this._authors = (raw.authors || []).map((a) => parseAuthorProfile(a));
    this._unifiedDocument = parseUnifiedDocument(raw.unified_document);
    this._score = raw.score;
    this._discussionCount = raw.discussion_count || 0;
    this._createdDate = raw.created_date;
    this._datePublished = formatDateStandard(raw.created_date);
    this._createdBy = parseUser(raw.created_by);
    this._hubs = (raw.hubs || []).map((h) => parseHub(h));
    this._title = raw.title;
    this._note = raw.note;
    this._markdown = raw.full_markdown;
    this._isReady = raw.id ? true : false;
    this._boostAmount = raw.boost_amount || 0;
    this._id = raw.id;
    this._bountyType = raw.bounty_type;
    this._bounties = (raw.bounties ?? []).map((b) => new Bounty(b));
    this._slug = raw.slug;
    this._documentType = "post";
    this._apiDocumentType = "researchhub_post";

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

  get title(): string | undefined {
    return this._title;
  }

  get markdown(): string | undefined {
    return this._markdown;
  }

  get note(): any | undefined {
    return this._note;
  }

  get createdBy(): RHUser {
    return this._createdBy;
  }

  get isReady(): boolean {
    return this._isReady;
  }

  get hubs(): Array<Hub> {
    return this._hubs;
  }

  get bountyType(): string {
    return this._bountyType;
  }

  get slug(): string {
    return this._slug;
  }

  get bounties(): Array<Bounty> {
    return (this._bounties || []).filter((b) => b.status == BOUNTY_STATUS.OPEN);
  }

  get documentType(): RhDocumentType {
    return this._documentType;
  }

  get apiDocumentType(): ApiDocumentType {
    return this._apiDocumentType;
  }  
}
