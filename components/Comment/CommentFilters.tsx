import { css, StyleSheet } from "aphrodite";
import { useContext } from "react";
import { NullableString } from "~/config/types/root_types";
import colors from "./lib/colors";
import { CommentTreeContext } from "./lib/contexts";
import { filterOpts } from "./lib/options";

type Args = {
  selectedFilterValue: NullableString;
  handleSelect: Function;
  hideOptions?: Array<string | null>;
};

const CommentFilters = ({
  selectedFilterValue,
  handleSelect,
  hideOptions = [],
}: Args) => {
  const commentTreeState = useContext(CommentTreeContext);
  const selectedFilter =
    filterOpts.find((f) => f.value === selectedFilterValue) || filterOpts[0];
  const _filterOpts = filterOpts.filter((f) => !hideOptions.includes(f.value));
  const isNarrowWidthContext =
    commentTreeState.context === "sidebar" ||
    commentTreeState.context === "drawer";

  return (
    <div
      className={css(
        styles.filtersWrapper,
        isNarrowWidthContext && styles.sectionForNarrowWidthContexts
      )}
    >
      {_filterOpts.map((f) => {
        return (
          <div key={`filter-${f.value}`}>
            {f.value === selectedFilter.value ? (
              <div
                className={css([styles.filter, styles.filterSelected])}
                key={`filter-${f.value}`}
              >
                {f.label}
              </div>
            ) : (
              <div
                onClick={() => handleSelect(f.value)}
                className={css([styles.filter, styles.filterUnselected])}
                key={`filter-${f.value}`}
              >
                {f.label}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const styles = StyleSheet.create({
  filtersWrapper: {
    display: "flex",
    alignItems: "center",
    columnGap: "6px",
    userSelect: "none",
  },
  filter: {
    borderRadius: "4px",
    padding: "6px 10px",
    cursor: "pointer",
    color: colors.filters.unselected.text,
  },
  filterUnselected: {
    ":hover": {
      background: colors.hover.background,
      transition: "0.3s",
    },
  },
  filterSelected: {
    color: colors.filters.selected.text,
    background: colors.filters.selected.background,
  },
  sectionForNarrowWidthContexts: {
    marginLeft: 25,
  },
});

export default CommentFilters;
