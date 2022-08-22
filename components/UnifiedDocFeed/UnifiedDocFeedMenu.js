import { css, StyleSheet } from "aphrodite";
import { breakpoints } from "~/config/themes/screen";
import { useState } from "react";
import DropdownButton from "~/components/Form/DropdownButton";
import colors, { pillNavColors } from "~/config/themes/colors";
import FeedOrderingDropdown from "./FeedOrderingDropdown";
import {
  feedTypeOpts,
  sortOpts,
  subFilters,
  topLevelFilters,
} from "./constants/UnifiedDocFilters";
import icons from "~/config/themes/icons";
import { useRouter } from "next/router";
import AuthorAvatar from "../AuthorAvatar";
import { connect, useStore, useDispatch } from "react-redux";

const UnifiedDocFeedMenu = ({
  subFilters: { filterBy, scope, tags },
  docTypeFilter,
  onDocTypeFilterSelect,
  onSubFilterSelect,
  onTagsSelect,
  onScopeSelect,
  currentUser,
}) => {
  const router = useRouter();
  const store = useStore();

  const [isSmallScreenDropdownOpen, setIsSmallScreenDropdownOpen] =
    useState(false);

  const getTabs = () => {
    const _renderOption = (opt) => {
      return (
        <div className={css(styles.labelContainer)}>
          <span className={css(styles.iconWrapper)}>{opt.icon}</span>
          <span className={css(styles.optLabel)}>{opt.label}</span>
        </div>
      );
    };

    const tabs = Object.values(feedTypeOpts).map((opt) => ({
      html: _renderOption(opt),
      ...opt,
    }));

    let tabsAsHTML = tabs.map((tabObj) => {
      if (tabObj.value === docTypeFilter) {
        tabObj.isSelected = true;
      }
      return tabObj;
    });

    return tabsAsHTML;
  };

  const renderTab = (tabObj) => {
    const hasNestedOptions = tabObj.options;
    const selectedNestedObj = hasNestedOptions
      ? tabObj.options.find((opt) => opt.isSelected)
      : null;

    return (
      <div className={css(styles.tab, tabObj.isSelected && styles.tabSelected)}>
        {hasNestedOptions ? (
          <></>
        ) : (
          <>
            <div
              onClick={() => {
                if (tabObj.tag) {
                  onTagsSelect({ tags: [tabObj.tag] });
                  onDocTypeFilterSelect(tabObj.value);
                } else {
                  onTagsSelect({ tags: [] });
                  onDocTypeFilterSelect(tabObj.value);
                }
              }}
              className={css(styles.labelContainer)}
            >
              <span className={css(styles.tabText)}>{tabObj.label}</span>
            </div>
          </>
        )}
      </div>
    );
  };

  const getSelectedTab = (tabs) => {
    let selectedTab = null;
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i].isSelected) {
        selectedTab = tabs[i];
        break;
      }
    }

    if (!selectedTab) {
      console.error("Selected tab not found. This should not happen.");
      selectedTab = tabs[0];
    }

    return selectedTab;
  };

  const getSelectedUrlFilters = () => {
    const defaults = {
      topLevel: topLevelFilters.find((f) => f.isDefault).value,
      type: Object.values(feedTypeOpts).find((t) => t.isDefault).value,
      sort: sortOpts.find((opt) => opt.isDefault).value,
      subFilters: {},
    };
    const selected = { ...defaults };

    const foundTopLevelFilter = topLevelFilters.find(
      (f) => f.url === router.pathname
    ).value;
    if (foundTopLevelFilter) {
      selected.topLevel = foundTopLevelFilter;
    }

    const foundSort = sortOpts.find((opt) => opt.url === router?.query?.sort);
    if (foundSort) {
      selected.sort = foundSort;
    }

    const foundTypeFilter = Object.values(feedTypeOpts).find(
      (opt) => opt.value === router?.query?.type
    );
    if (foundTypeFilter) {
      selected.type = foundSort;
    }

    for (let i = 0; i < subFilters.length; i++) {
      const f = subFilters[i];

      if (router?.query?.[f.value] && f.availableFor.includes(selected.type)) {
        selected.subFilters[f.value] = true;
      }
    }

    return selected;
  };

  const tabs = getTabs();
  const selectedTab = getSelectedTab(tabs);
  const selectedFilters = getSelectedUrlFilters();
  console.log("selectedFilters", selectedFilters);

  return (
    <div className={css(styles.filtersContainer)}>
      <div className={css(styles.buttonGroup)}>
        <div className={css(styles.mainFilters)}>
          <div className={css(topLevelFilterStyles.container)}>
            {topLevelFilters.map((f) => (
              <div
                className={css(
                  topLevelFilterStyles.filter,
                  f.value === selectedFilters.topLevel &&
                    topLevelFilterStyles.filterSelected
                )}
                onClick={() => _handleTopLevelFilterSelect(f)}
              >
                <span className={css(topLevelFilterStyles.filterIcon)}>
                  {f.value === "for-you" && (
                    <AuthorAvatar
                      author={currentUser?.author_profile}
                      size={20}
                    />
                  )}
                  {f.icon}
                </span>
                <span className={css(topLevelFilterStyles.filterLabel)}>
                  {f.label}
                </span>
              </div>
            ))}
          </div>
          <div className={css(styles.feedMenu)}>
            <div className={css(styles.filtersAsTabs)}>
              <div className={css(styles.tab, styles.smallScreenFilters)}>
                <DropdownButton
                  labelAsHtml={
                    <div className={css(styles.labelContainer)}>
                      <span className={css(styles.iconWrapper)}>
                        {selectedTab.icon}
                      </span>
                      <span className={css(styles.tabText)}>
                        {selectedTab?.selectedLabel || selectedTab.label}
                      </span>
                    </div>
                  }
                  selected={selectedTab.value}
                  isOpen={isSmallScreenDropdownOpen}
                  opts={tabs}
                  onClick={() => setIsSmallScreenDropdownOpen(true)}
                  dropdownClassName="combinedDropdown"
                  onClickOutside={() => {
                    setIsSmallScreenDropdownOpen(false);
                  }}
                  overridePopoverStyle={styles.overridePopoverStyle}
                  positions={["bottom", "right"]}
                  customButtonClassName={[styles.smallScreenFiltersDropdown]}
                  overrideOptionsStyle={styles.moreDropdownOptions}
                  overrideDownIconStyle={styles.downIcon}
                  onSelect={(selected) => {
                    const tabObj = tabs.find((t) => t.value === selected);

                    if (tabObj.tag) {
                      onTagsSelect({ tags: [tabObj.tag] });
                      onDocTypeFilterSelect(tabObj.value);
                    } else {
                      onTagsSelect({ tags: [] });
                      onDocTypeFilterSelect(tabObj.value);
                    }
                  }}
                  onClose={() => setIsSmallScreenDropdownOpen(false)}
                />
              </div>

              <div className={css(styles.largeScreenFilters)}>
                {tabs.map((t) => renderTab(t))}
              </div>

              <div className={css(styles.orderingContainer)}>
                <FeedOrderingDropdown
                  selectedOrderingValue={filterBy.value}
                  selectedScopeValue={scope.value}
                  onOrderingSelect={(selected) => onSubFilterSelect(selected)}
                  onScopeSelect={(selected) => onScopeSelect(selected)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const topLevelFilterStyles = StyleSheet.create({
  container: {
    display: "flex",
    borderBottom: `1px solid ${colors.GREY_LINE(1)}`,
    width: "100%",
    marginBottom: 15,
  },
  filter: {
    padding: "0px 4px 12px 0px",
    display: "flex",
    marginRight: 25,
    alignItems: "center",
    cursor: "pointer",
    ":hover": {
      color: colors.NEW_BLUE(),
    },
  },
  filterIcon: {
    marginRight: 5,
  },
  filterLabel: {},
  filterSelected: {
    borderBottom: `2px solid ${colors.NEW_BLUE()}`,
    color: colors.NEW_BLUE(),
  },
});

const styles = StyleSheet.create({
  downIcon: {
    marginTop: 2,
    padding: "0px 3px",
    fontSize: 14,
  },
  feedMenu: {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  labelContainer: {
    display: "flex",
    height: "100%",
  },
  iconWrapper: {
    marginRight: 7,
    fontSize: 16,
    [`@media only screen and (max-width: 1350px)`]: {
      fontSize: 14,
      display: "none",
    },
    [`@media only screen and (max-width: 1200px)`]: {
      display: "block",
    },
  },
  filtersAsTabs: {
    width: "100%",
    display: "flex",
  },
  smallScreenFilters: {
    display: "none",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "block",
    },
  },
  largeScreenFilters: {
    display: "flex",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
  },
  tab: {
    color: colors.BLACK(0.6),
    background: colors.LIGHTER_GREY(1.0),
    padding: "4px 12px",
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
    // [`@media only screen and (max-width: 1500px)`]: {
    //   fontSize: 15,
    // },
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
    // borderBottom: "solid 3px",
    // borderColor: colors.NEW_BLUE(),
  },
  moreOptsSelected: {
    color: colors.NEW_BLUE(),
    [`@media only screen and (max-width: 1450px)`]: {
      marginRight: 0,
    },
  },
  orderingContainer: {
    marginLeft: "auto",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      marginLeft: 10,
      alignSelf: "center",
      fontSize: 15,
    },
  },
  smallScreenFiltersDropdown: {
    padding: "8px 16px",
    display: "flex",
    borderRadius: 40,
    color: pillNavColors.primary.filledTextColor,
    backgroundColor: pillNavColors.primary.filledBackgroundColor,
    ":hover": {
      borderRadius: 40,
      backgroundColor: pillNavColors.primary.filledBackgroundColor,
    },
  },
  overridePopoverStyle: {
    width: "220px",
  },
  buttonGroup: {
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 16,
    marginBottom: 10,
    overflow: "visible",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      flexDirection: "column-reverse",
    },
  },
  mainFilters: {
    height: "inherit",
    width: "100%",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      borderBottom: `unset`,
    },
  },
  filtersContainer: {
    marginBottom: 15,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      // marginBottom: 10,
    },
  },
});

const mapStateToProps = (state) => ({
  currentUser: state.auth.user,
});

export default connect(mapStateToProps, null)(UnifiedDocFeedMenu);
