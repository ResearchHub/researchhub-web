import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToggleOff } from "@fortawesome/pro-duotone-svg-icons";
import { faToggleOn } from "@fortawesome/pro-solid-svg-icons";
import { css, StyleSheet } from "aphrodite";
import { useMemo } from "react";
import colors from "~/config/themes/colors";

import { feedTypeOpts } from "../constants/UnifiedDocFilters";

type Args = {
  options: any[];
  handleSelect: Function;
  selectedTags: string[];
  forTab: any;
};

const FeedMenuTagDropdown = ({
  options,
  forTab,
  handleSelect,
  selectedTags,
}: Args) => {
  // Kobe: This could be done with CSS however, aphrodite makes it quite time
  // consuming to implement a css-based solution.
  const isWithinLastTab = useMemo(() => {
    const tabList = Object.values(feedTypeOpts);
    return (
      tabList.findIndex((t) => t.value === forTab.value) === tabList.length - 1
    );
  }, [feedTypeOpts]);

  return (
    (<div
      className={css(
        styles.additionalOpts,
        isWithinLastTab && styles.additionalOptsRightAlign
      )}
    >
      {options.map((opt) => (
        <div
          className={css(styles.tag)}
          onClick={(event) => {
            event.stopPropagation();
            event.preventDefault();
            handleSelect(opt.value);
          }}
          key={`tag-${opt.value}`}
        >
          <span className={css(styles.tagLabel)}>{opt.label}</span>
          {selectedTags.includes(opt.value) ? (
            <span className={css(styles.tagIcon, styles.toggleOn)}>
              {<FontAwesomeIcon icon={faToggleOn}></FontAwesomeIcon>}
            </span>
          ) : (
            <span className={css(styles.tagIcon, styles.toggleOff)}>
              {<FontAwesomeIcon icon={faToggleOff}></FontAwesomeIcon>}
            </span>
          )}
        </div>
      ))}
    </div>)
  );
};

const styles = StyleSheet.create({
  additionalOpts: {
    position: "absolute",
    background: colors.WHITE(),
    top: 33,
    left: 2,
    width: 150,
    zIndex: 5,
    padding: 5,
    paddingBottom: 10,
    boxShadow: `${colors.PURE_BLACK(0.15)} 0px 0px 10px 0px`,
  },
  additionalOptsRightAlign: {
    left: "unset",
    right: 2,
  },
  tag: {
    marginTop: 5,
    padding: "2px 5px ",
    color: colors.BLACK(1.0),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    ":hover": {
      color: colors.NEW_BLUE(1.0),
    },
  },
  tagLabel: {},
  tagIcon: {
    fontSize: 22,
    color: colors.NEW_BLUE(),
  },
  toggleOn: {
    color: colors.NEW_BLUE(),
  },
  toggleOff: {
    color: colors.LIGHT_GREY(1.0),
  },
});

export default FeedMenuTagDropdown;
