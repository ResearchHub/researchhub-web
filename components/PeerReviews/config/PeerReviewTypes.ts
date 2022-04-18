import { parse } from "@ethersproject/transactions";
import { ID } from "~/config/types/root_types";

export type Post = {
  id: ID,
  title?: string,
  slug?: string,
}

export type UnifiedDocument = {
  id: ID,
  documentType: string,
  document?: Post,
}

export type PeerReview = {
  id: ID,
}

export type AuthorProfile = {
  id: ID,
  profileImage?: string,
  firstName?: string, 
  lastName?: string, 
}

export type User = {
  authorProfile?: AuthorProfile,
  id: ID,
}

export type PeerReviewInvite = {
  id?: ID,
  recipient?: User,
  status?: string,
}
export type PeerReviewRequest = {
  id: ID,
  requestedByUser?: User,
  unifiedDocument?: UnifiedDocument,
  docVersion?: any,
  status?: string,
  peerReview?: PeerReview,
  createdDate?: Date,
  invites?: PeerReviewInvite[],
}

export const parseUnifiedDocument = (raw: any): UnifiedDocument => {
  if (typeof(raw) !== "object") {
    return raw;
  }

  const parsed = {
    id: raw.id,
    documentType: raw.document_type,
  }

  if (Array.isArray(raw.documents)) {
    parsed["document"] = parsePost(raw.documents[0]);
  }

  return parsed;
}

export const parsePost = (raw: any): Post => {
  if (typeof(raw) !== "object") {
    return raw;
  }

  return {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
  }
}

export const parseAuthorProfile = (raw: any): AuthorProfile => {
  if (typeof(raw) !== "object") {
    return raw;
  }

  const parsed = {
    id: raw.id,
    profileImage: raw.profile_image,
    firstName: raw.first_name,
    lastName: raw.last_name,
  }

  return parsed;
}

export const parseUser = (raw: any): User => {
  const parsed = {
    id: raw.id,
    authorProfile: parseAuthorProfile(raw.author_profile)
  }

  return parsed;
}

export const parsePeerReviewRequest = (raw: any): PeerReviewRequest => {
  const mapped = {
    id: raw.id,
    createdDate: raw.created_date,
    docVersion: raw.doc_version,
    peerReview: raw.peer_review,
    requestedByUser: parseUser(raw.requested_by_user),
    status: raw.status,
    invites: (raw.invites ?? []).map((i: any) : PeerReviewInvite => parseInvite(i)),
    unifiedDocument: parseUnifiedDocument(raw.unified_document),
  }

  return mapped;
}

export const parseInvite = (raw: any): PeerReviewInvite => {
  return {
    id: raw.id,
    recipient: parseUser(raw.recipient),
    status: raw.status,
  }
}