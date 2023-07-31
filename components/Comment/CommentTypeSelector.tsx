import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faCheck } from "@fortawesome/pro-light-svg-icons";
import { COMMENT_TYPES } from "./lib/types";
import { css, StyleSheet } from "aphrodite";
import { useRef, useState } from "react";
import { commentTypes } from "./lib/options";
import { useEffectHandleClick } from "~/config/utils/clickEvent";
import IconButton from "../Icons/IconButton";
import colors from "./lib/colors";

type Args = {
  selectedType: COMMENT_TYPES;
  handleSelect: Function;
};

const CommentTypeSelector = ({ selectedType, handleSelect }: Args) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const _selectedType =
    commentTypes.find((t) => t.value === selectedType) || commentTypes[0];
  const dropdownRef = useRef(null);

  useEffectHandleClick({
    ref: dropdownRef,
    exclude: [".comment-type-dropdown"],
    onOutsideClick: () => setIsOpen(false),
  });

  const _handleSelect = (value) => {
    setIsOpen(false);
    handleSelect(value);
  };

  return (
    <div className={css(styles.commentTypeSelector)}>
      <div className={`${css(styles.trigger)} comment-type-dropdown`}>
        <IconButton
          overrideStyle={styles.labelWrapper}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span style={{ fontSize: 12 }}>{_selectedType.icon}</span>
          {_selectedType!.label}
          <FontAwesomeIcon
            icon={faAngleDown}
            style={{ marginLeft: 3, fontSize: 16 }}
          />
        </IconButton>
      </div>
      <div
        ref={dropdownRef}
        className={css(styles.dropdown, isOpen && styles.dropdownOpen)}
      >
        {commentTypes.map((t, idx) => (
          <div
            key={`type-${idx}`}
            className={css(styles.dropdownOpt)}
            onClick={() => _handleSelect(t.value)}
          >
            <div className={css(styles.dropdownOptIcon)}>{t.icon}</div>
            <div className={css(styles.dropdownOptLabel)}>{t.label}</div>
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
  },
  trigger: {
    cursor: "pointer",
    userSelect: "none",
  },
  labelWrapper: {
    marginTop: 5,
    display: "flex",
    columnGap: "4px",
    color: colors.primary.btn,
    alignItems: "center",
    fontWeight: 500,
    fontSize: 14,
  },
  dropdown: {
    position: "absolute",
    display: "none",
    zIndex: 2,
    background: colors.white,
    userSelect: "none",
    textTransform: "capitalize",
    padding: 0,
    borderRadius: 4,
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
    alignItems: "center",
    ":hover": {
      background: colors.hover.background,
      transition: "0.2s",
    },
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
