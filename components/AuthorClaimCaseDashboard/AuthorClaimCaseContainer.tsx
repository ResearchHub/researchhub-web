import { AUTHOR_CLAIM_STATUS } from "./constants/AuthorClaimStatus";
import { css, StyleSheet } from "aphrodite";
import { INNER_EL_WIDTH } from "./AuthorClaimCaseDashboard";
import { useRouter, NextRouter } from "next/router";
import AuthorClaimCaseCard, { AuthorClaimCase } from "./AuthorClaimCaseCard";
import React, { useEffect, ReactElement, useState } from "react";
import { nullthrows } from "../../config/utils/nullchecks";
import { getCardAllowedActions } from "./util/AuthorClaimCaseUtil";
import { ValueOf } from "../../config/types/root_types";

const useEffectHandleCaseFetch = (
  currRouter: NextRouter,
  setClaimCases: React.Dispatch<React.SetStateAction<AuthorClaimCase[]>>
): void => {
  // @ts-ignore url-status is implicitly set with the constant
  const queriedStatus = AUTHOR_CLAIM_STATUS[currRouter.query.case_status];
  useEffect((): void => {
    // TODO: calvinhlee - hook up backend fetch here.
    console.warn("QUERYING FOR: ", queriedStatus);
    setClaimCases([
      {
        caseStatus: queriedStatus,
        requestID: 1,
        requestorEmail: "calvinhlee@berkeley.edu",
        requestorName: "Calvin Lee",
        targetAuthorID: 4,
        targetAuthorName: "Calvin YOYO Lee",
      },
      {
        caseStatus: queriedStatus,
        requestID: 1,
        requestorEmail: "calvinhlee@berkeley.edu",
        requestorName: "Calvin Lee",
        targetAuthorID: 3,
        targetAuthorName: "Calvin YOYO Lee",
      },
    ]);
  }, [queriedStatus]);
};

export default function AuthorClaimCaseContainer(): ReactElement<"div"> {
  const router = useRouter();
  const [claimCases, setClaimCases] = useState<Array<AuthorClaimCase>>([]);

  useEffectHandleCaseFetch(router, setClaimCases);

  const caseCards = claimCases.map(
    (claimCase: AuthorClaimCase): ReactElement<typeof AuthorClaimCaseCard> => (
      <AuthorClaimCaseCard
        allowedActions={getCardAllowedActions(claimCase.caseStatus)}
        authorClaimCase={claimCase}
        cardWidth={INNER_EL_WIDTH}
        key={`author-claim-case-card-${nullthrows(claimCase.requestID)}`}
      />
    )
  );
  return <div className={css(styles.authorClaimCaseContainer)}></div>;
}

const styles = StyleSheet.create({
  authorClaimCaseContainer: {
    alignItems: "center",
    backgroundColor: "red",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "center",
    paddingTop: 36,
    width: "100%",
  },
});
