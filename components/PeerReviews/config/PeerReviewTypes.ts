import { ID, User } from "~/config/types/root_types";

export type UnifiedDocument = {
  id: ID,
}

export type PeerReview = {
  id: ID,
}

export type PeerReviewRequest = {
  id: ID,
  requestedByUser: string | User,
  unifiedDocument: ID | UnifiedDocument,
  docVersion: ID | any,
  status: string,
  peerReview: ID | PeerReview,
  createdDate: Date,
}
