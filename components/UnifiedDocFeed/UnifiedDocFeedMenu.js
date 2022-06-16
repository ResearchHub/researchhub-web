import { css, StyleSheet } from "aphrodite";
import { breakpoints } from "~/config/themes/screen";
import { useRouter } from "next/router";
import { filterOptions, scopeOptions } from "~/config/utils/options";
import { useState } from "react";
import DropdownButton from "~/components/Form/DropdownButton";
import colors, { pillNavColors } from "~/config/themes/colors";
import icons from "~/config/themes/icons";

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

  const getTabs = () => {
    const _renderNestedOption = (opt) => {
      return (
        <div>
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
        icon: icons.lockOpen,
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
            label: "Discussed",
            labelLarge: "Most Discussed",
            icon: icons.commentsAlt,
          },
          {
            value: "top_rated",
            label: "Top",
            icon: icons.up,
          },
          {
            value: "claimed",
            label: "Author Claimed",
            icon: icons.starFilled,
          },
        ].map((opt) => ({ html: _renderNestedOption(opt), ...opt })),
      },
    ];

    return tabs.map((tabObj) => {
      const hasNestedOptions = tabObj.options;
      if (hasNestedOptions) {
        let isNestedSelected = false;
        tabObj.options.map((nestedOpt) => {
          nestedOpt.isSelected = nestedOpt.value === filterBy.value;
          if (nestedOpt.isSelected) {
            isNestedSelected = nestedOpt.isSelected;
          }
        });
        tabObj.isSelected = isNestedSelected;
      } else {
        tabObj.isSelected = tabObj.value === filterBy.value;
      }

      return tabObj;
    });
  };

  const getTypeFilters = () => {
    const types = [
      {
        value: undefined,
        label: "All",
      },
      {
        value: "paper",
        label: "Papers",
      },
      {
        value: "posts",
        label: "Publications",
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
                <span className={css(styles.typeFilterText)}>
                  {selectedNestedObj?.label || tabObj.label}
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
            positions={["bottom", "right"]}
            customButtonClassName={[
              styles.tab,
              // styles.dropdownButtonOverride,
              styles.moreFiltersBtnContainer,
            ]}
            overrideDownIconStyle={styles.downIcon}
            onSelect={(selectedFilter) => {
              const selectedFilterObj = tabObj.options.find(
                (t) => t.value === selectedFilter
              );

              console.log("selectedFilter", selectedFilter);
              onSubFilterSelect(selectedFilterObj);
            }}
            onClose={() => setIsMoreDropdownOpen(false)}
          />
        ) : (
          <>
            <div onClick={() => onSubFilterSelect(tabObj)}>
              {/* <span className={css(styles.iconWrapper)}>{tabObj.icon}</span> */}
              <span className={css(styles.tabText)}>{tabObj.label}</span>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderFilterDropdownOpt = (tabObj) => {
    return (
      <div>
        <span className={css(styles.iconWrapper)}>{tabObj.icon}</span>
        <span className={css(styles.tabText)}>{tabObj.label}</span>
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

  const renderTypeOpt = (type) => {
    return (
      <div
        className={css(
          styles.typeOpt,
          type.isSelected && styles.typeOptSelected
        )}
      >
        {type.label}
      </div>
    );
  };

  const tabs = getTabs();
  const types = getTypeFilters().map((t) => renderTypeOpt(t));
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
              {tabs.map((t) => renderTab(t))}
              {!selectedTab.disableScope && (
                <div className={css(styles.tab)}>
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
                    customButtonClassName={styles.timeScopeBtnContainer}
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
            {/* <div className={css(styles.filtersAsDropdown)}>
              <DropdownButton
                opts={filterOptsAsHtml}
                labelAsHtml={selectedFilterOpt}
                selected={filterBy.value}
                isOpen={isFilterSelectOpen}
                onClick={() => setIsFilterSelectOpen(true)}
                dropdownClassName="filterSelect"
                onClickOutside={() => {
                  setIsFilterSelectOpen(false);
                }}
                overrideTitleStyle={styles.customTitleStyle}
                positions={["bottom", "right"]}
                customButtonClassName={[
                  styles.dropdownButtonOverride,
                  styles.dropdownBtnContainer,
                ]}
                overrideDownIconStyle={styles.overrideDownIconStyle}
                onSelect={(selectedFilter) => {
                  const selectedFilterObj = tabs.find(
                    (t) => t.value === selectedFilter
                  );
                  onSubFilterSelect(selectedFilterObj);
                }}
                onClose={() => setIsFilterSelectOpen(false)}
              />
            </div> */}
            {/* <div className={css(styles.typeFilter)}>
              <DropdownButton
                opts={types}
                labelAsHtml={
                  <div>
                    <span className={css(styles.typeFilterText)}>
                      {selectedType.label}
                    </span>
                    <span className={css(styles.sortIcon)}>{icons.sort}</span>
                  </div>
                }
                selected={selectedType.value}
                isOpen={isTypeFilterOpen}
                onClick={() => setIsTypeFilterOpen(true)}
                dropdownClassName="scopeSelect"
                onClickOutside={() => {
                  setIsTypeFilterOpen(false);
                }}
                overrideTitleStyle={styles.customTitleStyle}
                positions={["bottom", "right"]}
                customButtonClassName={[
                  styles.dropdownButtonOverride,
                  styles.dropdownBtnContainer,
                ]}
                overrideDownIconStyle={styles.downIcon}
                onSelect={(selectedType) => {
                  onDocTypeFilterSelect(selectedType);
                }}
                onClose={() => setIsTypeFilterOpen(false)}
              />
            </div> */}
          </div>
        </div>
      </div>
      <div className={css(styles.typesContainer)}>{types}</div>
    </div>
  );
};

const styles = StyleSheet.create({
  typeFilter: {
    marginLeft: "auto",
  },
  typeFilterText: {
    [`@media only screen and (max-width: 1400px)`]: {
      display: "none",
    },
  },
  downIcon: {
    marginTop: -4,
    padding: "0px 3px",
    fontSize: 14,
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
  feedMenu: {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  timeScope: {
    display: "flex",
  },
  customTitleStyle: {
    fontWeight: 400,
  },
  iconWrapper: {
    marginRight: 7,
    fontSize: 20,
    [`@media only screen and (max-width: 1400px)`]: {
      fontSize: 14,
    },
  },
  filtersAsTabs: {
    display: "flex",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
  },
  filtersAsDropdown: {
    display: "none",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "block",
    },
  },
  tab: {
    color: colors.BLACK(),
    color: colors.BLACK(0.5),
    padding: "0 5px 10px 5px",
    marginRight: 25,
    textTransform: "unset",
    fontSize: 16,
    fontWeight: 500,
    cursor: "pointer",
    ":active": {
      color: colors.NEW_BLUE(),
    },
    ":hover": {
      color: colors.NEW_BLUE(),
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 16,
    },
    [`@media only screen and (max-width: ${breakpoints.bigDesktop.str})`]: {
      fontSize: 14,
    },
  },
  tabSelected: {
    color: colors.NEW_BLUE(),
    borderBottom: "solid 3px",
    borderColor: colors.NEW_BLUE(),
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
  dropdownBtnContainer: {
    padding: "7px 16px",
    color: pillNavColors.primary.filledTextColor,
    backgroundColor: pillNavColors.primary.filledBackgroundColor,
    ":hover": {
      borderRadius: 40,
      backgroundColor: pillNavColors.secondary.filledBackgroundColor,
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 14,
      lineHeight: "22px",
      backgroundColor: pillNavColors.primary.filledBackgroundColor,
    },
  },
  moreFiltersBtnContainer: {
    // paddingBottom: 0,
    // paddingLeft: 0,
    whiteSpace: "nowrap",
    display: "flex",
    padding: "7px 0px 0px 0px",
    marginRight: 0,
    // backgroundColor: "unset",
    // color: pillNavColors.secondary.filledTextColor,
    // borderRadius: 40,
    // fontWeight: 500,
    // marginRight: 8,
    lineHeight: "8px",
    ":hover": {
      background: "unset",
    },
  },
  timeScopeBtnContainer: {
    // paddingBottom: 0,
    // paddingLeft: 0,
    whiteSpace: "nowrap",
    display: "flex",
    padding: "7px 0px 0px 0px",
    marginRight: 0,
    // backgroundColor: "unset",
    // color: pillNavColors.secondary.filledTextColor,
    // borderRadius: 40,
    // fontWeight: 500,
    // marginRight: 8,
    lineHeight: "8px",
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
    color: colors.BLACK(0.5),
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
    // background: colors.LIGHT_GREY(),
    // color: colors.BLACK(),
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
  },
  // overrideDownIconStyle: {
  //   padding: "6px 4px",
  // },
});

export default UnifiedDocFeedMenu;
