import { tagFilters } from "./constants/UnifiedDocFilters";
import TagDropdown from "./TagDropdown";
import { SelectedUrlFilters } from "./utils/getSelectedUrlFilters";
import { css, StyleSheet } from "aphrodite";
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";

type Args = {
  selectedFilters: SelectedUrlFilters,
  tabObj: any,
  handleOpenTagsMenu: Function,
  handleFilterSelect: Function,
  isTagsMenuOpen: boolean,
  router: any,
}

const FeedTab = ({ selectedFilters, tabObj, handleOpenTagsMenu, handleFilterSelect, isTagsMenuOpen, router }:Args) => {
  const isSelected = tabObj.value === selectedFilters.type;
  const nestedOptions = tagFilters.filter((sub) =>
    sub.availableFor.includes(tabObj.value)
  );

  return (
    <div
      className={`${css(
        styles.tab,
        tabObj.isSelected && styles.tabSelected
      )} typeFilter`}
      onClick={() => {
        if (isSelected && nestedOptions.length > 0) {
          if (isTagsMenuOpen) {
            handleOpenTagsMenu(null);
          } else {
            handleOpenTagsMenu(tabObj.value);
          }
        } else {
          handleFilterSelect({ typeFilter: tabObj.value });
        }
      }}
    >
      <div className={css(styles.labelContainer)}>
        <span className={css(styles.tabText)}>{tabObj.label}</span>
        {/* {isTagsMenuOpen
          ? <span className={css(styles.icon)}>{icons.chevronUp}</span>
          : isSelected
          ? <span className={css(styles.icon)}>{icons.chevronDown}</span>
          : null
        } */}
        {/* FIXME: Kobe, commenting out until BE is done */}
        {/* {isTagsMenuOpen && (
          <TagDropdown
            options={nestedOptions}
            selectedTags={selectedFilters.tags}
            handleSelect={(selected) =>
              handleFilterSelect({ router, tags: [selected] })
            }
          />
        )} */}
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  tab: {
    userSelect: "none",
    position: "relative",
    color: colors.BLACK(0.6),
    background: colors.LIGHTER_GREY(1.0),
    padding: "4px 12px",
    marginRight: 10,
    textTransform: "unset",
    fontSize: 15,
    fontWeight: 400,
    borderRadius: 4,
    lineHeight: "20px",
    cursor: "pointer",
    ":active": {
      color: colors.NEW_BLUE(),
    },
    ":hover": {
      color: colors.NEW_BLUE(),
    },
    [`@media only screen and (max-width: 1450px)`]: {
      marginRight: 10,
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      height: "auto",
      ":last-child": {
        marginRight: 0,
      },
      ":first-child": {
        paddingLeft: 0,
      },
    },
  },  
  tabSelected: {
    color: colors.NEW_BLUE(1.0),
    background: colors.LIGHTER_BLUE(1.0),
  },
  tabText: {

  },
  labelContainer: {
    display: "flex",
    height: "100%",
  },  
  icon: {
    marginLeft: 5,
  },  
});

export default FeedTab;