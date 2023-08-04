import { faChevronDown, faGlobe } from "@fortawesome/pro-regular-svg-icons";
import Menu, { MenuOption } from "../shared/GenericMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup, faUserLock } from "@fortawesome/pro-solid-svg-icons";
import { CommentPrivacyFilter } from "./lib/types";
import { genClientId } from "~/config/utils/id";
import { useState } from "react";
import { StyleSheet, css } from "aphrodite";
import colors from "./lib/colors";
import { faCheck } from "@fortawesome/pro-regular-svg-icons";

interface Props {
  onSelect: Function;
  selected: CommentPrivacyFilter;
}

const CommentPrivacySelector = ({ onSelect, selected }: Props) => {
  // TODO: Integrate with CommentContext so that we can get the current privacy selection

  const [menuId, setMenuId] = useState<string>(genClientId());

  const menuOptions = [
    { label: "Public", value: "PUBLIC", icon: <FontAwesomeIcon icon={faGlobe} />, subtitle: "Visible to everyone" },
    { label: "Organization", shortLabel: "Org", value: "WORKSPACE", icon: <FontAwesomeIcon icon={faUserGroup} />, subtitle: "Visible to members only" },
    { label: "Private", value: "PRIVATE", icon: <FontAwesomeIcon icon={faUserLock} />, subtitle: "Visible only to you" },
  ]

  const _handleSelect = (option: MenuOption) => {
    onSelect(option.value)
  }

  interface RenderType {
    option:MenuOption & {subtitle: string};
    withSubtitle?: boolean;
    isSelected: boolean;
  }
  const renderOpt = ({ option, isSelected }: RenderType) => {
    return (
      <div className={css(styles.opt)}>
        <div className={css(styles.optIcon)}>
          {option.icon}
        </div>
        <div className={css(styles.optText)}>
          <div className={css(styles.optLabel)}>
            {option.label}
          </div>
          <div className={css(styles.optSubtitle)}>
            {option.subtitle}
          </div>
        </div>
        {isSelected && (
          <div className={css(styles.selected)}>
            <FontAwesomeIcon icon={faCheck} />
          </div>
        )}
      </div>
    )
  }

  const _selected = menuOptions.find(option => option.value === selected) || menuOptions[0]
  const _menuOptions = menuOptions.map(option => ({...option, html: renderOpt({ option, isSelected: option.value === selected })}))

  return (
    <Menu
      options={_menuOptions}
      onSelect={_handleSelect}
      id={menuId}
      width={210}
      direction="bottom-right"
    >
      <div className={css(styles.trigger)}>
        <div className={css(styles.triggerIcon)}>
          {_selected.icon}
        </div>
        <div className={css(styles.triggerLabel)}>
          {_selected.shortLabel || _selected.label}
        </div>
        <div className={css(styles.down)}>
          <FontAwesomeIcon icon={faChevronDown} />
        </div>
      </div>
    </Menu>
  )
}

const styles = StyleSheet.create({
  trigger: {
    display: "flex",
    columnGap: "7px",
    borderRadius: "4px",
    border: `1px solid ${colors.primary.btn}`,
    color: colors.primary.btn,
    padding: "5px 10px",
  },
  triggerIcon: {
    fontSize: 14,
  },
  down: {
    color: colors.primary.btn,
    marginLeft: "auto",
    fontSize: 14,
  },
  triggerLabel: {
    fontSize: 14,
    fontWeight: 500,
  },
  opt: {
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    width: "100%",
  },
  optIcon: {
    marginRight: 15,
    fontSize: 22,
  },
  optText: {
    display: "flex",
    flexDirection: "column",
    rowGap: "2px",
  },
  optLabel: {
    fontWeight: 500,
  },
  optSubtitle: {
    fontWeight: 400,
    fontSize: 13,
    color: colors.gray
  },
  selected: {
    marginLeft: "auto",
  },
});

export default CommentPrivacySelector;