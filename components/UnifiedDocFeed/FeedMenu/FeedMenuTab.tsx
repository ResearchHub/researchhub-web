import { tagFilters } from "../constants/UnifiedDocFilters";
import FeedMenuTagDropdown from "./FeedMenuTagDropdown";
import { SelectedUrlFilters } from "../utils/getSelectedUrlFilters";
import { css, StyleSheet } from "aphrodite";
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";
import Link from "next/link";
import { useRouter } from "next/router";
import { prepURL } from "~/config/api";

type Args = {
  selectedFilters: SelectedUrlFilters,
  tabObj: any,
  handleOpenTagsMenu: Function,
  handleFilterSelect: Function,
  isTagsMenuOpen: boolean,
}

const FeedMenuTab = ({ selectedFilters, tabObj, handleOpenTagsMenu, handleFilterSelect, isTagsMenuOpen }:Args) => {
  const router = useRouter();  
  const isSelected = tabObj.value === selectedFilters.type;
  const nestedOptions = tagFilters.filter((sub) =>
    sub.availableFor.includes(tabObj.value)
  );
  const _buildTabUrl = () => {
    const params = {
      querystring: {
        ...(tabObj.value !== "all" && { "type": tabObj.value }),
        ...(router.query.sort && { "sort": router.query.sort }),
      }
    }
    
    let path = router.asPath;
    const idx = path.indexOf("?");
    if (idx >= 0) {
      path = path.substring(0, idx);
    }

    let url = prepURL(path, params);

    return url;
  }

  const url = _buildTabUrl();
  return (
    <div
      className={`${css(
        styles.tab,
        tabObj.isSelected && styles.tabSelected
      )} typeFilter`}
      onClick={() => {
        if (isSelected) {
          // Already handled by <Link>
          return null;
        }

        if (nestedOptions.length > 0) {
          if (isTagsMenuOpen) {
            handleOpenTagsMenu(null);
          } else {
            handleOpenTagsMenu(tabObj.value);
          }
        }
      }}
    >
      <Link href={url}>
        <a className={css(styles.labelContainer)}>
          <span className={css(styles.tabText)}>{tabObj.label}</span>
          {/* {isTagsMenuOpen
            ? <span className={css(styles.icon)}>{icons.chevronUp}</span>
            : isSelected
            ? <span className={css(styles.icon)}>{icons.chevronDown}</span>
            : null
          } */}
          {/* FIXME: Kobe, commenting out until BE is done */}
          {/* {isTagsMenuOpen && (
            <FeedMenuTagDropdown
              options={nestedOptions}
              selectedTags={selectedFilters.tags}
              handleSelect={(selected) =>
                handleFilterSelect({ router, tags: [selected] })
              }
            />
          )} */}
        </a>
      </Link>
    </div>
  );
}

const styles = StyleSheet.create({
  tab: {
    userSelect: "none",
    position: "relative",
    color: colors.BLACK(0.6),
    lineHeight: "20px",
    background: colors.LIGHTER_GREY(1.0),
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
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      height: "auto",
      lineHeight: "25px",
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
  },
  tabText: {

  },
  labelContainer: {
    display: "flex",
    height: "100%",
    textDecoration: "none",
    color: "inherit",
    whiteSpace: "nowrap",
    padding: "4px 12px",
    boxSizing: "border-box",
  },  
  icon: {
    marginLeft: 5,
  },  
});

export default FeedMenuTab;