import { AuthorProfile, CreatedBy, ID, parseAuthorProfile, parseUnifiedDocument, UnifiedDocument } from "./root_types"

export type CommentContributionItem = {
  unifiedDocument: UnifiedDocument,
  plainText: string,
  createdBy: CreatedBy,
  id: ID,
}

export type PaperContributionItem = {
  unifiedDocument: UnifiedDocument,
  title: string,
  slug: string,
  createdBy: CreatedBy,
  id: ID,
}

export type ContentType = {
  name: "paper" | "post" | "hypothesis" | "comment" ,
  id: ID,
}

export type HypothesisContributionItem = {
  unifiedDocument: UnifiedDocument,
  title: string,
  slug: string,
  createdBy: CreatedBy,
  id: ID,
}

export type PostContributionItem = {
  unifiedDocument: UnifiedDocument,
  title: string,
  slug: string,
  createdBy: CreatedBy,
  id: ID,
}
export type FlaggedBy = {
  firstName: string,
  lastName: string,
  id: ID,
  authorProfile: AuthorProfile,
}

export type Verdict = {
  createdBy: CreatedBy,
  verdictChoice: string,
}

export type Contribution = {
  item: PaperContributionItem | PostContributionItem | HypothesisContributionItem | CommentContributionItem,
  createdDate: Date,
  contentType: ContentType,
  flaggedBy?: FlaggedBy,
  verdict?: Verdict,
  reason?: string,  
}

export const parseCreatedBy = (raw: any): CreatedBy => {
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

export const parseVerdict = (raw: any): Verdict => {

  const mapped = {
    "verdictChoice": raw.verdict_choice,
    "createdBy": parseCreatedBy(raw.created_by),
  }

  return mapped;
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
export const parseContentType = (raw: any): ContentType => {
  let contentTypeName;
  if (["thread", "comment", "reply"].includes(raw.name)) {
    contentTypeName = "comment";
  }
  else if (raw.name === "paper") {
    contentTypeName = "paper";
  }
  else if (raw.name === "researchhubpost") {
    contentTypeName = "post";
  }
  else if (raw.name === "hypothesis") {
    contentTypeName = "hypothesis";
  }
  else {
    throw Error("Could not parse object with content_type=" + raw.name)
  }    

  return {
    id: raw.id,
    name: contentTypeName,
  }
}

export const parseContribution = (raw: any): Contribution => {
  let mapped;

  if (["thread", "comment", "reply"].includes(raw.content_type.name)) {
    mapped = {
      "createdDate": raw.created_date,
      "item": parseCommentContribution(raw.item),
      "contentType": parseContentType(raw.content_type),
      "flaggedBy": parseFlaggedBy(raw.flagged_by),
      "verdict": parseVerdict(raw.verdict),
      "reason": raw.reason,
    }
  }
  else if (raw.content_type.name === "paper") {
    mapped = {
      "createdDate": raw.created_date,
      "item": parsePaperContribution(raw.item),
      "contentType": parseContentType(raw.content_type),
      "flaggedBy": parseFlaggedBy(raw.flagged_by),
      "verdict": parseVerdict(raw.verdict),
      "reason": raw.reason,      
    }
  }
  else if (raw.content_type.name === "researchhubpost") {
    mapped = {
      "createdDate": raw.created_date,
      "item": parsePostContributionItem(raw.item),
      "contentType": parseContentType(raw.content_type),
      "flaggedBy": parseFlaggedBy(raw.flagged_by),
      "verdict": parseVerdict(raw.verdict),
      "reason": raw.reason,      
    }
  }
  else if (raw.content_type.name === "hypothesis") {
    mapped = {
      "createdDate": raw.created_date,
      "item": parseHypothesisContributionItem(raw.item),
      "contentType": parseContentType(raw.content_type),
      "flaggedBy": parseFlaggedBy(raw.flagged_by),
      "verdict": parseVerdict(raw.verdict),
      "reason": raw.reason,      
    }
  }
  else {
    throw Error("Could not parse object with content_type=" + raw.content_type.name)
  }

  return mapped;
}

export const parseCommentContribution = (raw: any): CommentContributionItem => {
  const mapped = {
    "plainText": raw.plain_text,
    "createdBy": parseCreatedBy(raw.created_by),
    "unifiedDocument": parseUnifiedDocument(raw.unified_document),
    "id": raw.id,
  }

  return mapped;
}

export const parsePaperContribution = (raw: any): PaperContributionItem => {
  
  raw.unified_document.documents = {
    "id": raw.id,
    "title": raw.title,
    "slug": raw.slug,
  }

  const mapped = {
    "id": raw.id,
    "title": raw.title,
    "slug": raw.slug,
    "createdBy": parseCreatedBy(raw.uploaded_by),
    "unifiedDocument": parseUnifiedDocument(raw.unified_document),
  }

  return mapped;
}

export const parseHypothesisContributionItem = (raw: any): HypothesisContributionItem => {
  const mapped = {
    "title": raw.title,
    "slug": raw.slug,
    "createdBy": parseCreatedBy(raw.created_by),
    "unifiedDocument": parseUnifiedDocument(raw.unified_document),
    "id": raw.id,
  }

  return mapped;
}

export const parsePostContributionItem = (raw: any): PostContributionItem => {
  const mapped = {
    "title": raw.title,
    "slug": raw.slug,
    "createdBy": parseCreatedBy(raw.created_by),
    "unifiedDocument": parseUnifiedDocument(raw.unified_document),
    "id": raw.id,
  }

  return mapped;
}

