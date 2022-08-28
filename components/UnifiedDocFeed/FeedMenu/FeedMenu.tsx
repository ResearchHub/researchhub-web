import { css, StyleSheet } from "aphrodite";
import { breakpoints } from "~/config/themes/screen";
import { useState, useEffect, useMemo, useRef } from "react";
import colors, { pillNavColors } from "~/config/themes/colors";
import FeedMenuSortDropdown from "./FeedMenuSortDropdown";
import { feedTypeOpts } from "../constants/UnifiedDocFilters";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { getSelectedUrlFilters } from "../utils/getSelectedUrlFilters";
import handleFilterSelect from "../utils/handleFilterSelect";
import FeedMenuTab from "./FeedMenuTab";
import FeedMenuTopLevelFilters from "./FeedMenuTopLevelFilters";
import useEffectForOutsideMenuClick from "../utils/useEffectForOutsideMenuClick";
import FeedMenuMobileScrollControls from "./FeedMenuMobileScrollControls";


type Args = {
  hubState?: any,
}

const FeedMenu = ({ hubState }: Args) => {
  const router = useRouter();
  const tabsContainerRef = useRef<HTMLInputElement | null>(null);

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


  const getTabFilters = ({ selectedFilters }) => {
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
  
  const tabElems = useMemo(
    () => {
      const tabs = getTabFilters({ selectedFilters });
      return tabs.map((t) => (
        <FeedMenuTab
          selectedFilters={selectedFilters}
          tabObj={t}
          router={router}
          handleOpenTagsMenu={(forType) => setTagsMenuOpenFor(forType)}
          handleFilterSelect={(selected) =>
            handleFilterSelect({ router, ...selected })
          }
          isTagsMenuOpen={tagsMenuOpenFor === t.value}
        />
      ))
    },
    [tagsMenuOpenFor, selectedFilters]
  );

  const feedOrderingElem = (
    <FeedMenuSortDropdown
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
          <FeedMenuTopLevelFilters
            selectedFilters={selectedFilters}
            hubState={hubState}
            feedOrderingElem={feedOrderingElem}
          />
          <div className={css(styles.feedMenu)}>
            <div className={css(styles.filtersAsTabs)}>
              <div className={css(styles.typeFiltersContainer)}>
                <div className={css(styles.orderingContainer)}>
                  {feedOrderingElem}
                </div>                  
                <div className={css(styles.divider)}></div>                
                <FeedMenuMobileScrollControls
                  tabsContainerRef={tabsContainerRef}
                  viewportWidth={viewportWidth}
                />
                <div className={css(styles.tabsContainer)} ref={tabsContainerRef}>
                  {tabElems}
                </div>
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
    },
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
  },
});

const mapStateToProps = (state) => ({
  hubState: state.hubs,
});

export default connect(mapStateToProps, null)(FeedMenu);
