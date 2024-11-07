import { parseUser } from "~/config/types/root_types";

import { ID, RHUser } from "~/config/types/root_types";
import { formatDateStandard } from "~/config/utils/dates";

export type PeerReview = {
  id: number;
  commentThread: ID
  paper: ID;
  status: "PENDING" | "APPROVED" | "CHANGES_REQUESTED";
  user: RHUser;
  createdDate: Date;
  updatedDate: Date;
  formattedCreatedDate: string;
};

export const parsePeerReview = (raw: any): PeerReview => {
  return {
    id: raw.id,
    commentThread: raw.comment_thread,
    paper: raw.paper,
    status: raw.status,
    user: parseUser(raw.user),
    createdDate: new Date(raw.created_date),
    updatedDate: new Date(raw.updated_date),
    formattedCreatedDate: formatDateStandard(raw.created_date),
  };
};