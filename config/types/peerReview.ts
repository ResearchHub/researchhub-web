import { ID, RHUser, UnifiedDocument, parseUser, parseUnifiedDocument } from "~/config/types/root_types";

export type PeerReview = {
  id: ID,
}

export type PeerReviewScoreSummary = {
  avg: number,
  count: number,
}

export type PeerReviewInvite = {
  id?: ID,
  recipient?: RHUser,
  status?: "ACCEPTED" | "DECLINED" | "INVITED",
}

export type PeerReviewRequest = {
  id: ID,
  requestedByUser?: RHUser,
  unifiedDocument?: UnifiedDocument,
  docVersion?: any,
  status?: string,
  peerReview?: PeerReview,
  createdDate?: Date,
  invites?: PeerReviewInvite[],
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

export const parsePeerReviewScoreSummary = (raw: any): PeerReviewScoreSummary => {
  return {
    avg: raw.avg,
    count: raw.count,
  }
}
