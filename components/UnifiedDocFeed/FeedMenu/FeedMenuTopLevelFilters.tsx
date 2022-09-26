import colors, { iconColors } from "~/config/themes/colors";
import { css, StyleSheet } from "aphrodite";
import { topLevelFilters } from "../constants/UnifiedDocFilters";
import { useEffect, useMemo, useRef, useState } from "react";
import handleFilterSelect from "../utils/handleFilterSelect";
import { useRouter } from "next/router";
import AuthorAvatar from "../../AuthorAvatar";
import icons from "~/config/themes/icons";
import { connect } from "react-redux";
import MyHubsDropdown from "../../Hubs/MyHubsDropdown";
import { SelectedUrlFilters } from "../utils/getSelectedUrlFilters";
import { breakpoints } from "~/config/themes/screen";

type Args = {
  selectedFilters: SelectedUrlFilters;
  currentUser?: any;
  hubState: any;
};

const FeedMenuTopLevelFilters = ({
  selectedFilters,
  currentUser,
  hubState,
}: Args) => {
  const router = useRouter();
  const filterEl = useRef(null);
  const [isMyHubsDropdownOpen, setIsMyHubsDropdownOpen] = useState(false);
  const isSubscribedToHubs = hubState?.subscribedHubs?.length > 0;
  const isCurrentUserLoaded = !!currentUser;
  const renderAsDropdown = false;
  const shouldShowMyHubs = router.pathname.indexOf("/hubs/") === -1;

  useEffect(() => {
    const _handleClickOutside = (event) => {
      // @ts-ignore
      if (!filterEl.current.contains(event.target)) {
        setIsMyHubsDropdownOpen(false);
      }
    };

    document.addEventListener("click", _handleClickOutside);

    return () => {
      document.removeEventListener("click", _handleClickOutside);
    };
  }, []);

  const filterElems = useMemo(() => {
    return Object.values(topLevelFilters).map((f, idx) => {
      const isSelected = f.value === selectedFilters.topLevel;
      const isMyHubs = f.value === "/my-hubs";

      if (isMyHubs && !shouldShowMyHubs) {
        return null;
      }

      return (
        <div
          className={`${css(
            styles.filter,
            isSelected && styles.filterSelected,
            renderAsDropdown && styles.filterAsDropdownOpt,
            isMyHubs && styles.filterForMyHubs,
          )} filterSelected`}
          ref={filterEl}
          key={`filter-${idx}`}
          onClick={() => {
            if (isSelected && isMyHubs) {
              setIsMyHubsDropdownOpen(!isMyHubsDropdownOpen);
            } else {
              handleFilterSelect({ router, topLevel: f.value });
            }
          }}
        >
          <span className={css(styles.filterIcon)}>
            {isMyHubs ? (
              <AuthorAvatar
                author={currentUser?.author_profile || {}}
                size={23}
                trueSize={true}
                disableLink={true}
              />
            ) : (
              f.icon
            )}
          </span>
          <span className={css(styles.filterLabel)}>{f.label}</span>
          {isMyHubs && isSubscribedToHubs && !renderAsDropdown && (
            <span
              className={css(styles.myHubsDown)}
              onClick={(event) => {
                event.stopPropagation();
                setIsMyHubsDropdownOpen(!isMyHubsDropdownOpen);
              }}
            >
              {isMyHubsDropdownOpen ? icons.chevronUp : icons.chevronDown}
            </span>
          )}
          {isMyHubsDropdownOpen && isMyHubs && !renderAsDropdown && (
            <MyHubsDropdown hubState={hubState} />
          )}
          {isMyHubs && 
            <span className={css(styles.divider)}></span>
          }
        </div>
      );
    });
  }, [
    selectedFilters,
    isSubscribedToHubs,
    isCurrentUserLoaded,
    isMyHubsDropdownOpen,
    currentUser,
  ]);

  return <div className={css(styles.topLevelFilters)}>{filterElems}</div>;
};

const styles = StyleSheet.create({
  topLevelFilters: {
    display: "flex",
    borderBottom: `1px solid ${colors.GREY_LINE(1)}`,
    width: "100%",
    marginBottom: 15,
    position: "relative",
  },
  dropdown: {
    position: "absolute",
    top: 30,
    left: 0,
    zIndex: 10,
    padding: "5px 12px",
    background: "white",
    boxShadow: "rgb(0 0 0 / 15%) 0px 0px 10px 0px",
  },
  orderingContainer: {},
  divider: {
    borderRight: `1px solid ${colors.GREY_LINE(1)}`,
    height: "80%",
    position: "absolute",
    right: -20
  },
  filterAsDropdownOpt: {
    borderBottom: 0,
    padding: "10px 14px",
  },
  filter: {
    padding: "0px 2px 10px 2px",
    display: "flex",
    position: "relative",
    marginRight: 25,
    alignItems: "center",
    cursor: "pointer",
    userSelect: "none",
    color: colors.BLACK(0.6),
    ":hover": {
      color: colors.NEW_BLUE(),
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 15,
      padding: "0px 4px 10px 0px",
    },
  },
  filterForMyHubs: {
    marginRight: 40,
  },
  chevronIcon: {
    marginLeft: 8,
  },
  filterIcon: {
    marginRight: 8,
    fontSize: 18,
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      fontSize: 16,
    },
  },
  filterLabel: {},
  filterSelected: {
    borderBottom: `2px solid ${colors.NEW_BLUE()}`,
    color: colors.NEW_BLUE(),
  },
  myHubsDown: {
    marginLeft: 3,
    padding: "5px 5px 5px 5px",
    ":hover": {
      background: iconColors.BACKGROUND,
      borderRadius: 3,
      transition: "0.3s",
    },
  },
});

const mapStateToProps = (state) => ({
  currentUser: state.auth.user,
});

export default connect(mapStateToProps, null)(FeedMenuTopLevelFilters);
