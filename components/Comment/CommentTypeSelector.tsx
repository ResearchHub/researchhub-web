import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faCheck } from "@fortawesome/pro-light-svg-icons";
import { COMMENT_TYPES } from "./lib/types";
import { css, StyleSheet } from "aphrodite";
import { useRef, useState } from "react";
import colors from "~/config/themes/colors";
import commentTypes from "./lib/commentTypes";
import { useEffectHandleOutsideClick } from "~/config/utils/isOutsideClick";
import IconButton from "../Icons/IconButton";

type Args = {
  selectedType: COMMENT_TYPES;
  handleSelect: Function;
};

const CommentTypeSelector = ({
  selectedType,
  handleSelect,
}: Args) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const _selectedType = commentTypes.find((t) => t.value === selectedType) || commentTypes[0];
  const dropdownRef = useRef(null);

  useEffectHandleOutsideClick({
    el: dropdownRef.current,
    exclude: [".comment-type-dropdown"],
    onOutsideClick: () => setIsOpen(false),
  });

  return (
    <div className={css(styles.commentTypeSelector)}>
      <div className={`${css(styles.trigger)} comment-type-dropdown`}>
        <IconButton overrideStyle={styles.labelWrapper} onClick={() => setIsOpen(!isOpen)}>
          <span style={{ fontSize: 12 }}>{_selectedType.icon}</span>
          {_selectedType!.label}
          <FontAwesomeIcon icon={faAngleDown} style={{ marginLeft: 3, fontSize: 16 }} />
        </IconButton>
      </div>
      <div
        ref={dropdownRef}
        className={css(styles.dropdown, isOpen && styles.dropdownOpen)}
      >
        {commentTypes.map((t) => (
          <div
            className={css(styles.dropdownOpt)}
            onClick={() => handleSelect(t)}
          >
            <div className={css(styles.dropdownOptIcon)}>{t.icon}</div>
            <div className={css(styles.dropdownOptLabel)}>
              {t.label}
            </div>
            {selectedType === t.value && (
              <div className={css(styles.check)}>
                <FontAwesomeIcon style={{ fontSize: 12 }} icon={faCheck} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  commentTypeSelector: {
    position: "relative",
    // color: colors.NEW_BLUE(),
  },
  trigger: {
    cursor: "pointer",
    userSelect: "none",
  },
  labelWrapper: {
    marginTop: 5,
    display: "flex",
    columnGap: "4px",
    color: colors.NEW_BLUE(),
    alignItems: "center",
    fontWeight: 500,
    fontSize: 14,
    
  },
  dropdown: {
    position: "absolute",
    display: "none",
    zIndex: 2,
    background: "white",
    userSelect: "none",
    textTransform: "capitalize",
    padding: 0,
    borderRadius: 10,
    marginTop: 5,
    marginLeft: 5,
    width: 150,
    boxShadow:
      "rgb(101 119 134 / 20%) 0px 0px 15px, rgb(101 119 134 / 15%) 0px 0px 3px 1px",
  },
  dropdownOpen: {
    display: "block",
  },
  dropdownOpt: {
    display: "flex",
    columnGap: "7px",
    padding: "7px 12px",
    cursor: "pointer",
    position: "relative",
    boxSizing: "border-box",
    fontSize: 12,
    width: "100%",
    ":hover": {
      background: colors.LIGHTER_GREY(),
      transition: "0.2s",
    },
    alignItems: "center",
  },
  dropdownOptIcon: {},
  check: {
    position: "absolute",
    right: 15,
    top: 8,
    fontSize: 12,
  },
  dropdownOptLabel: {
    fontSize: 14,
  },

});

export default CommentTypeSelector;
