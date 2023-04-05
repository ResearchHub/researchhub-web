import { userVoteToConstant } from "../constants";
import { formatDateStandard } from "../utils/dates";
import { emptyFncWithMsg, isEmpty } from "../utils/nullchecks";
import { Hub, parseHub } from "./hub";
import {
  AuthorProfile,
  RHUser,
  parseUser,
  ID,
  PaperFormat,
  parseAuthorProfile,
  parseUnifiedDocument,
  TopLevelDocument,
  UnifiedDocument,
  RhDocumentType,
  ApiDocumentType,
} from "./root_types";

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

export class Paper implements TopLevelDocument {
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
  _createdBy: RHUser | undefined;
  _datePublished?: string;
  _externalUrl?: string | undefined;
  _journal?: string;
  _formats: PaperFormat[];
  _isReady: boolean;
  _boostAmount: number;
  _isOpenAccess: boolean;
  _documentType: RhDocumentType;
  _apiDocumentType: ApiDocumentType;

  constructor(raw: any) {
    this._authors = parsePaperAuthors(raw);
    this._unifiedDocument = parseUnifiedDocument(raw.unified_document);
    this._score = raw.score;
    this._discussionCount = raw.discussion_count || 0;
    this._createdDate = raw.created_date;
    this._createdBy = isEmpty(raw.uploaded_by) ? undefined : parseUser(raw.uploaded_by);
    this._hubs = (raw.hubs || []).map((h) => parseHub(h));
    this._title = raw.title;
    this._formats = [];
    this._isReady = raw.id ? true : false;
    this._boostAmount = raw.boost_amount || 0;
    this._id = raw.id;
    this._isOpenAccess = raw.is_open_access || null;
    this._journal = raw.external_source;
    this._documentType = "paper";
    this._apiDocumentType = "paper";

    if (raw.user_vote) {
      this._userVote = userVoteToConstant(raw.user_vote);
    }
    if (raw.doi) {
      this._doi = raw.doi;
    }
    if (raw.paper_publish_date) {
      this._datePublished = formatDateStandard(raw.paper_publish_date);
    }
    if (raw.url) {
      this._externalUrl = raw.url;
    }
    if (raw.file) {
      this._formats.push({
        type: "pdf",
        url: raw.file,
      });
    }
  }

  get id(): ID {
    return this._id;
  }

  get unifiedDocument(): UnifiedDocument {
    return this._unifiedDocument;
  }

  get journal(): string | undefined {
    return this._journal;
  }

  get isReady(): boolean {
    return this._isReady;
  }

  get isOpenAccess(): boolean | undefined {
    return this._isOpenAccess;
  }

  get boostAmount(): number {
    return this._boostAmount;
  }

  get authors(): Array<AuthorProfile> {
    return this._authors;
  }

  get score(): number {
    return this._score;
  }

  set score(score) {
    this._score = score;
  }

  get userVote(): "downvote" | "upvote" | "neutralvote" | undefined | null {
    return this._userVote;
  }

  set userVote(userVote) {
    this._userVote = userVote;
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

  get externalUrl(): string | undefined {
    return this._externalUrl;
  }

  get createdBy(): RHUser | undefined {
    return this._createdBy;
  }

  get hubs(): Array<Hub> {
    return this._hubs;
  }

  get formats(): Array<PaperFormat> {
    return this._formats;
  }

  get documentType(): RhDocumentType {
    return this._documentType;
  }  

  get apiDocumentType(): ApiDocumentType {
    return this._apiDocumentType;
  }    

  set discussionCount(count) {
    this._discussionCount = count;
  }  
}
