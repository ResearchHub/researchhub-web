import { userVoteToConstant } from "../constants"
import { parseCreatedBy } from "./contribution"
import { Hub, parseHub } from "./hub"
import { AuthorProfile, CreatedBy, parseAuthorProfile, parseUnifiedDocument, TopLevelDocument, UnifiedDocument } from "./root_types"

export class Post implements TopLevelDocument {
  authors: AuthorProfile[]
  hubs: Hub[]
  score: number
  createdDate: string
  discussionCount: number
  unifiedDocument: UnifiedDocument
  userVote?: "downvote" | "upvote" | "neutralvote" | null
  doi?: string
  title: string
  createdBy: CreatedBy | null

  constructor(raw:any) {
    this.authors = (raw.authors || []).map(a => parseAuthorProfile(a))  
    this.score = raw.score;
    this.discussionCount = raw.discussion_count || 0;
    this.createdDate = raw.created_date;
    this.createdBy = parseCreatedBy(raw.created_by);
    this.unifiedDocument = parseUnifiedDocument(raw.unified_document);
    this.hubs = (raw.hubs || []).map(h => parseHub(h));
    this.title = raw.title;
    
    if (raw.user_vote) {
      this.userVote = userVoteToConstant(raw.user_vote)
    }
    if (raw.doi) {
      this.doi = raw.doi;
    }
  }
}