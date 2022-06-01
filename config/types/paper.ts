import { userVoteToConstant } from "../constants"
import { parseCreatedBy } from "./contribution"
import { Hub, parseHub } from "./hub"
import { AuthorProfile, CreatedBy, parseAuthorProfile, parseUnifiedDocument, TopLevelDocument, UnifiedDocument } from "./root_types"

export const parsePaperAuthors = (rawPaper: any): Array<AuthorProfile> => {
  const rawAuthors = rawPaper.raw_authors || [];
  const claimedAuthors = rawPaper.authors || [];
  const nameToObjMap = {}

  for (let i = 0; i < rawAuthors.length; i++) {
    try {
      const current = rawAuthors[i];
      const key = (current.first_name + " " + current.last_name).toLowerCase();
      nameToObjMap[key] = parseAuthorProfile(current);
    }
    catch (error) {
      console.log('Error parsing author', rawAuthors[i]);
    }
  }

  for (let i = 0; i < claimedAuthors.length; i++) {
    try {
      const current = claimedAuthors[i];
      const key = (current.first_name + " " + current.last_name).toLowerCase();
      // Override raw_author if claimed author exists
      nameToObjMap[key] = { ...nameToObjMap[key], ...parseAuthorProfile(current) }
    }
    catch (error) {
      console.log('Error parsing author', claimedAuthors[i]);
    }
  }

  const finalAuthors = Object.values(nameToObjMap)
    .sort((a: any, b: any) => {
      return (a.sequence === "first" && b.sequence === "first")
        ? 0
        : a.sequence === "first"
          ? -1
          : 1
    });

  // @ts-ignore
  return finalAuthors;
}

export class Paper implements TopLevelDocument {
  _authors: AuthorProfile[]
  _unifiedDocument: UnifiedDocument
  _hubs: Hub[]
  _score: number
  _createdDate: string
  _discussionCount: number
  _userVote?: "downvote" | "upvote" | "neutralvote" | null
  _doi?: string
  _title: string
  _createdBy: CreatedBy | null
  _datePublished?: string
  _externalUrl?: string | undefined

  constructor(raw: any) {
    this._authors = parsePaperAuthors(raw)
    this._unifiedDocument = parseUnifiedDocument(raw.unified_document);
    this._score = raw.score;
    this._discussionCount = raw.discussion_count || 0;
    this._createdDate = raw.created_date;
    this._createdBy = parseCreatedBy(raw.uploaded_by);
    this._hubs = (raw.hubs || []).map(h => parseHub(h));
    this._title = raw.title;

    if (raw.user_vote) {
      this._userVote = userVoteToConstant(raw.user_vote)
    }
    if (raw.doi) {
      this._doi = raw.doi;
    }
    if (raw.publish_date) {
      this._datePublished = raw.publish_date;
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
