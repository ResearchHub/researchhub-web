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
    // fetchEditors({
    //   hub_id: selectedHub?.id ?? null,
    //   onError,
    //   onSuccess,
    //   order_by: orderBy?.value,
    //   page,
    //   startDate: timeframe?.startDate?.toISOString(),
    //   endDate: timeframe?.endDate?.toISOString(),
    // });
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
  const [editors, setEditors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editorActiveContributors, setEditorActiveContributors] = useState<
    any[]
  >([]);

  useEffectFetchEditors({
    filters,
    isLoadingMore,
    onError: emptyFncWithMsg,
    onSuccess: (editorResults: any): void => {
      const { page, has_more } = editorResults;
      setEditors([...editors, ...editorResults.result]);
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
    (): ReactElement<"div">[] =>
      editors.map((editor: any, index: number): ReactElement<"div"> => {
        const {
          author_profile,
          comment_count = 0,
          submission_count = 0,
          support_count = 0,
          latest_comment_date = null,
          latest_submission_date = null,
          id,
        } = editor ?? {};

        const added_as_editor_date = author_profile.added_as_editor_date;
        return <div>{"card"}</div>;
      }),
    [editors, filters, editorActiveContributors]
  );

  return (
    <div className={css(styles.dashboard)}>
      <LeaderDashboardNavbar
        currentFilters={filters}
        headerLabel="Hub Leaders"
        onFilterChange={(updatedFilters: EditorDashFilters): void => {
          setFilters({ ...updatedFilters });
          setIsLoading(true);
          setEditors([]);
          setPaginationInfo({
            page: 1,
            hasMore: undefined,
            isLoadingMore: false,
          });
        }}
      />
      <Head />
      <div className={css(styles.nav)}>
        <div className={css(styles.navItem)}>User</div>
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
