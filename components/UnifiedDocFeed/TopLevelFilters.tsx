import colors, { iconColors } from "~/config/themes/colors";
import { css, StyleSheet } from "aphrodite";
import { topLevelFilters } from "./constants/UnifiedDocFilters";
import { useMemo, useRef, useState } from "react";
import handleFilterSelect from "./utils/handleFilterSelect";
import { useRouter } from "next/router";
import AuthorAvatar from "../AuthorAvatar";
import icons from "~/config/themes/icons";
import { connect } from "react-redux";
import MyHubsDropdown from "../Hubs/MyHubsDropdown";
import { SelectedUrlFilters } from "./utils/getSelectedUrlFilters";

type Args = {
  selectedFilters: SelectedUrlFilters,
  currentUser?: any,
  hubState: any,
}

const TopLevelFilters = ({ selectedFilters, currentUser, hubState }: Args) => {
  const router = useRouter();
  const [isHubSelectOpen, setIsHubSelectOpen] = useState(false);
  const hubsDownRef = useRef(null);
  const isSubscribedToHubs = hubState?.subscribedHubs?.length > 0;
  const isCurrentUserLoaded = !!currentUser;

  const filterElems = useMemo(() => {
    return topLevelFilters.map((f) => {
      const isSelected = f.value === selectedFilters.topLevel;
      const isMyHubs = f.value === "my-hubs";
      return ( 
        <div
          className={css(
            styles.filter, isSelected && styles.filterSelected
          )}
          onClick={() => {
            if (isSelected && isMyHubs) {
              setIsHubSelectOpen(!isHubSelectOpen);
            } else {
              handleFilterSelect({ router, topLevel: f.value });
            }
          }}
        >
          <span className={css(styles.filterIcon)}>
            {isMyHubs && (
              <AuthorAvatar
                author={currentUser?.author_profile || {}}
                size={20}
              />
            )}
            {f.icon}
          </span>
          <span className={css(styles.filterLabel)}>
            {f.label}
          </span>
          {isMyHubs && isSubscribedToHubs && (
            <span
              className={css(styles.myHubsDown)}
              onClick={(event) => {
                event.stopPropagation();
                setIsHubSelectOpen(!isHubSelectOpen);
              }}
              ref={hubsDownRef}
            >
              {isHubSelectOpen ? icons.chevronUp : icons.chevronDown}
            </span>
          )}
          {isHubSelectOpen && isMyHubs && <MyHubsDropdown hubState={hubState} />}
          {/* {isMyHubs && (
            isTagsMenuOpen
              ? <span className={css(styles.icon)}>{icons.chevronUp}</span>
              : isSelected
              ? <span className={css(styles.icon)}>{icons.chevronDown}</span>
              : null
          )} */}
        </div>
      )
  })}, [selectedFilters, isSubscribedToHubs, isCurrentUserLoaded, isHubSelectOpen] )  

  return (
    <div className={css(styles.container)}>
      {filterElems}
    </div>    
  )
}

const styles = StyleSheet.create({
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
    userSelect: "none",
    color: colors.BLACK(0.6),
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

const mapStateToProps = (state) => ({
  currentUser: state.auth.user,
});

export default connect(mapStateToProps, null)(TopLevelFilters);