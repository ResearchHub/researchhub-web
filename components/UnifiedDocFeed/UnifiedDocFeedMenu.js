import HorizontalTabBar from "~/components/HorizontalTabBar";
import { css, StyleSheet } from "aphrodite";
import { breakpoints } from "~/config/themes/screen";
import { useRouter } from "next/router";
import UnifiedDocFeedSubFilters from "./UnifiedDocFeedSubFilters";
import { filterOptions, scopeOptions } from "~/config/utils/options";
import { useState } from "react";
import DropdownButton from "~/components/Form/DropdownButton";
import colors from "~/config/themes/colors";

const UnifiedDocFeedMenu = ({ selectedDocFilter }) => {
  const router = useRouter();
  const [subFilters, setSubFilters] = useState({
    filterBy: filterOptions[0],
    scope: scopeOptions[0],
  });
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
        value: "post",
        label: "Posts",
      },
      {
        value: "hypothesis",
        label: "hypotheses",
      },
    ];

    return tabs.map((t) => {
      t.isSelected = t.value === router.query.type ? true : false;
      return t;
    });
  };

  const tabs = getTabs();
  const selectedTab = tabs.find((t) => t.isSelected);
  const handleTabClick = () => null;

  return (
    <div className={css(styles.feedMenu)}>
      <div className={css(styles.horizontalTabWrapper)}>
        <HorizontalTabBar
          id="hpTabBar"
          tabs={tabs}
          onClick={handleTabClick}
          containerStyle={styles.horizontalMenuOverride}
          dragging={true}
          alignCenter={false}
        />
      </div>
      <div className={css(styles.dropdownButtonWrapper)}>
        <DropdownButton
          opts={tabs}
          label={selectedTab.label}
          isOpen={isOpen}
          onClick={() => setIsOpen(true)}
          dropdownClassName="filter"
          positions={["bottom", "right"]}
          customButtonClassName={styles.dropdownButtonOverride}
          onSelect={(newPerm) => {
            return null;
          }}
          onClose={() => setIsOpen(false)}
        />
      </div>
      <div className={css(styles.seperator)}></div>
      <div className={css(styles.subFilters)}>
        <UnifiedDocFeedSubFilters
          onSubFilterSelect={(_type, filterBy) =>
            setSubFilters({ filterBy, scope: subFilters.scope })
          }
          onScopeSelect={(_type, scope) =>
            setSubFilters({ filterBy: subFilters.filterBy, scope })
          }
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
    width: 296,
  },
  horizontalTabWrapper: {
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
  },
  dropdownButtonWrapper: {
    [`@media only screen and (min-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
  },
  subFilters: {
    display: "flex",
  },
  dropdownButtonOverride: {
    backgroundColor: colors.GREY(0.2),
    borderRadius: 40,
    fontWeight: 500,
    ":hover": {
      borderRadius: 40,
    },
  },
});

export default UnifiedDocFeedMenu;
