import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faCheck } from "@fortawesome/pro-light-svg-icons";
import { css, StyleSheet } from "aphrodite";
import { useContext, useRef, useState } from "react";
import { NullableString } from "~/config/types/root_types";
import { useEffectHandleClick } from "~/config/utils/clickEvent";
import IconButton from "../Icons/IconButton";
import colors from "./lib/colors";
import { sortOpts } from "./lib/options";
import { CommentTreeContext } from "./lib/contexts";

type Args = {
  selectedSortValue: NullableString;
  handleSelect: Function;
};

const CommentSort = ({ selectedSortValue, handleSelect }: Args) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const commentTreeState = useContext(CommentTreeContext);
  const dropdownRef = useRef(null);
  const selectedSort =
    sortOpts.find((s) => s.value === selectedSortValue) || sortOpts[0];
  const isNarrowWidthContext = commentTreeState.context === "sidebar" || commentTreeState.context === "drawer"

  useEffectHandleClick({
    el: dropdownRef.current,
    exclude: [".comment-sort-trigger"],
    onOutsideClick: () => setIsOpen(false),
  });

  return (
    <div className={css(styles.wrapper, isNarrowWidthContext && styles.sectionForNarrowWidthContexts)}>
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
      <div
        ref={dropdownRef}
        className={css(styles.dropdown, isOpen && styles.dropdownOpen)}
      >
        {sortOpts.map((s) => (
          <div className={css(styles.option)} key={`sort-${s.value}`} onClick={() => {
            handleSelect(s.value);
            setIsOpen(false);
          }}>
            <div className={css(styles.dropdownIcon)}>{s.icon}</div>
            <div className={css(styles.dropdownLabel)}>{s.label}</div>
            {selectedSortValue === s.value && (
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
  wrapper: {
    position: "relative",
    userSelect: "none",
  },
  labelWrapper: {
    marginTop: 0,
    display: "flex",
    columnGap: "4px",
    color: colors.primary.text,
    alignItems: "center",
    fontWeight: 500,
    padding: "6px 10px 6px 10px",
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
  check: {
    position: "absolute",
    right: 15,
    top: 8,
    fontSize: 12,
  },  
  dropdownIcon: {
    fontSize: 12,
  },
  dropdownLabel: {},
  sectionForNarrowWidthContexts: {
    marginRight: 15,
  }
});

export default CommentSort;
