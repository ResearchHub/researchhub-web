import { css } from "aphrodite";
import { styles } from "~/components/EditorsDashboard/EditorsDashboard";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";
import { ReactElement, useEffect, useMemo, useState } from "react";
// import EditorDashboardUserCard from "~/component/EditorsDashboard/EditorDashboardCard";
import LeaderDashboardNavbar, {
  EditorDashFilters,
  upDownOptions,
} from "~/components/EditorsDashboard/LeaderDashboardNavbar";
import Head from "~/components/Head";
import LeaderboardFeedPlaceholder from "../Placeholders/LeaderboardFeedPlaceholder";
import Loader from "../Loader/Loader";
import LoadMoreButton from "~/components/LoadMoreButton";
import moment from "moment";
import ReactPlaceholder from "react-placeholder";
import { fetchLeadingHubs } from "./api/fetchLeadingHubs";
import HubLeaderDashboardCard from "./HubLeaderDashboardCard";

type UseEffectFetchEditorsArgs = {
  filters: EditorDashFilters;
  isLoadingMore: boolean;
  onError: Function;
  onSuccess: Function;
  page: number;
  setIsLoading: (flag: boolean) => void;
};

const useEffectFetchEditors = ({
  filters,
  isLoadingMore,
  onError,
  onSuccess,
  page,
  setIsLoading,
}: UseEffectFetchEditorsArgs): void => {
  const { orderBy, selectedHub, timeframe } = filters;
  useEffect((): void => {
    !isLoadingMore ?? setIsLoading(true);
    fetchLeadingHubs({
      hub_id: selectedHub?.id ?? null,
      onError,
      onSuccess,
      order_by: orderBy?.value,
      page,
      start_date: timeframe?.startDate?.toISOString(),
      end_date: timeframe?.endDate?.toISOString(),
    });
  }, [orderBy, page, selectedHub, timeframe]);
};

export default function HubLeaderDashboard(): ReactElement<"div"> {
  const [filters, setFilters] = useState<EditorDashFilters>({
    selectedHub: null,
    timeframe: {
      startDate: moment().add(-30, "days"),
      endDate: moment(),
    },
    orderBy: upDownOptions[0],
  });
  const [{ page, hasMore, isLoadingMore }, setPaginationInfo] = useState<{
    page: number;
    hasMore?: boolean;
    isLoadingMore: boolean;
  }>({ page: 1, isLoadingMore: false });
  const [hubs, setHubs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffectFetchEditors({
    filters,
    isLoadingMore,
    onError: emptyFncWithMsg,
    onSuccess: (hubResults: any): void => {
      const { page, has_more, result } = hubResults;
      setHubs([...hubs, ...result]);
      setIsLoading(false);
      setPaginationInfo({
        hasMore: has_more,
        isLoadingMore: false,
        page: parseInt(page),
      });
    },
    page,
    setIsLoading,
  });

  const editorCards = useMemo(
    (): ReactElement<typeof HubLeaderDashboardCard>[] =>
      hubs.map(
        (
          hub: any,
          index: number
        ): ReactElement<typeof HubLeaderDashboardCard> => {
          const {
            comment_count = 0,
            hub_image,
            latest_comment_date = null,
            latest_submission_date = null,
            name,
            submission_count = 0,
            support_count = 0,
          } = hub ?? {};

          return (
            <HubLeaderDashboardCard
              commentCount={comment_count}
              hubImage={hub_image}
              index={index}
              key={`${name}-${index}`}
              lastCommentDate={latest_comment_date ?? ""}
              lastSubmissionDate={latest_submission_date ?? ""}
              name={name}
              submissionCount={submission_count}
              supportCount={support_count}
            />
          );
        }
      ),
    [hubs, filters]
  );

  return (
    <div className={css(styles.dashboard)}>
      <LeaderDashboardNavbar
        currentFilters={filters}
        headerLabel={`Top Hubs`}
        onFilterChange={(updatedFilters: EditorDashFilters): void => {
          setFilters({ ...updatedFilters });
          setIsLoading(true);
          setHubs([]);
          setPaginationInfo({
            page: 1,
            hasMore: undefined,
            isLoadingMore: false,
          });
        }}
      />
      <Head />
      <div className={css(styles.nav)}>
        <div className={css(styles.navItem)}>Hubs</div>
        <div className={css(styles.navContainer)}>
          <div className={css(styles.navItem, styles.rep, styles.last)}>
            Last Submission
          </div>
          <div className={css(styles.navItem, styles.rep, styles.last)}>
            Last Comment
          </div>
          <div className={css(styles.navItem, styles.rep, styles.submissions)}>
            Submissions
          </div>
          <div className={css(styles.navItem, styles.rep)}>Supports</div>
          <div className={css(styles.navItem, styles.rep)}>Comments</div>
        </div>
      </div>
      <div className={css(styles.editorContainerWrap)}>
        <div className={css(styles.placeholder)}>
          <ReactPlaceholder
            ready={!isLoading}
            customPlaceholder={
              <LeaderboardFeedPlaceholder color="#efefef" rows={5} />
            }
          >
            <div className={css(styles.editorCardContainer)}>{editorCards}</div>
            {isLoadingMore ? (
              <Loader size={24} />
            ) : hasMore ? (
              <LoadMoreButton
                label="Load More"
                onClick={(): void =>
                  setPaginationInfo({
                    hasMore: undefined,
                    isLoadingMore: true,
                    page: page + 1,
                  })
                }
              />
            ) : null}
          </ReactPlaceholder>
        </div>
      </div>
    </div>
  );
}
