import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCheck } from "@fortawesome/free-solid-svg-icons";
import { COMMENT_TYPES } from "./lib/types";
import { css, StyleSheet } from "aphrodite";
import { useState } from "react";
import colors from "~/config/themes/colors";
import commentTypes from "./lib/commentTypes";

type Args = {
  selectedType: COMMENT_TYPES,
  handleSelect: Function,
}

const CommentTypeSelector = ({ selectedType, handleSelect }: Args) => {

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const _selectedType = commentTypes.find((t) => t.value === selectedType);

  return (
    <div className={css(styles.commentTypeSelector)}>
      <div onClick={() => setIsOpen(!isOpen)} className={css(styles.trigger)}>
        <span>{_selectedType!.label}</span>
        <FontAwesomeIcon icon={faCaretDown} />
      </div>
      <div className={css(styles.dropdown, isOpen && styles.dropdownOpen)}>
        {commentTypes.map((t) => (
          <div
            className={css(styles.dropdownOpt)}
            onClick={() => handleSelect(t)}
          >
            <div
              className={css(
                styles.dropdownOptIcon,
              )}
            >
              {t.icon}
            </div>
            <div className={css(styles.dropdownOptLabel)}>
              {t.label}
            </div>
            {selectedType === t.value && (
              <div className={css(styles.check)}>
                <FontAwesomeIcon icon={faCheck} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )

}

const styles = StyleSheet.create({
  commentTypeSelector: {
    position: "relative",
  },
  trigger: {
    padding: 8,
    columnGap: "8px",
    display: "flex",
  },
  dropdown: {
    position: "absolute",
    display: "none",
    zIndex: 2,
    userSelect: "none",
  },
  dropdownOpen: {
    display: "block",
  },
  dropdownOpt: {
    display: "flex",
    padding: "7px 25px",
    cursor: "pointer",
    position: "relative",
    boxSizing: "border-box",
    width: "100%",
    ":hover": {
      background: colors.LIGHTER_GREY(),
      transition: "0.2s",
    },
    alignItems: "center",
  },
  dropdownOptIcon: {
  },
  check: {
    position: "absolute",
    right: 15,
    top: 8,
    fontSize: 12,
  },  
  dropdownOptLabel: {
    fontSize: 14,
    fontWeight: 500,
  },
})

export default CommentTypeSelector;