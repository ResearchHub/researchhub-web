import { css, StyleSheet } from "aphrodite";
import { breakpoints } from "~/config/themes/screen";
import { useState } from "react";
import DropdownButton from "~/components/Form/DropdownButton";
import colors, { pillNavColors } from "~/config/themes/colors";
import FeedOrderingDropdown from "./FeedOrderingDropdown";

const UnifiedDocFeedMenu = ({
  subFilters: { filterBy, scope, tags },
  docTypeFilter,
  onDocTypeFilterSelect,
  onSubFilterSelect,
  onTagsSelect,
  onScopeSelect,
}) => {
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

    const tabs = [
      {
        value: "all",
        label: "All",
      },
      {
        value: "paper",
        label: "Papers",
      },
      {
        value: "posts",
        label: "Posts",
      },
      {
        value: "question",
        label: "Questions",
      },
      {
        value: "hypothesis",
        label: "Meta-Studies",
      },
      {
        value: "bounties",
        tag: { bounties: "all" },
        label: "Bounties",
      },
    ].map((opt) => ({ html: _renderOption(opt), ...opt }));

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

  const tabs = getTabs();
  const selectedTab = getSelectedTab(tabs);

  return (
    <div className={css(styles.filtersContainer)}>
      <div className={css(styles.buttonGroup)}>
        <div className={css(styles.mainFilters)}>
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
    padding: "0 8px 0px 8px",
    marginRight: 20,
    textTransform: "unset",
    fontSize: 16,
    fontWeight: 500,
    height: 32,
    cursor: "pointer",
    ":active": {
      color: colors.NEW_BLUE(),
    },
    ":hover": {
      color: colors.NEW_BLUE(),
    },
    [`@media only screen and (max-width: 1500px)`]: {
      fontSize: 15,
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
    color: colors.NEW_BLUE(),
    borderBottom: "solid 3px",
    borderColor: colors.NEW_BLUE(),
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
    alignItems: "center",
    display: "flex",
    height: "inherit",
    width: "100%",
    borderBottom: `1px solid ${colors.BLACK(0.1)}`,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      borderBottom: `unset`,
    },
  },
  filtersContainer: {
    marginBottom: 35,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      marginBottom: 10,
    },
  },
});

export default UnifiedDocFeedMenu;
