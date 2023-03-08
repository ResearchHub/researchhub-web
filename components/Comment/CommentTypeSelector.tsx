import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faAngleDown } from "@fortawesome/pro-light-svg-icons";
import { COMMENT_TYPES } from "./lib/types";
import { css, StyleSheet } from "aphrodite";
import { useEffect, useRef, useState } from "react";
import colors from "~/config/themes/colors";
import commentTypes from "./lib/commentTypes";
import isOutsideClick from "~/config/utils/isOutsideClick";

type Args = {
  selectedType: COMMENT_TYPES,
  handleSelect: Function,
  displayVerb?: Boolean,
}

const CommentTypeSelector = ({ selectedType, handleSelect, displayVerb }: Args) => {

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const _selectedType = commentTypes.find((t) => t.value === selectedType);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const _handleClick = (e) => {
      if (dropdownRef.current) {
        const _isOutsideClick = isOutsideClick({
          el: dropdownRef.current,
          clickedEl: e.target,
          exclude: [".comment-type-dropdown"]
        })
        if (_isOutsideClick) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener("click", _handleClick);

    return () => {
      document.removeEventListener("click", _handleClick);
    };
  }, []);
  
  return (
    <div className={css(styles.commentTypeSelector)}>
      <div onClick={() => setIsOpen(!isOpen)} className={`${css(styles.trigger)} comment-type-dropdown`}>
        <span>{displayVerb ? _selectedType!.verb : _selectedType!.label}</span>
        <FontAwesomeIcon icon={faAngleDown} style={{fontSize: 20}} />
      </div>
      <div ref={dropdownRef} className={css(styles.dropdown, isOpen && styles.dropdownOpen)}>
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
              {displayVerb ? t.verb : t.label}
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
    cursor: "pointer",
    color: colors.NEW_BLUE(),
    paddingBottom: 2,
    paddingLeft: 0,
    paddingRight: 0,
    userSelect: "none",
    borderBottom: `1px solid ${colors.NEW_BLUE()}`,
  },
  dropdown: {
    position: "absolute",
    display: "none",
    zIndex: 2,
    background: "white",
    userSelect: "none",
    textTransform: "capitalize",
    padding: "15px 0 10px 0",
    borderRadius: 4,
    marginTop: 5,
    width: 220,
    boxShadow:
      "rgb(101 119 134 / 20%) 0px 0px 15px, rgb(101 119 134 / 15%) 0px 0px 3px 1px",    
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