import {
  AUTHOR_CLAIM_STATUS,
  AUTHOR_CLAIM_STATUS_LABEL,
} from "./constants/AuthorClaimStatus";
import {
  AuthorClaimCase,
  defaultPaginationInfo,
  formattedResult,
  PaginationInfo,
} from "./api/AuthorClaimCaseGetCases";
import { css, StyleSheet } from "aphrodite";
import { getCases } from "./api/AuthorClaimCaseGetCases";
import { useEffect, ReactElement, useState, Fragment } from "react";
import { useRouter, NextRouter } from "next/router";
import AuthorClaimCaseCard from "./AuthorClaimCaseCard";
import colors from "../../config/themes/colors";
import Ripples from "react-ripples";
import UnifiedDocFeedCardPlaceholder from "../UnifiedDocFeed/UnifiedDocFeedCardPlaceholder";
import Loader from "../Loader/Loader";
import { ValueOf } from "~/config/types/root_types";
import { nullthrows } from "~/config/utils/nullchecks";

type Props = {
  lastFetchTime: number;
  setLastFetchTime: Function;
};

const useEffectHandleCaseFetch = ({
  appendClaimCases,
  lastFetchTime,
  paginationInfo,
  setPaginationInfo,
}: {
  appendClaimCases: (moreCases: AuthorClaimCase[]) => void;
  lastFetchTime: number;
  paginationInfo: PaginationInfo;
  setPaginationInfo: (info: PaginationInfo) => void;
}): void => {
  const { caseStatus, page } = paginationInfo;
  useEffect((): void => {
    getCases({
      caseStatus: nullthrows(
        caseStatus,
        "Attempting to get cases without status"
      ),
      onSuccess: ({ claimCases, page, hasMore }: formattedResult): void => {
        appendClaimCases(claimCases);
        setPaginationInfo({
          caseStatus,
          hasMore,
          isLoadingMore: false,
          isPageLoading: false,
          page,
        });
      },
      onError: (): void => {
        setPaginationInfo({
          ...paginationInfo,
          isPageLoading: false,
          isLoadingMore: false,
        });
      },
      page,
    });
  }, [caseStatus, page, lastFetchTime]);
};

export default function AuthorClaimCaseContainer({
  lastFetchTime,
  setLastFetchTime,
}: Props): ReactElement<"div"> {
  const router = useRouter();
  // @ts-ignore url-status is implicitly set with the constant
  const queryCaseStatus = AUTHOR_CLAIM_STATUS[router?.query?.case_status ?? ""];
  const [claimCases, setClaimCases] = useState<Array<AuthorClaimCase>>([]);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    ...defaultPaginationInfo,
    caseStatus: queryCaseStatus,
  });
  const { hasMore, isLoadingMore, isPageLoading, page } = paginationInfo;

  useEffect((): void => {
    setPaginationInfo({
      ...defaultPaginationInfo,
      caseStatus: queryCaseStatus,
    });
  }, [lastFetchTime, queryCaseStatus]);

  useEffectHandleCaseFetch({
    appendClaimCases: (moreCases: AuthorClaimCase[]): void =>
      setClaimCases([...(page === 1 ? [] : claimCases), ...moreCases]),
    lastFetchTime,
    paginationInfo,
    setPaginationInfo,
  });

  const handleLoadMore = (): void => {
    if (!hasMore || isLoadingMore || isPageLoading) {
      return;
    }
    setPaginationInfo({
      ...paginationInfo,
      page: page + 1,
      isLoadingMore: true,
    });
  };

  const caseCards = claimCases.map(
    (claimCase: AuthorClaimCase): ReactElement<typeof AuthorClaimCaseCard> => {
      const caseID = claimCase.caseData.id || Date.now();
      return (
        <AuthorClaimCaseCard
          authorClaimCase={claimCase}
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
        [
          <UnifiedDocFeedCardPlaceholder
            color={colors.PLACEHOLDER_CARD_BACKGROUND}
            key={"case-placeholder-1"}
          />,
          <UnifiedDocFeedCardPlaceholder
            color={colors.PLACEHOLDER_CARD_BACKGROUND}
            key={"case-placeholder-2"}
          />,
          <UnifiedDocFeedCardPlaceholder
            color={colors.PLACEHOLDER_CARD_BACKGROUND}
            key={"case-placeholder-3"}
          />,
        ]
      ) : caseCards.length > 0 ? (
        <div>
          {caseCards}
          <div className={css(styles.loadMoreButtonWrap)}>
            {hasMore && (
              <Ripples
                className={css(styles.loadMoreButton)}
                onClick={handleLoadMore}
              >
                {isLoadingMore ? (
                  <Loader
                    key={"authored-loader"}
                    loading={true}
                    size={25}
                    color={colors.BLUE()}
                  />
                ) : (
                  "Load More"
                )}
              </Ripples>
            )}
          </div>
        </div>
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
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "center",
    paddingTop: 24,
    width: "100%",
    maxWidth: "1200px",
  },
  loadMoreButtonWrap: {
    boxSizing: "border-box",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginBottom: 16,
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
  loadMoreButton: {
    fontSize: 14,
    border: `1px solid ${colors.BLUE()}`,
    boxSizing: "border-box",
    borderRadius: 4,
    height: 45,
    width: 155,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: colors.BLUE(),
    cursor: "pointer",
    userSelect: "none",
    ":hover": {
      color: "#FFF",
      backgroundColor: colors.BLUE(),
    },
  },
});
