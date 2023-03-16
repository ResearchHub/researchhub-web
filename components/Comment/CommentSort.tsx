import { faAngleDown } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { css, StyleSheet } from "aphrodite";
import { useRef, useState } from "react";
import { useEffectHandleClick } from "~/config/utils/clickEvent";
import IconButton from "../Icons/IconButton";
import colors from "./lib/colors";
import { sortOpts } from "./lib/options";

const CommentSort = ({ selectedSort, handleSelect }) => {

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const dropdownRef = useRef(null);

  useEffectHandleClick({
    el: dropdownRef.current,
    exclude: [".comment-sort-trigger"],
    onOutsideClick: () => setIsOpen(false),
  });

  return (
    <div className={css(styles.wrapper)}>
      <div className={`${css(styles.trigger)} comment-sort-trigger`}>
        <IconButton
          overrideStyle={styles.labelWrapper}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className={css(styles.dropdownIcon)}>{selectedSort.icon}</div>
          <div className={css(styles.dropdownLabel)}>{selectedSort.label}</div>
          <FontAwesomeIcon
            icon={faAngleDown}
            style={{ marginLeft: 3, fontSize: 16 }}
          />          
        </IconButton>
      </div>
      <div ref={dropdownRef} className={css(styles.dropdown, isOpen && styles.dropdownOpen)}>
        {sortOpts.map((s) => (
          <div className={css(styles.option)}>
            <div className={css(styles.dropdownIcon)}>{s.icon}</div>
            <div className={css(styles.dropdownLabel)}>{s.label}</div>
          </div>
        ))}
      </div>  
    </div>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    userSelect: "none",
  },
  labelWrapper: {
    marginTop: 5,
    display: "flex",
    columnGap: "4px",
    color: colors.primary.text,
    alignItems: "center",
    fontWeight: 400,
    fontSize: 16,
  },  
  trigger: {
  },
  dropdown: {
    display: "none",
    position: "absolute",
    top: 30,
    zIndex: 2,
    right: 0,
    height: "auto",
    width: 150,
    background: "white",
    padding: 0,
    borderRadius: 10,
    marginTop: 5,
    marginLeft: 5,
    boxShadow:
      "rgb(101 119 134 / 20%) 0px 0px 15px, rgb(101 119 134 / 15%) 0px 0px 3px 1px",

  },
  dropdownOpen: {
    display: "block",
  },
  option: {
    display: "flex",
    cursor: "pointer",
    alignItems: "center",
    columnGap: "7px",
    padding: "7px 12px",
    position: "relative",
    boxSizing: "border-box",
    fontSize: 14,
    width: "100%",
    ":hover": {
      background: colors.hover.background,
      transition: "0.2s",
    },    
  },
  dropdownIcon: {
    fontSize: 12,
  },
  dropdownLabel: {

  }
});

export default CommentSort;