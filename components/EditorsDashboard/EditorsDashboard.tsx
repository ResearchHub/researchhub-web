import { css, StyleSheet } from "aphrodite";
import { ReactElement, useState } from "react";
import Head from "~/components/Head";
import EditorDashboardUserCard from "./EditorDashboardCard";
import EditorDashboardNavbar, {
  EditorDashFilters,
  filterOptions,
} from "./EditorDashboardNavbar";

export default function EditorsDashboard(): ReactElement<"div"> {
  const [filters, setFilters] = useState<EditorDashFilters>({
    selectedHub: null,
    timeframe: filterOptions[0],
  });

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
        <EditorDashboardUserCard
          authorProfile={{ first_name: "calvin", last_name: "lee", id: 1 }}
          commentCount={0}
          supportCount={0}
          submissionCount={0}
        />
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  editorsDashboard: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    paddingLeft: 32,
    width: "100%",
    maxWidth: 1400,
  },
  editorContainerWrap: {
    boxSizing: "border-box",
    marginTop: 16,
  },
});
