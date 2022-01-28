import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";
import { fetchEditors } from "./api/fetchEditors";
import { ReactElement, useEffect, useMemo, useState } from "react";
import EditorDashboardUserCard from "./EditorDashboardCard";
import EditorDashboardNavbar, {
  EditorDashFilters,
  upDownOptions,
} from "./EditorDashboardNavbar";
import Head from "~/components/Head";
import LeaderboardFeedPlaceholder from "../Placeholders/LeaderboardFeedPlaceholder";
import Loader from "../Loader/Loader";
import LoadMoreButton from "~/components/LoadMoreButton";
import moment from 'moment';
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
    fetchEditors({
      hub_id: selectedHub?.id ?? null,
      onError,
      onSuccess,
      order_by: orderBy?.value,
      page,
      startDate: timeframe?.startDate?.format(),
      endDate: timeframe?.endDate?.format(),
    });
  }, [orderBy, page, selectedHub, timeframe]);
};

export default function EditorsDashboard(): ReactElement<"div"> {
  const [filters, setFilters] = useState<EditorDashFilters>({
    selectedHub: null,
    timeframe: {
      startDate: moment().add(-30, "days"),
      endDate: moment(),
    },
    orderBy: upDownOptions[0],
  });
  const [{page, hasMore, isLoadingMore}, setPaginationInfo] = useState<{
    page: number;
    hasMore?: boolean;
    isLoadingMore: boolean;
  }>({ page: 1, isLoadingMore: false });
  const [editors, setEditors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
    (): ReactElement<typeof EditorDashboardUserCard>[] =>
      editors.map(
        (
          editor: any,
          index: number
        ): ReactElement<typeof EditorDashboardUserCard> => {
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
          return (
            <EditorDashboardUserCard
              authorProfile={author_profile ?? {}}
              commentCount={comment_count}
              key={`editor-dash-user-card-${index}`}
              submissionCount={submission_count}
              supportCount={support_count}
              index={index}
              lastCommentDate={latest_comment_date}
              lastSubmissionDate={latest_submission_date}
              editorAddedDate={added_as_editor_date}
            />
          );
        }
      ),
    [editors, filters]
  );

  return (
    <div className={css(styles.editorsDashboard)}>
      <EditorDashboardNavbar
        currentFilters={filters}
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

const styles = StyleSheet.create({
  editorsDashboard: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minHeight: "100vh",
    padding: "0 32px",
    width: "100%",
    [`@media only screen and (max-width: 767px})`]: {
      maxWidth: "unset",
      paddingTop: 32,
      width: '100vw',
    },
  },
  editorCardContainer: {
    marginTop: 35,
    paddingBottom: 32,
  },
  placeholder: {
    marginTop: -35,
  },
  nav: {
    display: "flex",
    // marginBottom: 16,
    marginLeft: 60,

    "@media only screen and (max-width: 1023px)": {
      display: 'none',
    },
  },
  navContainer: {
    display: "flex",
    marginLeft: "auto",
  },
  navItem: {
    color: "#241F3A",
    opacity: 0.5,
  },
  last: {
    "@media only screen and (min-width: 1024px)": {
      paddingRight: 30,
      width: 120,
    },
    "@media only screen and (min-width: 1200px)": {
      paddingRight: 35,
      width: 120,
    },
  },
  rep: {
    [`@media only screen and (max-width: ${breakpoints.bigDesktop.int - 1}px)`]: {
      width: 50,
      paddingRight: 50,
    },
    [`@media only screen and (min-width: ${breakpoints.bigDesktop.str})`]: {
      paddingRight: 50,
      width: 100,
    },
  },
  submissions: {
    "@media only screen and (min-width: 1024px)": {
      paddingRight: 70,
    },
  },
  editorContainerWrap: {
    boxSizing: "border-box",
    marginTop: 16,
  },
});
