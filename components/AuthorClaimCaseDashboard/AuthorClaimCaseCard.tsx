import { AUTHOR_CLAIM_STATUS } from "./constants/AuthorClaimStatus";
import { ID, ValueOf } from "../../config/types/root_types";
import React, { ReactElement, useState } from "react";

export type AuthorClaimCase = {
  caseID: ID;
  caseStatus: ValueOf<typeof AUTHOR_CLAIM_STATUS> | string;
  requestorID: ID;
  requestorEmail: string;
  requestorName: string;
  targetAuthorID: ID;
  targetAuthorName: string;
};

type Props = {
  allowedActions: Array<ValueOf<typeof AUTHOR_CLAIM_STATUS>>;
  authorClaimCase: AuthorClaimCase;
  cardWidth: number | string;
};

export default function AuthorClaimCaseCard({
  allowedActions,
  authorClaimCase,
  cardWidth,
}: Props): ReactElement<"div"> {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  return <div style={{ width: cardWidth }}>This is card</div>;
}
