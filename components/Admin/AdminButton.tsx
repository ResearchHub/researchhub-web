import icons from "~/config/themes/icons";
import { css, StyleSheet } from "aphrodite";
import DropdownButton from "../Form/DropdownButton";
import { useState } from "react";

export function AdminButton() {

  const dropdownOpts = [{
    icon: icons.trash,
    label: "Remove page",
    value: "remove",
    onClick: () => null
  }, {
    icon: icons.trash,
    label: "Remove page ",
    value: "remove",
    onClick: () => null
  }]

  const [isOpen, setIsOpen] = useState(false);

  const renderDropdownOpt = (opt) => {
    return (
      <div>
        <span className={css(styles.iconWrapper)}>{opt.icon}</span>
        <span className={css(styles.optLabel)}>{opt.label}</span>
      </div>
    );
  };

  const optsAsHTML = dropdownOpts
    .map((opt) => renderDropdownOpt(opt))
    .map((opt, i) => ({ html: opt, ...dropdownOpts[i] }));

  return (
    <DropdownButton
      opts={optsAsHTML}
      labelAsHtml={icons.shield}
      // selected={filterBy.value}
      isOpen={isOpen}
      onClick={() => setIsOpen(true)}
      // dropdownClassName="adminSelect"
      onClickOutside={() => {
        setIsOpen(false);
      }}
      // overrideTitleStyle={styles.customTitleStyle}
      positions={["right", "bottom"]}
      // customButtonClassName={[
      //   styles.dropdownButtonOverride,
      //   styles.dropdownButtonOverrideForFilter,
      // ]}
      // overrideDownIconStyle={styles.overrideDownIconStyle}
      onSelect={(selected) => {
        // const selectedFilterObj = tabs.find(
        //   (t) => t.value === selectedFilter
        // );
        console.log(selected)
      }}
      overrideTargetButton={styles.overrideTargetButton}
      withDownIcon={false}
      onClose={() => setIsOpen(false)}
    />    
  )
  
}

const styles = StyleSheet.create({
  "iconWrapper": {

  },
  "optLabel": {

  },
  "overrideTargetButton": {
    backgroundColor: "none",
    color: "rgba(36, 31, 58, 0.35)",
    paddingTop: 11,
    paddingLeft: 17,
    ":hover": {
      color: "inherit",
      backgroundColor: "inherit",
      borderColor: "inherit",
    },    
  }
});
