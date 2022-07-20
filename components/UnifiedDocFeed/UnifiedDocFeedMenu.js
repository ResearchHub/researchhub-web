import { css, StyleSheet } from "aphrodite";
import { breakpoints } from "~/config/themes/screen";
import { useRouter } from "next/router";
import { filterOptions, scopeOptions } from "~/config/utils/options";
import { useState } from "react";
import DropdownButton from "~/components/Form/DropdownButton";
import colors, { pillNavColors } from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import killswitch from "~/config/killswitch/killswitch";

const UnifiedDocFeedMenu = ({
  subFilters: { filterBy, scope },
  onDocTypeFilterSelect,
  onSubFilterSelect,
  onScopeSelect,
}) => {
  const router = useRouter();
  const [isScopeSelectOpen, setIsScopeSelectOpen] = useState(false);
  const [isFilterSelectOpen, setIsFilterSelectOpen] = useState(false);
  const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [isSmallScreenDropdownOpen, setIsSmallScreenDropdownOpen] =
    useState(false);

  const getTabs = ({ asFlatList = false }) => {
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
        value: "hot",
        label: "Trending",
        icon: icons.starAlt,
        disableScope: true,
      },
      {
        value: "newest",
        label: "Newest",
        icon: icons.calendar,
        disableScope: true,
      },
      {
        value: "is_open_access",
        label: "Open Access",
        icon: icons.bookOpenAlt,
        disableScope: false,
      },
      {
        value: "more",
        type: "dropdown",
        label: "More",
        icon: icons.chevronDown,
        iconPos: "right",
        options: [
          {
            value: "most_discussed",
            label: "Most Discussed",
            selectedLabel: "Discussed",
            icon: icons.commentsAlt,
          },
          {
            value: "top_rated",
            label: "Most Upvoted",
            selectedLabel: "Upvoted",
            icon: icons.up,
          },
          {
            value: "author_claimed",
            label: "Author Claimed",
            selectedLabel: "Claimed",
            icon: icons.verifiedBadgeAlt,
            disableScope: true,
          },
        ].map((opt) => ({ html: _renderOption(opt), ...opt })),
      },
    ].map((opt) => ({ html: _renderOption(opt), ...opt }));

    let additionalTabs = [];
    let tabsAsHTML = tabs.map((tabObj) => {
      const hasNestedOptions = tabObj.options;
      if (hasNestedOptions) {
        let isNestedSelected = false;
        tabObj.options.map((nestedOpt) => {
          nestedOpt.isSelected = nestedOpt.value === filterBy.value;
          if (nestedOpt.isSelected) {
            isNestedSelected = nestedOpt.isSelected;
          }

          if (asFlatList) {
            additionalTabs.push(nestedOpt);
          }
        });
        tabObj.isSelected = isNestedSelected;
      } else {
        tabObj.isSelected = tabObj.value === filterBy.value;
      }

      return tabObj;
    });

    let finalTabs = [...tabsAsHTML, ...additionalTabs];
    if (asFlatList) {
      finalTabs = finalTabs.filter((t) => !t.options);
    }

    return finalTabs;
  };

  const getTypeFilters = () => {
    const types = [
      {
        value: undefined,
        label: "All Content",
      },
      {
        value: "paper",
        label: "Papers",
      },
      {
        value: "posts",
        label: "Posts",
      },
      killswitch("") && {
        value: "questions",
        label: "Questions",
      },
      {
        value: "hypothesis",
        label: "Meta-Studies",
      },
    ];

    return types.map((t) => {
      t.isSelected = t.value === router.query.type ? true : false;
      return t;
    });
  };
  // KOBE: 2022-06-19
  // Variation in type navigation
  const renderTab = (tabObj) => {
    const hasNestedOptions = tabObj.options;
    const selectedNestedObj = hasNestedOptions
      ? tabObj.options.find((opt) => opt.isSelected)
      : null;

    return (
      <div className={css(styles.tab, tabObj.isSelected && styles.tabSelected)}>
        {hasNestedOptions ? (
          <DropdownButton
            opts={tabObj.options}
            labelAsHtml={
              <div>
                <span>
                  {selectedNestedObj?.selectedLabel ||
                    selectedNestedObj?.label ||
                    tabObj?.label}
                </span>
              </div>
            }
            selected={tabObj.value}
            isOpen={isMoreDropdownOpen}
            onClick={() => setIsMoreDropdownOpen(true)}
            dropdownClassName="moreOptions"
            onClickOutside={() => {
              setIsMoreDropdownOpen(false);
            }}
            // overrideTitleStyle={styles.customTitleStyle}
            overridePopoverStyle={styles.overridePopoverStyle}
            positions={["bottom", "right"]}
            customButtonClassName={[
              styles.tab,
              tabObj.isSelected && styles.moreOptsSelected,
              styles.moreFiltersBtnContainer,
            ]}
            overrideOptionsStyle={styles.moreDropdownOptions}
            overrideDownIconStyle={styles.downIcon}
            onSelect={(selectedFilter) => {
              const selectedFilterObj = tabObj.options.find(
                (t) => t.value === selectedFilter
              );

              onSubFilterSelect(selectedFilterObj);
            }}
            onClose={() => setIsMoreDropdownOpen(false)}
          />
        ) : (
          <>
            <div
              onClick={() => onSubFilterSelect(tabObj)}
              className={css(styles.labelContainer)}
            >
              <span className={css(styles.iconWrapper)}>{tabObj.icon}</span>
              <span className={css(styles.tabText)}>{tabObj.label}</span>
            </div>
          </>
        )}
      </div>
    );
  };

  const getSelectedTab = (tabs) => {
    let selectedTab = null;
    let parentTab = null;
    for (let i = 0; i < tabs.length; i++) {
      const current = tabs[i];
      if (current.isSelected) {
        selectedTab = current;
      }
      if (current.options) {
        for (let j = 0; j < current.options.length; j++) {
          const nested = current.options[j];
          if (nested.isSelected) {
            selectedTab = nested;
            parentTab = current;
          }
        }
      }
    }

    if (selectedTab) {
      return { selectedTab, parentTab };
    }

    throw new Error("Selected tab not found. This should not happen.");
  };

  // KOBE: 2022-06-19
  // Variation in type navigation
  const renderFilterDropdownOpt = (tabObj) => {
    return (
      <div className={css(styles.labelContainer)}>
        <span className={css(styles.iconWrapper)}>{tabObj.icon}</span>
        <span className={css(styles.tabText)}>{tabObj.label}</span>
      </div>
    );
  };

  // KOBE: 2022-06-19
  // Variation in type navigation
  const renderTypeOpt = (type) => {
    return (
      <div
        onClick={() => onDocTypeFilterSelect(type.value)}
        className={css(
          styles.typeOpt,
          type.isSelected && styles.typeOptSelected
        )}
      >
        {type.label}
      </div>
    );
  };

  const tabs = getTabs({});
  const optsForSmallScreen = getTabs({ asFlatList: true });
  const types = getTypeFilters(); //.map((t) => renderTypeOpt(t));
  const selectedType = types.find((t) => t.isSelected);
  const { selectedTab, parentTab } = getSelectedTab(tabs);
  // const filterOptsAsHtml = tabs
  //   .map((t) => renderFilterDropdownOpt(t))
  //   .map((t, i) => ({ html: t, ...tabs[i] }));
  // const selectedFilterOpt = renderFilterDropdownOpt({  });
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
                  opts={optsForSmallScreen}
                  onClick={() => setIsSmallScreenDropdownOpen(true)}
                  dropdownClassName="combinedDropdown"
                  onClickOutside={() => {
                    setIsSmallScreenDropdownOpen(false);
                  }}
                  // overrideTitleStyle={styles.customTitleStyle}
                  overridePopoverStyle={styles.overridePopoverStyle}
                  positions={["bottom", "right"]}
                  customButtonClassName={[
                    // styles.tab,
                    styles.smallScreenFiltersDropdown,
                  ]}
                  overrideOptionsStyle={styles.moreDropdownOptions}
                  overrideDownIconStyle={styles.downIcon}
                  onSelect={(selectedFilter) => {
                    console.log("selectedFilter", selectedFilter);
                    console.log("tabs", tabs);
                    const selectedFilterObj = optsForSmallScreen.find(
                      (t) => t.value === selectedFilter
                    );

                    onSubFilterSelect(selectedFilterObj);
                  }}
                  onClose={() => setIsSmallScreenDropdownOpen(false)}
                />
              </div>

              <div className={css(styles.largeScreenFilters)}>
                {tabs.map((t) => renderTab(t))}
              </div>
              {!selectedTab.disableScope && (
                <div className={css(styles.tab, styles.timeScope)}>
                  <DropdownButton
                    opts={scopeOptions}
                    label={scope.label}
                    selected={scope.value}
                    isOpen={isScopeSelectOpen}
                    overrideDownIconStyle={styles.downIcon}
                    onClick={() => setIsScopeSelectOpen(true)}
                    dropdownClassName="scopeSelect"
                    onClickOutside={() => {
                      setIsScopeSelectOpen(false);
                    }}
                    overrideTitleStyle={styles.customTitleStyle}
                    positions={["bottom", "right"]}
                    customButtonClassName={styles.secondaryDropdownContainer}
                    onSelect={(selectedScope) => {
                      const obj = scopeOptions.find(
                        (s) => selectedScope === s.value
                      );
                      onScopeSelect(obj);
                    }}
                    onClose={() => setIsScopeSelectOpen(false)}
                  />
                </div>
              )}
            </div>
            <div className={css(styles.tab, styles.typeFilter)}>
              <DropdownButton
                opts={types}
                label={selectedType.label}
                labelAsHtml={
                  <div>
                    <div className={css(styles.typeFilterLabelForSmallScreen)}>
                      <span className={css(styles.sortIcon)}>{icons.sort}</span>
                    </div>
                    <div className={css(styles.typeFilterLabelForLargeScreen)}>
                      <span className={css(styles.sortIcon)}>{icons.sort}</span>
                      <span className={css(styles.typeFilterLabel)}>
                        {selectedType.label}
                      </span>
                    </div>
                  </div>
                }
                selected={selectedType.value}
                isOpen={isTypeFilterOpen}
                onClick={() => setIsTypeFilterOpen(true)}
                dropdownClassName="filterSelect"
                onClickOutside={() => {
                  setIsTypeFilterOpen(false);
                }}
                overrideTitleStyle={styles.customTitleStyle}
                positions={["bottom", "right"]}
                customButtonClassName={styles.secondaryDropdownContainer}
                overrideDownIconStyle={[
                  styles.downIcon,
                  styles.typeFilterDownIconForSmallScreen,
                ]}
                onSelect={(selectedType) => {
                  onDocTypeFilterSelect(selectedType);
                }}
                onClose={() => setIsTypeFilterOpen(false)}
              />
            </div>
          </div>
        </div>
      </div>
      {/* <div className={css(styles.typesContainer)}>{types}</div> */}
    </div>
  );
};

