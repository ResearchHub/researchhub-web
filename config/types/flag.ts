import { CommentContribution, HypothesisContribution, PaperContribution, parseCommentContribution, parseHypothesisContribution, parsePaperContribution, parsePostContribution, PostContribution } from "./contribution"
import { AuthorProfile, CreatedBy, ID, parseAuthorProfile } from "./root_types"

export type FlaggedBy = {
  firstName: string,
  lastName: string,
  id: ID,
  authorProfile: AuthorProfile,
}

export type FlaggedContribution = {
  id: ID,
  item: PaperContribution | PostContribution | HypothesisContribution | CommentContribution,
  createdDate: Date,
  contentType: "paper" | "post" | "hypothesis" | "comment"
  flaggedBy: FlaggedBy,
  reason: string,
}

export const parseFlaggedBy = (raw: any): FlaggedBy => {
  raw.author_profile.first_name = raw.first_name;
  raw.author_profile.last_name = raw.last_name;

  const mapped = {
    "id": raw.id,
    "firstName": raw.first_name,
    "lastName": raw.last_name,
    "authorProfile": parseAuthorProfile(raw.author_profile)
  }

  return mapped;
}

export const parseFlaggedContribution = (raw: any): FlaggedContribution => {
  let mapped;

  if (["thread", "comment", "reply"].includes(raw.content_type)) {
    mapped = {
      "id": raw.id,
      "createdDate": raw.created_date,
      "item": parseCommentContribution(raw.item),
      "contentType": "comment",
      "flaggedBy": parseFlaggedBy(raw.flagged_by),
      "reason": raw.reason,
    }
  }
  else if (raw.content_type === "paper") {
    mapped = {
      "id": raw.id,
      "createdDate": raw.created_date,
      "item": parsePaperContribution(raw.item),
      "contentType": "paper",
      "flaggedBy": parseFlaggedBy(raw.flagged_by),
      "rason": raw.reason,
    }
  }
  else if (raw.content_type === "researchhub post") {
    mapped = {
      "id": raw.id,
      "createdDate": raw.created_date,
      "item": parsePostContribution(raw.item),
      "contentType": "post",
      "flaggedBy": parseFlaggedBy(raw.flagged_by),
      "rason": raw.reason,
    }
  }
  else if (raw.content_type === "hypothesis") {
    mapped = {
      "id": raw.id,
      "createdDate": raw.created_date,
      "item": parseHypothesisContribution(raw.item),
      "contentType": "hypothesis",
      "flaggedBy": parseFlaggedBy(raw.flagged_by),
      "rason": raw.reason,
    }
  }
  else {
    throw Error("Could not parse object with content_type=" + raw.content_type)
  }

  return mapped;
}