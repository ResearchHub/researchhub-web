import { css, StyleSheet } from "aphrodite";
import { Fragment } from "react";
import FormSelect from "../Form/FormSelect";
import { filterOptions, scopeOptions } from "../../config/utils/options";

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
  return (
    <Fragment>
      <FormSelect
        id={"filterBy"}
        options={filterOptions}
        value={filterBy}
        containerStyle={styles.dropDownLeft}
        inputStyle={{
          fontWeight: 500,
          minHeight: "unset",
          backgroundColor: "#FFF",
          display: "flex",
          justifyContent: "space-between",
        }}
        onChange={onSubFilterSelect}
        isSearchable={false}
      />
      <FormSelect
        id={"scope"}
        options={scopeOptions}
        value={scope}
        containerStyle={[
          styles.dropDown,
          filterBy.disableScope && styles.disableScope,
        ]}
        inputStyle={{
          fontWeight: 500,
          minHeight: "unset",
          backgroundColor: "#FFF",
          display: "flex",
          justifyContent: "space-between",
        }}
        onChange={onScopeSelect}
        isSearchable={false}
      />
    </Fragment>
  );
}

const styles = StyleSheet.create({
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
