import { AUTHOR_CLAIM_STATUS } from "../constants/AuthorClaimStatus";
import { ValueOf } from "../../../config/types/root_types";

const { APPROVED, DENIED, OPEN, CLOSED, NULLIFIED } = AUTHOR_CLAIM_STATUS;

export const getCardAllowedActions = (
  caseStatus: ValueOf<typeof AUTHOR_CLAIM_STATUS>
): Array<ValueOf<typeof AUTHOR_CLAIM_STATUS>> => {
  switch (caseStatus) {
    case OPEN:
      return [CLOSED, DENIED, APPROVED];
    default:
      return [];
  }
};
