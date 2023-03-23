import colors from "~/config/themes/colors";
import { ReactElement, useEffect, useRef, useState } from "react";
import { css, StyleSheet } from "aphrodite";
import reviewCategories from "./config/reviewCategories";
import icons from "~/config/themes/icons";

function ReviewCategorySelector({ handleSelect }): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const _handleSelect = (reviewCategory) => {
    handleSelect(reviewCategory);
    setIsOpen(false);
  };

  const _handleOutsideClick = (e) => {
    if (
      !dropdownRef.current?.contains(e.target) &&
      !triggerRef.current?.contains(e.target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", _handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", _handleOutsideClick);
    };
  }, []);

  const renderDropdown = () => {
    return (
      <div
        className={css(styles.dropdown, isOpen && styles.dropdownOpen)}
        ref={dropdownRef}
      >
        {Object.values(reviewCategories)
          .filter((cat) => !cat.isDefault)
          .map((cat) => (
            <div
              className={css(styles.dropdownOpt)}
              onClick={() => _handleSelect(cat)}
            >
              <div className={css(styles.dropdownOptLabel)}>
                <span className={css(styles.plusIcon)}>
                  {<i className="fa-solid fa-plus"></i>}
                  {` `}
                </span>
                <span className={css(styles.catText)}>{cat.label}</span>
              </div>
              <div className={css(styles.dropdownOptDesc)}>
                {cat.description}
              </div>
            </div>
          ))}
      </div>
    );
  };

  const renderTrigger = () => {
    return (
      <div
        className={css(styles.trigger)}
        onClick={() => setIsOpen(!isOpen)}
        ref={triggerRef}
      >
        <span className={css(styles.plusIcon)}>
          {<i className="fa-solid fa-plus"></i>}
        </span>
        <span className={css(styles.triggerLabel)}>Add review category</span>
      </div>
    );
  };

  const dropdown = renderDropdown();
  const trigger = renderTrigger();
  return (
    <div className={css(styles.reviewCategorySelector)}>
      {trigger}
      {dropdown}
    </div>
  );
}

const styles = StyleSheet.create({
  reviewCategorySelector: {
    position: "relative",
  },
  plusIcon: {
    fontSize: 15,
  },
  trigger: {
    userSelect: "none",
    width: "auto",
    fontWeight: 500,
    fontSize: 14,
    cursor: "pointer",
    alignItems: "center",
    display: "inline-flex",
    color: colors.MEDIUM_GREY2(),
    ":hover": {
      transition: "0.2s",
      opacity: 0.8,
    },
  },
  triggerLabel: {
    marginLeft: 6,
  },
  dropdown: {
    position: "absolute",
    display: "none",
    zIndex: 6,
    background: "white",
    padding: "15px 0 10px 0",
    borderRadius: 4,
    marginTop: 5,
    boxShadow:
      "rgb(101 119 134 / 20%) 0px 0px 15px, rgb(101 119 134 / 15%) 0px 0px 3px 1px",
  },
  dropdownOpen: {
    display: "block",
  },
  catText: {
    marginLeft: 3,
  },
  dropdownOpt: {
    display: "block",
    padding: "7px 25px",
    cursor: "pointer",
    ":hover": {
      background: colors.LIGHTER_GREY(),
      transition: "0.2s",
    },
    alignItems: "center",
  },
  dropdownOptLabel: {
    fontSize: 16,
    fontWeight: 500,
  },
  dropdownOptDesc: {
    fontSize: 14,
    fontWeight: 400,
    marginTop: 2,
    paddingLeft: 18,
    color: colors.BLACK(0.7),
  },
});

export default ReviewCategorySelector;
