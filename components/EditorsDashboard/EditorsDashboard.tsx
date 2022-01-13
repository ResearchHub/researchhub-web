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
  useEffect((): void => {}, [
    filters.selectedHub,
    filters.timeframe,
    onError,
    onSuccess,
  ]);
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
        (): ReactElement<typeof EditorDashboardUserCard> => (
          <EditorDashboardUserCard
            authorProfile={{ first_name: "calvin", last_name: "lee", id: 1 }}
            commentCount={0}
            supportCount={0}
            submissionCount={0}
          />
        )
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
