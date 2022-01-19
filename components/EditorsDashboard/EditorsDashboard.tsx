import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";
import { fetchEditors } from "./api/fetchEditors";
import { ReactElement, useEffect, useMemo, useState } from "react";
import Head from "~/components/Head";
import EditorDashboardUserCard from "./EditorDashboardCard";
import EditorDashboardNavbar, {
  EditorDashFilters,
  filterOptions,
  upDownOptions,
} from "./EditorDashboardNavbar";
import ReactPlaceholder from "react-placeholder";
import LeaderboardFeedPlaceholder from "../Placeholders/LeaderboardFeedPlaceholder";

type UseEffectFetchEditorsArgs = {
  filters: EditorDashFilters;
  onError: Function;
  onSuccess: Function;
  setIsLoading: (flag: boolean) => void;
};

const useEffectFetchEditors = ({
  filters,
  onError,
  onSuccess,
  setIsLoading,
}: UseEffectFetchEditorsArgs): void => {
  const { orderBy, selectedHub, timeframe } = filters;
  useEffect((): void => {
    setIsLoading(true);
    fetchEditors({
      hub_id: selectedHub?.id ?? null,
      onError,
      onSuccess,
      order_by: orderBy?.value,
      timeframe_str: timeframe?.value ?? null,
    });
  }, [orderBy, selectedHub, timeframe]);
};

export default function EditorsDashboard(): ReactElement<"div"> {
  const [filters, setFilters] = useState<EditorDashFilters>({
    selectedHub: null,
    timeframe: filterOptions[0],
    orderBy: upDownOptions[0],
  });
  const [editors, setEditors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffectFetchEditors({
    filters,
    onError: emptyFncWithMsg,
    onSuccess: (editorResults: any[]): void => {
      setEditors(editorResults);
      setIsLoading(false);
    },
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
        onFilterChange={(updatedFilters: EditorDashFilters): void =>
          setFilters({ ...updatedFilters })
        }
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
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      maxWidth: "unset",
      paddingTop: 32,
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
    width: "100%",
    // marginBottom: 16,
    marginLeft: 60,
  },
  navContainer: {
    display: "flex",
    marginLeft: "auto",
    paddingRight: 50,
  },
  navItem: {
    color: "#241F3A",
    opacity: 0.5,
  },
  last: {
    "@media only screen and (min-width: 1024px)": {
      paddingRight: 40,
      width: 120,
    },
  },
  rep: {
    "@media only screen and (min-width: 1024px)": {
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
