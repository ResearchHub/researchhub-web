import { userVoteToConstant } from "../constants"
import { formatDateStandard } from "../utils/dates"
import { parseCreatedBy } from "./contribution"
import { Hub, parseHub } from "./hub"
import { AuthorProfile, CreatedBy, parseAuthorProfile, parseUnifiedDocument, TopLevelDocument, UnifiedDocument } from "./root_types"

export class Post implements TopLevelDocument {
  _authors: AuthorProfile[]
  _unifiedDocument: UnifiedDocument
  _hubs: Hub[]
  _score: number
  _createdDate: string
  _discussionCount: number
  _userVote?: "downvote" | "upvote" | "neutralvote" | undefined | null
  _doi?: string
  _title: string
  _createdBy: CreatedBy | null
  _datePublished?: string

  constructor(raw:any) {
    this._authors = (raw.authors || []).map(a => parseAuthorProfile(a))  
    this._unifiedDocument = parseUnifiedDocument(raw.unified_document);
    this._score = raw.score;
    this._discussionCount = raw.discussion_count || 0;
    this._createdDate = formatDateStandard(raw.created_date);
    this._datePublished = formatDateStandard(raw.created_date);
    this._createdBy = parseCreatedBy(raw.created_by);
    this._hubs = (raw.hubs || []).map(h => parseHub(h));
    this._title = raw.title;
    
    if (raw.user_vote) {
      this._userVote = userVoteToConstant(raw.user_vote)
    }
    if (raw.doi) {
      this._doi = raw.doi;
    }
  }

  get unifiedDocument():UnifiedDocument {
    return this._unifiedDocument;
  }

  get authors():Array<AuthorProfile> {
    return this._authors;
  }

  get score():number {
    return this._score;  
  }

  get userVote():"downvote" | "upvote" | "neutralvote" | undefined | null {
    return this._userVote;  
  }

  get discussionCount():number {
    return this._discussionCount;
  }

  get createdDate():string {
    return this._createdDate;
  }

  get datePublished():string|undefined {
    return this._datePublished;
  }  

  get doi():string|undefined {
    return this._doi;
  }

  get title():string|undefined {
    return this._title;
  }
  
  get createdBy():CreatedBy|null {
    return this._createdBy;
  }

  get hubs():Array<Hub> {
    return this._hubs;
  }
}
