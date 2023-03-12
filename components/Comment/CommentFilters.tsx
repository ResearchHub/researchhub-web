import { css, StyleSheet } from "aphrodite";
import { useState } from "react";
import colors from "./lib/colors";
import { filterOpts } from "./lib/options";

const CommentFilters = ({}) => {

  const [selectedFilter, setSelectedFilter] = useState<any>(filterOpts[0]);

  return (
    <div className={css(styles.filtersWrapper)}>
      {filterOpts.map(f => {
        return (
          <div>
            {f.value === selectedFilter.value ? (
              <div className={css([styles.filter, styles.filterSelected])} key={`filter-${f.value}`}>{f.label}</div>
            ) : (
                <div onClick={() => setSelectedFilter(f)} className={css([styles.filter, styles.filterUnselected])} key={`filter-${f.value}`}>{f.label}</div>
            )}
          </div>
        )
      })}
    </div>
  )
}

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
      background: colors.filters.hover.background,
      transition: "0.3s",
    },    
  },
  filterSelected: {
    color: colors.filters.selected.text,
    background: colors.filters.selected.background,
  }
});

export default CommentFilters;