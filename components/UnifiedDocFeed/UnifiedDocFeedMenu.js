import { css, StyleSheet } from "aphrodite";
import { breakpoints } from "~/config/themes/screen";
import { useState, useEffect, useMemo, useRef } from "react";
import colors, { pillNavColors, iconColors } from "~/config/themes/colors";
import FeedOrderingDropdown from "./FeedOrderingDropdown";
import { feedTypeOpts, topLevelFilters } from "./constants/UnifiedDocFilters";
import { useRouter } from "next/router";
import AuthorAvatar from "../AuthorAvatar";
import { connect } from "react-redux";
import { getSelectedUrlFilters } from "./utils/getSelectedUrlFilters";
import MyHubsDropdown from "../Hubs/MyHubsDropdown";
import handleFilterSelect from "./utils/handleFilterSelect";
import FeedTab from "./FeedTab";
import icons from "~/config/themes/icons";

const UnifiedDocFeedMenu = ({ currentUser }) => {
  const router = useRouter();

  const [isHubSelectOpen, setIsHubSelectOpen] = useState(false);
  const hubsDownRef = useRef(null);
  const [isSmallScreenDropdownOpen, setIsSmallScreenDropdownOpen] =
    useState(false);

  const [tagsMenuOpenFor, setTagsMenuOpenFor] = useState(null);
  const selectedFilters = useMemo(() => {
    return getSelectedUrlFilters({
      query: router.query,
      pathname: router.pathname,
    });
  }, [router.pathname, router.query]);

  useEffect(() => {
    const _handleOutsideClick = (e) => {
      const isTypeFilterClicked = e.target.closest(".typeFilter");
      if (!isTypeFilterClicked) {
        setTagsMenuOpenFor(null);
      }

      console.log("hubsDownRef", hubsDownRef);
      console.log(e.target);
      console.log(hubsDownRef.current.contains(e.target));

      // if ((hubsDownRef.current.contains(e.target) && isHubSelectOpen) || !hubsDownRef.current.contains(e.target)) {
      //   setIsHubSelectOpen(false);
      // }
    };

    document.addEventListener("click", _handleOutsideClick);

    return () => {
      document.removeEventListener("click", _handleOutsideClick);
    };
  }, []);

  const _getTabs = ({ selectedFilters }) => {
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
      if (tabObj.value === selectedFilters.type) {
        tabObj.isSelected = true;
      }
      return tabObj;
    });

    return tabsAsHTML;
  };

  // const _getSelectedTab = (tabs) => {
  //   let selectedTab = null;
  //   for (let i = 0; i < tabs.length; i++) {
  //     if (tabs[i].isSelected) {
  //       selectedTab = tabs[i];
  //       break;
  //     }
  //   }

  //   if (!selectedTab) {
  //     console.error("Selected tab not found. This should not happen.");
  //     selectedTab = tabs[0];
  //   }

  //   return selectedTab;
  // };

  const tabs = _getTabs({ selectedFilters });
  // const selectedTab = _getSelectedTab(tabs);

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
                onClick={() => {
                  if (f.value === "my-hubs") {
                    setIsHubSelectOpen(!isHubSelectOpen);
                  } else {
                    handleFilterSelect({ router, topLevel: f.value });
                  }
                }}
              >
                {f.value === "my-hubs" && isHubSelectOpen && <MyHubsDropdown />}
                <span className={css(topLevelFilterStyles.filterIcon)}>
                  {f.value === "my-hubs" && (
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
                {f.value === "my-hubs" && (
                  <span
                    className={css(topLevelFilterStyles.myHubsDown)}
                    onClick={() => setIsHubSelectOpen(!isHubSelectOpen)}
                    ref={hubsDownRef}
                  >
                    {isHubSelectOpen ? icons.chevronUp : icons.chevronDown}
                  </span>
                )}
                {/* {f.value === "my-hubs" && (
                  isTagsMenuOpen
                    ? <span className={css(styles.icon)}>{icons.chevronUp}</span>
                    : isSelected
                    ? <span className={css(styles.icon)}>{icons.chevronDown}</span>
                    : null
                )} */}
              </div>
            ))}
          </div>
          <div className={css(styles.feedMenu)}>
            <div className={css(styles.filtersAsTabs)}>
              {/* <div className={css(styles.tab, styles.smallScreenFilters)}>
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
                    handleFilterSelect({ router, typeFilter: tabObj.value });
                  }}
                  onClose={() => setIsSmallScreenDropdownOpen(false)}
                />
              </div> */}

              <div className={css(styles.largeScreenFilters)}>
                {tabs.map((t) => (
                  <FeedTab
                    selectedFilters={selectedFilters}
                    tabObj={t}
                    router={router}
                    handleOpenTagsMenu={(forType) =>
                      setTagsMenuOpenFor(forType)
                    }
                    handleFilterSelect={(selected) =>
                      handleFilterSelect({ router, ...selected })
                    }
                    isTagsMenuOpen={tagsMenuOpenFor === t.value}
                  />
                ))}
              </div>

              <div className={css(styles.orderingContainer)}>
                <FeedOrderingDropdown
                  selectedFilters={selectedFilters}
                  selectedOrderingValue={selectedFilters.sort}
                  selectedScopeValue={selectedFilters.time}
                  onOrderingSelect={(selected) =>
                    handleFilterSelect({ router, sort: selected.value })
                  }
                  onScopeSelect={(selected) =>
                    handleFilterSelect({ router, timeScope: selected.value })
                  }
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
    position: "relative",
    marginRight: 25,
    alignItems: "center",
    cursor: "pointer",
    color: colors.BLACK(),
    ":hover": {
      color: colors.NEW_BLUE(),
    },
  },
  filterIcon: {
    marginRight: 8,
    fontSize: 18,
  },
  filterLabel: {},
  filterSelected: {
    borderBottom: `2px solid ${colors.NEW_BLUE()}`,
    color: colors.NEW_BLUE(),
  },
  myHubsDown: {
    marginLeft: 3,
    padding: "5px 5px",
    ":hover": {
      background: iconColors.BACKGROUND,
      borderRadius: 3,
      transition: "0.3s",
    },
  },
});

const styles = StyleSheet.create({
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
    // [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
    //   display: "none",
    // },
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
