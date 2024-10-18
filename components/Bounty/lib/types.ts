import { Hub, parseHub } from "~/config/types/hub";
import {
  ID,
  parseAuthorProfile,
  parseUnifiedDocument,
  parseUser,
} from "~/config/types/root_types";

export type SimpleBounty = {
  id: string;
  amount: number;
  content: any;
  createdBy: any;
  expirationDate: string;
  createdDate: string;
  unifiedDocument: any;
  hubs: Hub[];
  bountyType: string;
};

export const parseSimpleBounty = (raw: any): SimpleBounty => {
  return {
    id: raw.id,
    amount: raw.total_amount,
    content: raw.item.comment_content_json,
    bountyType: raw.bounty_type,
    createdDate: raw.created_date,
    createdBy: parseUser(raw.created_by),
    expirationDate: raw.expiration_date,
    unifiedDocument: parseUnifiedDocument(raw.unified_document),
    hubs: (raw?.hubs || [])
      .map(parseHub)
      .filter((hub: Hub) => hub.isUsedForRep === true),
  };
};