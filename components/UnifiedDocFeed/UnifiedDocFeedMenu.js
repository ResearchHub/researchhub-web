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
  const [isOpen, setIsOpen] = useState(false);
  const [isScopeSelectOpen, setIsScopeSelectOpen] = useState(false);

  console.log("filterBy", filterBy);
  console.log("scope", scope);

  const getTabs = () => {
    const tabs = [
      {
        value: "hot",
        label: "Best",
        icon: icons.starAlt,
        disableScope: true,
      },
      {
        value: "most_discussed",
        label: "Most Discussed",
        icon: icons.commentsAlt,
      },
      {
        value: "newest",
        label: "Newest",
        icon: icons.calendar,
      },
      {
        value: "top_rated",
        label: "Top",
        icon: icons.up,
      },
    ];

    return tabs.map((t) => {
      t.isSelected = t.value === filterBy.value;
      return t;
    });
  };

  const renderTab = (tabObj) => {
    return (
      <div
        className={css(
          styles.tabTypePill,
          tabObj.isSelected && styles.tabTypePillSelected
        )}
        onClick={() => onSubFilterSelect(tabObj)}
      >
        <span className={css(styles.iconWrapper)}>{tabObj.icon}</span>
        <span className={css(styles.tabText)}>{tabObj.label}</span>
      </div>
    );
  };

  const tabs = getTabs();
  const selectedTab = tabs.find((t) => t.isSelected);
  return (
    <div className={css(styles.feedMenu)}>
      {tabs.map((t) => renderTab(t))}
      <div className={css(styles.subFilters)}>
        {!selectedTab.disableScope && (
          <DropdownButton
            opts={scopeOptions}
            label={scope.label}
            selected={scope.value}
            isOpen={isScopeSelectOpen}
            onClick={() => setIsScopeSelectOpen(true)}
            dropdownClassName="scopeSelect"
            onClickOutside={() => {
              setIsScopeSelectOpen(false);
            }}
            overrideTitleStyle={styles.customTitleStyle}
            positions={["bottom", "right"]}
            customButtonClassName={styles.dropdownButtonOverride}
            onSelect={(selectedScope) => {
              const obj = scopeOptions.find((s) => selectedScope === s.value);
              onScopeSelect(obj);
            }}
            onClose={() => setIsScopeSelectOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  feedMenu: {
    display: "flex",
    alignItems: "center",
  },
  subFilters: {
    display: "flex",
  },
  customTitleStyle: {
    fontWeight: 400,
  },
  iconWrapper: {
    marginRight: 7,
    fontSize: 20,
  },
  tabTypePill: {
    color: pillNavColors.primary.unfilledTextColor,
    padding: "6px 12px",
    marginRight: 8,
    textTransform: "capitalize",
    fontSize: 16,
    lineHeight: "24px",
    fontWeight: 400,
    cursor: "pointer",
    ":active": {
      cursor: "pointer",
    },
    ":hover": {
      borderRadius: 40,
      background: pillNavColors.primary.unfilledHoverBackgroundColor,
      color: pillNavColors.primary.unfilledHoverTextColor,
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      padding: 16,
      fontSize: 16,
    },
  },
  tabTypePillSelected: {
    color: pillNavColors.primary.filledTextColor,
    borderRadius: "40px",
    fontWeight: 500,
    backgroundColor: pillNavColors.primary.filledBackgroundColor,
    ":hover": {
      backgroundColor: pillNavColors.primary.filledBackgroundColor,
    },
  },
  dropdownButtonOverride: {
    whiteSpace: "nowrap",
    backgroundColor: pillNavColors.secondary.filledBackgroundColor,
    color: pillNavColors.secondary.filledTextColor,
    borderRadius: 40,
    fontWeight: 500,
    marginRight: 8,
    ":hover": {
      borderRadius: 40,
      backgroundColor: pillNavColors.secondary.filledBackgroundColor,
    },
  },
});

export default UnifiedDocFeedMenu;
