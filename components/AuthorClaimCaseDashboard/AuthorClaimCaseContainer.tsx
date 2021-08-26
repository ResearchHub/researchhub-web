import {
  AUTHOR_CLAIM_STATUS,
  AUTHOR_CLAIM_STATUS_LABEL,
} from "./constants/AuthorClaimStatus";
import { AuthorClaimCase } from "./api/AuthorClaimCaseGetCases";
import { css, StyleSheet } from "aphrodite";
import { getCases } from "./api/AuthorClaimCaseGetCases";
import { INNER_EL_WIDTH } from "./AuthorClaimCaseDashboard";
import { useRouter, NextRouter } from "next/router";
import AuthorClaimCaseCard from "./AuthorClaimCaseCard";
import { useEffect, ReactElement, useState, Fragment } from "react";
import * as React from "react";
import colors from "../../config/themes/colors";

type Props = {
  lastFetchTime: number;
  setLastFetchTime: Function;
};

const useEffectHandleCaseFetch = ({
  currRouter,
  lastFetchTime,
  setClaimCases,
  setIsPageLoading,
}: {
  currRouter: NextRouter;
  lastFetchTime: number;
  setClaimCases: React.Dispatch<React.SetStateAction<AuthorClaimCase[]>>;
  setIsPageLoading: Function;
}): void => {
  // @ts-ignore url-status is implicitly set with the constant
  const queriedStatus = AUTHOR_CLAIM_STATUS[currRouter.query.case_status];
  useEffect((): void => {
    setIsPageLoading(true);
    getCases({
      caseStatus: queriedStatus,
      onSuccess: (response): void => {
        setClaimCases(response);
        setIsPageLoading(false);
      },
      onError: (): void => {
        setIsPageLoading(false);
      },
    });
  }, [lastFetchTime, queriedStatus, setClaimCases]);
};

export default function AuthorClaimCaseContainer({
  lastFetchTime,
  setLastFetchTime,
}: Props): ReactElement<"div"> {
  const router = useRouter();
  const [claimCases, setClaimCases] = useState<Array<AuthorClaimCase>>([]);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  useEffectHandleCaseFetch({
    lastFetchTime,
    currRouter: router,
    setClaimCases,
    setIsPageLoading,
  });

  const caseCards = claimCases.map(
    (claimCase: AuthorClaimCase): ReactElement<typeof AuthorClaimCaseCard> => {
      const caseID = claimCase.caseData.id || Date.now();
      return (
        <AuthorClaimCaseCard
          authorClaimCase={claimCase}
          cardWidth={INNER_EL_WIDTH}
          key={`author-claim-case-card-${caseID}`}
          setLastFetchTime={setLastFetchTime}
        />
      );
    }
  );

  // @ts-ignore url-status is implicitly set with the constant
  const caseStatusLabel = AUTHOR_CLAIM_STATUS_LABEL[router.query.case_status];
  return (
    <div className={css(styles.authorClaimCaseContainer)}>
      {isPageLoading ? (
        <Fragment />
      ) : caseCards.length > 0 ? (
        caseCards
      ) : (
        <div
          className={css(styles.noCaseFound)}
        >{`No ${caseStatusLabel} Cases Found`}</div>
      )}
    </div>
  );
}

const styles = StyleSheet.create({
  authorClaimCaseContainer: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "center",
    paddingTop: 24,
    width: "100%",
  },
  noCaseFound: {
    alignContent: "center",
    color: colors.GREY(1),
    display: "flex",
    fontSize: 24,
    height: "100%",
    justifyContent: "center",
    width: "100%",
  },
});
