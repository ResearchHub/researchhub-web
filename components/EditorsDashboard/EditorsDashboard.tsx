import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";
import { ReactElement, useEffect, useMemo, useState } from "react";
import Head from "~/components/Head";
import EditorDashboardUserCard from "./EditorDashboardCard";
import EditorDashboardNavbar, {
  EditorDashFilters,
  filterOptions,
} from "./EditorDashboardNavbar";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";
import { fetchEditors } from "./api/fetchEditors";

type UseEffectFetchEditorsArgs = {
  filters: EditorDashFilters;
  onError: Function;
  onSuccess: Function;
};

const useEffectFetchEditors = ({
  filters,
  onError,
  onSuccess,
}: UseEffectFetchEditorsArgs): void => {
  const { selectedHub, timeframe } = filters;
  useEffect((): void => {
    fetchEditors({
      hubID: selectedHub?.id ?? null,
      onError,
      onSuccess,
      timeframe: timeframe?.value ?? null,
    });
  }, [selectedHub, timeframe, onError, onSuccess]);
};

export default function EditorsDashboard(): ReactElement<"div"> {
  const [filters, setFilters] = useState<EditorDashFilters>({
    selectedHub: null,
    timeframe: filterOptions[0],
  });
  const [editors, setEditors] = useState<any[]>([]);

  useEffectFetchEditors({
    filters,
    onError: emptyFncWithMsg,
    onSuccess: setEditors,
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
          } = editor ?? {};
          return (
            <EditorDashboardUserCard
              authorProfile={author_profile ?? {}}
              commentCount={comment_count}
              key={`editor-dash-user-card-${index}`}
              submissionCount={submission_count}
              supportCount={support_count}
            />
          );
        }
      ),
    [editors, filters.selectedHub, filters.timeframe]
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
      <div className={css(styles.editorContainerWrap)}>{editorCards}</div>
    </div>
  );
}

const styles = StyleSheet.create({
  editorsDashboard: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    maxWidth: 1400,
    padding: "0 32px",
    width: "100%",
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      maxWidth: "unset",
      paddingTop: 32,
    },
  },
  editorContainerWrap: {
    boxSizing: "border-box",
    marginTop: 16,
  },
});
