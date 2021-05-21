import { css, StyleSheet } from "aphrodite";
import { AUTHOR_CLAIM_STATUS } from "./constants/AuthorClaimStatus";
import { ID, ValueOf } from "../../config/types/root_types";
import React, { ReactElement, useState } from "react";
import colors from "../../config/themes/colors";

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
  return (
    <div
      className={css(styles.authorClaimCaseCard)}
      onClick={(): void => setIsCollapsed(false)}
      role="none"
      style={{ width: cardWidth }}
    >
      <div>This is card</div>
      {!isCollapsed ? <div> This cardBody </div> : null}
    </div>
  );
}

const styles = StyleSheet.create({
  authorClaimCaseCard: {
    backgroundColor: "#FFF",
    border: `1px solid ${colors.GREY(0.5)}`,
    borderRadius: 4,
    marginBottom: 16,
    minHeight: 100,
  },
});
