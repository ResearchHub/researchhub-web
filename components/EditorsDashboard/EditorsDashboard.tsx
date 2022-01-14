import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";
import { fetchEditors } from "./api/fetchEditors";
import { ReactElement, useEffect, useMemo, useState } from "react";
import colors from "~/config/themes/colors";
import Head from "~/components/Head";
import EditorDashboardUserCard from "./EditorDashboardCard";
import EditorDashboardNavbar, {
  EditorDashFilters,
  filterOptions,
  upDownOptions,
} from "./EditorDashboardNavbar";
import Loader from "../Loader/Loader";

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
      <div className={css(styles.editorContainerWrap)}>
        {isLoading ? (
          <Loader loading={true} size={16} color={colors.BLUE()} />
        ) : (
          editorCards
        )}
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
