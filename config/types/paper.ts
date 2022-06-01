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
  authors: AuthorProfile[]
  hubs: Hub[]
  score: number
  createdDate: string
  discussionCount: number
  _unifiedDocument: UnifiedDocument
  userVote?: "downvote" | "upvote" | "neutralvote" | null
  doi?: string
  title: string
  createdBy: CreatedBy | null
  datePublished?: string
  externalUrl?: string | undefined

  constructor(raw: any) {
    this.authors = parsePaperAuthors(raw)
    this.score = raw.score;
    this.discussionCount = raw.discussion_count || 0;
    this.createdDate = raw.created_date;
    this.createdBy = parseCreatedBy(raw.created_by);
    this._unifiedDocument = parseUnifiedDocument(raw.unified_document);
    this.hubs = (raw.hubs || []).map(h => parseHub(h));
    this.title = raw.title;

    if (raw.user_vote) {
      this.userVote = userVoteToConstant(raw.user_vote)
    }
    if (raw.doi) {
      this.doi = raw.doi;
    }
    if (raw.publish_date) {
      this.datePublished = raw.publish_date;
    }
  }

  get unifiedDocument():UnifiedDocument {
    return this._unifiedDocument;
  }
}
