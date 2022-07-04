import { css, StyleSheet } from "aphrodite";
import { ReactElement, useState } from "react";
import colors from "~/config/themes/colors";
import icons, { textEditorIcons } from "~/config/themes/icons";
import postTypes from "./config/postTypes";

function PostTypeSelector({ handleSelect }): ReactElement {

  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<null|any>(postTypes.find(opt => opt.isDefault));

  const _handleSelect = (type) => {
    setSelectedType(type);
    handleSelect(type);
    setIsOpen(false);
  }

  const renderDropdown = () => {
    return (
      <div className={css(dropdownStyles.dropdown, isOpen && dropdownStyles.dropdownOpen)}>
        <div className={css(dropdownStyles.dropdownGroup, dropdownStyles.dropdownGroupContribute)}>
          <div className={css(dropdownStyles.dropdownGroupTitle)}>Contribute</div>
          <div className={css(dropdownStyles.dropdownGroupSubtitle)}>To the community</div>
          {postTypes.filter(t => t.group === "contribute").map(t => (
            <div className={css(dropdownStyles.dropdownOpt)} onClick={() => _handleSelect(t)}>
              <div className={css(dropdownStyles.dropdownOptIcon, dropdownStyles.dropdownOptIconContribute)}>{t.icon}</div>
              <div className={css(dropdownStyles.dropdownOptLabel)}>{t.label}</div>
            </div>
          ))}
        </div>

        <div className={css(dropdownStyles.dropdownGroup, dropdownStyles.dropdownGroupRequest)}>
          <div className={css(dropdownStyles.dropdownGroupTitle)}>Request</div>
          <div className={css(dropdownStyles.dropdownGroupSubtitle)}>From the community</div>
          {postTypes.filter(t => t.group === "request").map(t => (
            <div className={css(dropdownStyles.dropdownOpt)} onClick={() => _handleSelect(t)}>
              <div className={css(dropdownStyles.dropdownOptIcon, dropdownStyles.dropdownOptIconRequest)}>{t.icon}</div>
              <div className={css(dropdownStyles.dropdownOptLabel)}>{t.label}</div>
            </div>
          ))}
        </div>        
      </div>
    )
  }

  const renderTrigger = () => {
    return (
      <div className={css(styles.trigger, selectedType?.group === "contribute" ? styles.contribute : styles.request )} onClick={() => setIsOpen(!isOpen)}>
        <span className={css(styles.selectedTypeIcon)}>{selectedType?.icon}</span>
        {selectedType?.label} <span className={css(styles.downIcon)}>{icons.angleDown}</span>
      </div>
    )
  }

  const dropdown = renderDropdown();
  const trigger = renderTrigger();
  return (
    <div className={css(styles.postTypeSelector)}>
      {trigger}
      {dropdown}
    </div>
  )
}

const dropdownStyles = StyleSheet.create({
  dropdown: {
    position: "absolute",
    display: "none",
    zIndex: 1,
    background: "white",
    padding: "15px 0 10px 0",
    border: `1px solid ${colors.GREY()}`,
    borderRadius: 10,
    marginTop: 5,
    dropShadow: "rgb(101 119 134 / 20%) 0px 0px 15px, rgb(101 119 134 / 15%) 0px 0px 3px 1px",
  },
  dropdownGroupContribute: {
    color: colors.NEW_BLUE(),
    borderRight: `1px solid ${colors.GREY()}`,
  },
  dropdownGroupRequest: {
    color: colors.PURPLE_LIGHT(),
  },
  dropdownOpen: {
    display: "flex",
  },
  dropdownGroup: {

  },
  dropdownGroupTitle: {
    fontWeight: 600,
    marginBottom: 4,
    marginLeft: 25,
    marginRight: 35,
    fontSize: 18,
  },
  dropdownGroupSubtitle: {
    color: colors.BLACK(0.6),
    fontSize: 14,
    marginLeft: 25,
    marginRight: 35,
    marginBottom: 15,
  },
  dropdownOpt: {
    display: "flex",
    padding: "7px 25px",
    cursor: "pointer",
    ":hover": {
      background: colors.LIGHTER_GREY(),
      transition: "0.2s"
    },
    alignItems: "center",
  },
  dropdownOptIcon: {
    marginRight: 10,
    fontSize: 14,
    color: "white",
    borderRadius: "50px",
    padding: 8,
  },
  dropdownOptIconContribute: {
    background: colors.NEW_BLUE(),
  },
  dropdownOptIconRequest: {
    background: colors.PURPLE_LIGHT(),
  },  
  dropdownOptLabel: {
    fontSize: 14,
    fontWeight: 500,
  }
});

const styles = StyleSheet.create({
  contribute: {
    color: colors.NEW_BLUE(),
  },
  request: {
    color: colors.PURPLE_LIGHT(),
  },
  trigger: {
    borderRadius: "50px",
    userSelect: "none",
    border: "1px solid",
    background: "white",
    width: "auto",
    height: 12,
    padding: "5px 12px",
    fontWeight: 500,
    fontSize: 14,
    cursor: "pointer",
    alignItems: "center",
    display: "inline-flex",
    ":hover": {
      background: colors.NEW_BLUE(0.02),
      transition: "0.2s"
    }
  },
  selectedTypeIcon: {
    marginRight: 5,
    fontSize: 12,
  },
  downIcon: {
    fontSize: 20,
    marginLeft: 5,
  },
  postTypeSelector: {
    position: "relative",
  },
});

export default PostTypeSelector;
