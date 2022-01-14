import HorizontalTabBar from "~/components/HorizontalTabBar";
import { css, StyleSheet } from "aphrodite";
import { breakpoints } from "~/config/themes/screen";
import { useRouter } from "next/router";
import UnifiedDocFeedSubFilters from "./UnifiedDocFeedSubFilters";
import { filterOptions, scopeOptions } from "~/config/utils/options";
import { useState } from "react";
import DropdownButton from "~/components/Form/DropdownButton";
import colors, { pillNavColors } from "~/config/themes/colors";

const UnifiedDocFeedMenu = ({
  subFilters,
  onDocTypeFilterSelect,
  onSubFilterSelect,
  onScopeSelect,
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const getTabs = () => {
    const tabs = [
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
        label: "Posts",
      },
      {
        value: "hypothesis",
        label: "Hypotheses",
      },
    ];

    return tabs.map((t) => {
      t.isSelected = t.value === router.query.type ? true : false;
      return t;
    });
  };

  const tabs = getTabs();
  const selectedTab = tabs.find((t) => t.isSelected);

  return (
    <div className={css(styles.feedMenu)}>
      <div className={css(styles.horizontalTabWrapper)}>
        <HorizontalTabBar
          type="PILL_NAV"
          id="hpTabBar"
          tabs={tabs}
          onClick={(selected) => onDocTypeFilterSelect(selected.value)}
          containerStyle={styles.horizontalMenuOverride}
          dragging={true}
          alignCenter={false}
        />
      </div>
      <div className={css(styles.dropdownButtonMobile)}>
        <DropdownButton
          opts={tabs}
          label={selectedTab.label}
          isOpen={isOpen}
          selected={selectedTab.value}
          overrideTitleStyle={styles.overrideTitleStyle}
          onClick={() => setIsOpen(true)}
          dropdownClassName="filterSelect"
          positions={["bottom", "right"]}
          onClickOutside={() => {
            setIsOpen(false);
          }}
          customButtonClassName={styles.dropdownButtonOverride}
          onSelect={(selectedTab) => {
            onDocTypeFilterSelect(selectedTab);
          }}
          onClose={() => setIsOpen(false)}
        />
      </div>
      <div className={css(styles.subFilters)}>
        <UnifiedDocFeedSubFilters
          onSubFilterSelect={onSubFilterSelect}
          onScopeSelect={onScopeSelect}
          subFilters={subFilters}
        />
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  feedMenu: {
    display: "flex",
  },
  seperator: {
    border: "1px solid",
    marginRight: 15,
    color: colors.BLACK(0.1),
  },
  horizontalMenuOverride: {
    width: 307,
  },
  horizontalTabWrapper: {
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
  },
  dropdownButtonMobile: {
    marginRight: 8,
    [`@media only screen and (min-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
  },
  subFilters: {
    display: "flex",
  },
  overrideTitleStyle: {
    fontWeight: 400,
  },
  dropdownButtonOverride: {
    whiteSpace: "nowrap",
    backgroundColor: pillNavColors.primary.filledBackgroundColor,
    color: pillNavColors.primary.filledTextColor,
    borderRadius: 40,
    fontWeight: 400,
    ":hover": {
      backgroundColor: pillNavColors.primary.filledBackgroundColor,
      color: pillNavColors.primary.filledTextColor,
      borderRadius: 40,
    },
  },
});

export default UnifiedDocFeedMenu;
