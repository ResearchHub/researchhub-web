import colors, { iconColors } from "~/config/themes/colors";
import { css, StyleSheet } from "aphrodite";
import { topLevelFilters } from "./constants/UnifiedDocFilters";
import { useRef, useState } from "react";
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
    
  return (
    <div className={css(styles.container)}>
      {topLevelFilters.map((f) => (
        <div
          className={css(
            styles.filter,
            f.value === selectedFilters.topLevel &&
              styles.filterSelected
          )}
          onClick={() => {
            if (f.value === "my-hubs") {
              setIsHubSelectOpen(!isHubSelectOpen);
            } else {
              handleFilterSelect({ router, topLevel: f.value });
            }
          }}
        >
          {f.value === "my-hubs" && isHubSelectOpen && <MyHubsDropdown hubState={hubState} />}
          <span className={css(styles.filterIcon)}>
            {f.value === "my-hubs" && (
              <AuthorAvatar
                author={currentUser?.author_profile}
                size={20}
              />
            )}
            {f.icon}
          </span>
          <span className={css(styles.filterLabel)}>
            {f.label}
          </span>
          {f.value === "my-hubs" && hubState?.subscribedHubs?.length > 0 && (
            <span
              className={css(styles.myHubsDown)}
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

const mapStateToProps = (state) => ({
  currentUser: state.auth.user,
});

export default connect(mapStateToProps, null)(TopLevelFilters);