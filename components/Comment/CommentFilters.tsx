import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { css, StyleSheet } from "aphrodite";
import colors from "./lib/colors";
import { filterOpts } from "./lib/options";

type Args = {
  selectedFilter: any,
  handleSelect: Function,
}

const CommentFilters = ({ selectedFilter, handleSelect }: Args) => {

  return (
    <div className={css(styles.filtersWrapper)}>
      {filterOpts.map((f) => {
        return (
          <div>
            {f.value === selectedFilter.value ? (
              <div
                className={css([styles.filter, styles.filterSelected])}
                key={`filter-${f.value}`}
              >
                {f.label}
              </div>
            ) : (
              <div
                onClick={() => handleSelect(f)}
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
    columnGap: "8px",
  },
  filter: {
    borderRadius: "4px",
    padding: "5px 8px",
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
});

export default CommentFilters;