const styles = StyleSheet.create({
  typeFilter: {
    marginLeft: "auto",
    marginRight: 0,
    height: 35,
  },
  typeFilterLabel: {
    [`@media only screen and (max-width: 1400px)`]: {
      display: "none",
    },
  },
  typeFilterLabelForSmallScreen: {
    display: "none",
    backgroundColor: pillNavColors.secondary.filledBackgroundColor,
    padding: "8px 16px",
    borderRadius: 40,
    ":hover": {
      borderRadius: 40,
      backgroundColor: pillNavColors.primary.filledBackgroundColor,
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "block",
    },
  },
  typeFilterLabelForLargeScreen: {
    display: "flex",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
  },
  typeFilterDownIconForSmallScreen: {
    [`@media only screen and (max-width: 1400px)`]: {
      display: "none",
    },
  },
  sortIcon: {
    marginLeft: 5,
    fontSize: 18,
    marginRight: 4,
    marginLeft: 4,
    [`@media only screen and (min-width: 1400px)`]: {
      display: "none",
    },
  },
  // typeFilterText: {
  //   [`@media only screen and (max-width: 1400px)`]: {
  //     display: "none",
  //   },
  // },
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
  timeScope: {
    display: "flex",
    height: 35,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      alignItems: "center",
    },
  },
  customTitleStyle: {
    fontWeight: 400,
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
    display: "flex",
    // [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
    //   display: "none",
    // },
  },
  filtersAsDropdown: {
    display: "none",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "block",
    },
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
    color: colors.BLACK(),
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
  // dropdownButtonOverride: {
  //   whiteSpace: "nowrap",
  //   display: "flex",
  //   backgroundColor: "unset",
  //   color: pillNavColors.secondary.filledTextColor,
  //   borderRadius: 40,
  //   fontWeight: 500,
  //   marginRight: 8,
  //   lineHeight: "10px",
  //   padding: "0px 0rem 10px 10px",
  //   ":hover": {
  //     backgroundColor: "unset",
  //   },
  //   [`@media only screen and (max-width: ${breakpoints.bigDesktop.str})`]: {
  //     fontSize: 14,
  //     lineHeight: "16px",
  //   },
  //   [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
  //     fontSize: 14,
  //     padding: "7px 16px",
  //     backgroundColor: pillNavColors.secondary.filledBackgroundColor,
  //     lineHeight: "22px",
  //   },
  // },
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
    // [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
    //   fontSize: 14,
    //   lineHeight: "22px",
    //   backgroundColor: pillNavColors.primary.filledBackgroundColor,
    // },
  },
  moreFiltersBtnContainer: {
    // paddingBottom: 0,
    // paddingLeft: 0,
    whiteSpace: "nowrap",
    display: "flex",
    padding: "0px 0px 0px 0px",
    marginRight: 0,
    // backgroundColor: "unset",
    // color: pillNavColors.secondary.filledTextColor,
    // borderRadius: 40,
    // fontWeight: 500,
    // marginRight: 8,
    // lineHeight: "8px",
    ":hover": {
      background: "unset",
    },
  },
  moreDropdownOptions: {
    color: colors.BLACK(0.8),
  },
  overridePopoverStyle: {
    width: "220px",
  },
  secondaryDropdownContainer: {
    // paddingBottom: 0,
    // paddingLeft: 0,
    whiteSpace: "nowrap",
    display: "flex",
    padding: "0px 0px 0px 0px",
    marginRight: 0,
    // backgroundColor: "unset",
    // color: pillNavColors.secondary.filledTextColor,
    // borderRadius: 40,
    // fontWeight: 500,
    // marginRight: 8,
    // lineHeight: "8px",
    fontWeight: 400,
    ":hover": {
      background: "unset",
    },
  },
  buttonGroup: {
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 16,
    marginBottom: 10,
    overflow: "auto",
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
  typeOpt: {
    padding: "2px 8px",
    marginRight: 8,
    fontSize: 14,
    color: colors.BLACK(0.6),
    ":hover": {
      background: colors.LIGHT_GREY(),
      borderRadius: 50,
      cursor: "pointer",
    },
  },
  typeOptSelected: {
    borderRadius: 50,
    color: colors.NEW_BLUE(),
    background: colors.LIGHTER_BLUE(),
    ":hover": {
      color: colors.NEW_BLUE(),
      background: colors.LIGHTER_BLUE(),
    },
  },
  typesContainer: {
    display: "flex",
  },
  filtersContainer: {
    marginBottom: 35,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      marginBottom: 10,
    },
  },
  // overrideDownIconStyle: {
  //   padding: "6px 4px",
  // },
});

export default UnifiedDocFeedMenu;
