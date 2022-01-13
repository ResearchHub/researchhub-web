import { css, StyleSheet } from "aphrodite";
import { Fragment } from "react";
import { filterOptions, scopeOptions } from "../../config/utils/options";
import colors, { pillNavColors } from "~/config/themes/colors";
import DropdownButton from "~/components/Form/DropdownButton";
import { useState } from "react";


type Props = {
  onScopeSelect: (type: string, scopeOption: any) => void;
  onSubFilterSelect: (type: string, subFilterOption: any) => void;
  subFilters: {
    filterBy: any;
    scope: any;
  };
};

export default function UnifiedDocFeedSubFilters({
  onScopeSelect,
  onSubFilterSelect,
  subFilters: { filterBy, scope },
}: Props) {

  const [isFilterSelectOpen, setIsFilterSelectOpen] = useState(false);
  const [isScopeSelectOpen, setIsScopeSelectOpen] = useState(false);

  return (
    <Fragment>
      <DropdownButton
        opts={filterOptions}
        label={filterBy.label}
        isOpen={isFilterSelectOpen}
        onClick={() => setIsFilterSelectOpen(true)}
        dropdownClassName="filterSelect"
        overrideTitleStyle={styles.customTitleStyle}
        positions={["bottom", "right" ]}
        customButtonClassName={styles.dropdownButtonOverride}
        onSelect={(selectedFilter) => {
          const obj = filterOptions.find((f) => selectedFilter === f.value)
          onSubFilterSelect(obj);
        }}
        onClose={() => setIsFilterSelectOpen(false)}
      />
      {!filterBy.disableScope &&
        <DropdownButton
          opts={scopeOptions}
          label={scope.label}
          isOpen={isScopeSelectOpen}
          onClick={() => setIsScopeSelectOpen(true)}
          dropdownClassName="scopeSelect"
          overrideTitleStyle={styles.customTitleStyle}
          positions={["bottom", "right" ]}
          customButtonClassName={styles.dropdownButtonOverride}
          onSelect={(selectedScope) => {
            const obj = scopeOptions.find((s) => selectedScope === s.value)
            onScopeSelect(obj);
          }}
          onClose={() => setIsScopeSelectOpen(false)}
        />
      }
    </Fragment>
  );
}

const styles = StyleSheet.create({
  dropdownButtonOverride: {
    backgroundColor: pillNavColors.secondary.filledBackgroundColor,
    color: pillNavColors.secondary.filledTextColor,
    borderRadius: 40,
    fontWeight: 400,
    marginRight: 8,
    ":hover": {
      borderRadius: 40,
      backgroundColor: pillNavColors.secondary.filledBackgroundColor,
    }
  },
  customTitleStyle: {
    fontWeight: 400,
  },
  disableScope: {
    pointerEvents: "none",
    cursor: "not-allowed",
    opacity: 0.4,
  },
  dropDown: {
    width: 140,
    margin: 0,
    minHeight: "unset",
    fontSize: 14,
    borderRadius: 3,
    "@media only screen and (max-width: 1343px)": {
      height: "unset",
    },
    "@media only screen and (max-width: 1149px)": {
      width: 150,
      fontSize: 13,
    },
    "@media only screen and (max-width: 767px)": {
      width: "calc(50% - 5px)",
    },
  },
  dropDownLeft: {
    width: 140,
    margin: 0,
    minHeight: "unset",
    fontSize: 14,
    marginRight: 10,
    borderRadius: 3,
    "@media only screen and (max-width: 1343px)": {
      height: "unset",
    },
    "@media only screen and (max-width: 1149px)": {
      width: 150,
      fontSize: 13,
    },
    "@media only screen and (max-width: 767px)": {
      width: "calc(50% - 5px)",
    },
  },
});
