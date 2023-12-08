import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/pro-regular-svg-icons";
import { tagFilters } from "../constants/UnifiedDocFilters";
import FeedMenuTagDropdown from "./FeedMenuTagDropdown";
import { SelectedUrlFilters } from "../utils/getSelectedUrlFilters";
import { css, StyleSheet } from "aphrodite";

import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";
import Link from "next/link";
import { useRouter } from "next/router";
import { buildTypeFilterUrl } from "../utils/buildTypeFilterUrl";

type Args = {
  selectedFilters: SelectedUrlFilters;
  tabObj: any;
  handleOpenTagsMenu: (arg) => void;
  handleFilterSelect: (arg) => void;
  setTagsMenuOpenFor: (arg) => void;
  isTagsMenuOpen: boolean;
  isSelected: boolean;
};

const FeedMenuTab = ({
  selectedFilters,
  tabObj,
  handleOpenTagsMenu,
  handleFilterSelect,
  setTagsMenuOpenFor,
  isSelected,
  isTagsMenuOpen,
}: Args) => {
  const router = useRouter();
  const nestedOptions = Object.values(tagFilters).filter((sub) =>
    sub.availableFor.includes(tabObj.value)
  );

  const url = buildTypeFilterUrl({ tabObj, router });
  return (
    <div
      className={`${css(
        styles.tab,
        isSelected && styles.tabSelected
      )} typeFilter`}
    >
      <Link
        href={url}
        className={css(styles.labelContainer)}
        onClick={(event) => {
          const thisTabIsSelected = isSelected;
          const thisTabHasTags = nestedOptions.length > 0;

          if (thisTabIsSelected && thisTabHasTags) {
            event.preventDefault();
            if (isTagsMenuOpen) {
              handleOpenTagsMenu(null);
            } else {
              handleOpenTagsMenu(tabObj.value);
            }
          }
        }}
      >
        <span className={css(styles.tabText)}>{tabObj.label}</span>
        {nestedOptions.length > 0 && (
          <>
            {isTagsMenuOpen ? (
              <span className={css(styles.icon)}>
                {<FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>}
              </span>
            ) : isSelected ? (
              <span className={css(styles.icon)}>
                {<FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>}
              </span>
            ) : null}
            {isTagsMenuOpen && (
              <FeedMenuTagDropdown
                options={nestedOptions}
                forTab={tabObj}
                selectedTags={selectedFilters.tags}
                handleSelect={(selected) => {
                  handleFilterSelect({ router, tags: [selected] });
                  setTagsMenuOpenFor(null);
                }}
              />
            )}
          </>
        )}
      </Link>
    </div>
  );
};

const styles = StyleSheet.create({
  tab: {
    userSelect: "none",
    position: "relative",
    color: colors.BLACK(0.6),
    background: colors.LIGHTER_GREY(1.0),
    lineHeight: "20px",
    marginRight: 10,
    textTransform: "unset",
    fontSize: 15,
    fontWeight: 400,
    borderRadius: 4,
    cursor: "pointer",
    ":active": {
      color: colors.NEW_BLUE(),
    },
    ":hover": {
      color: colors.NEW_BLUE(),
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      height: "auto",
      lineHeight: "25px",
      ":last-child": {
        marginRight: 0,
      },
      ":first-child": {
        paddingLeft: 0,
      },
    },
  },
  tabSelected: {
    color: colors.NEW_BLUE(),
    background: colors.NEW_BLUE(0.1),
    ":hover": {
      background: colors.NEW_BLUE(0.16),
    },
  },
  tabText: {},
  labelContainer: {
    display: "flex",
    height: "100%",
    textDecoration: "none",
    color: "inherit",
    whiteSpace: "nowrap",
    padding: "5px 12px",
    boxSizing: "border-box",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      padding: "4px 12px",
    },
  },
  icon: {
    marginLeft: 5,
  },
});

export default FeedMenuTab;
