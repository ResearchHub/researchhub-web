import { css, StyleSheet } from "aphrodite";
import { breakpoints } from "~/config/themes/screen";
import { useState, useEffect, useMemo, useRef } from "react";
import colors, { pillNavColors, iconColors } from "~/config/themes/colors";
import FeedOrderingDropdown from "./FeedOrderingDropdown";
import { feedTypeOpts, topLevelFilters } from "./constants/UnifiedDocFilters";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { getSelectedUrlFilters } from "./utils/getSelectedUrlFilters";
import handleFilterSelect from "./utils/handleFilterSelect";
import FeedTab from "./FeedTab";
import icons from "~/config/themes/icons";
import TopLevelFilters from "./TopLevelFilters";
import useEffectForOutsideMenuClick from "./utils/useEffectForOutsideMenuClick";
import UnifiedDocFeedMobileScrollControls from "./UnifiedDocFeedMobileScrollControls";


type Args = {
  hubState?: any,
}

const UnifiedDocFeedMenu = ({ hubState }: Args) => {
  const router = useRouter();
  const hubsDownRef = useRef(null);
  const tabsContainerRef = useRef<HTMLInputElement | null>(null);

  const [isSmallScreenDropdownOpen, setIsSmallScreenDropdownOpen] =
    useState(false);
  const [viewportWidth, setViewportWidth] =
    useState(0);

  const [tagsMenuOpenFor, setTagsMenuOpenFor] = useState(null);
  const selectedFilters = useMemo(() => {
    return getSelectedUrlFilters({
      query: router.query,
      pathname: router.pathname,
    });
  }, [router.pathname, router.query]);

  useEffect(() => {
    useEffectForOutsideMenuClick({
      setTagsMenuOpenFor,
    })
  }, []);
  

  useEffect(() => {
    const _setViewportWidth = () => setViewportWidth(window.innerWidth);

    window.addEventListener("resize", _setViewportWidth, true);

    return () => {
      window.removeEventListener("resize", _setViewportWidth, true);
    };
  }, []);


  const _getTabs = ({ selectedFilters }) => {
    const _renderOption = (opt) => {
      return (
        <div className={css(styles.labelContainer)}>
          <span className={css(styles.iconWrapper)}>{opt.icon}</span>
          <span>{opt.label}</span>
        </div>
      );
    };

    const tabs = Object.values(feedTypeOpts).map((opt) => ({
      html: _renderOption(opt),
      ...opt,
    }));

    let tabsAsHTML = tabs.map((tabObj) => {
      if (tabObj.value === selectedFilters.type) {
        // @ts-ignore
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

  const tabElems = useMemo(
    () =>
      tabs.map((t) => (
        <FeedTab
          selectedFilters={selectedFilters}
          tabObj={t}
          router={router}
          handleOpenTagsMenu={(forType) => setTagsMenuOpenFor(forType)}
          handleFilterSelect={(selected) =>
            handleFilterSelect({ router, ...selected })
          }
          isTagsMenuOpen={tagsMenuOpenFor === t.value}
        />
      )),
    [tagsMenuOpenFor, selectedFilters]
  );

  const feedOrderingElem = (
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
  )

  return (
    <div className={css(styles.filtersContainer)}>
      <div className={css(styles.buttonGroup)}>
        <div className={css(styles.mainFilters)}>
          <TopLevelFilters
            selectedFilters={selectedFilters}
            hubState={hubState}
            feedOrderingElem={feedOrderingElem}
          />
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

              
              <div className={css(styles.typeFiltersContainer)}>
                {/* <div> */}
                <div className={css(styles.orderingContainer)}>
                  {feedOrderingElem}
                </div>                  
                <div className={css(styles.divider)}></div>                
                <UnifiedDocFeedMobileScrollControls
                  tabsContainerRef={tabsContainerRef}
                  viewportWidth={viewportWidth}
                />
                <div className={css(styles.tabsContainer)} ref={tabsContainerRef}>
                  {tabElems}
                </div>
                {/* </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  divider: {
    background: colors.GREY_LINE(1.0),
    height: "100%",
    width: 3,
    marginLeft: 8,
    marginRight: 8,
    [`@media only screen and (min-width: ${breakpoints.small.str})`]: {
      display: "none",
    }
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
  typeFiltersContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row-reverse",
    position: "relative",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      flexDirection: "row",
      },
    },
    
    tabsContainer: {
      boxSizing: "border-box",
      overflowX: "scroll",
      overflowScrolling: "touch",
      display: "flex",
      scrollbarWidth: "none",
      "::-webkit-scrollbar": {
        display: "none",
      }
  },

  orderingContainer: {
    marginLeft: "auto",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      color: colors.BLACK(0.6),
      lineHeight: "20px",
      background: colors.LIGHTER_GREY(1.0),
      marginLeft: 0,
      borderRadius: "4px",
      padding: "4px 12px",
      // marginLeft: 10,
      // alignSelf: "center",
      // fontSize: 15,
      // display: "none",
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
  hubState: state.hubs,
});

export default connect(mapStateToProps, null)(UnifiedDocFeedMenu);
