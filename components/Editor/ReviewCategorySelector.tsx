import colors from "~/config/themes/colors";
import { ReactElement, useState } from "react";
import { css, StyleSheet } from "aphrodite";
import reviewCategories from "./config/reviewCategories";
import icons from "~/config/themes/icons";

function ReviewCategorySelector({ handleSelect }): ReactElement {

  const [isOpen, setIsOpen] = useState(false);

  const _handleSelect = (reviewCategory) => {
    handleSelect(reviewCategory);
    setIsOpen(false);
  }

  const renderDropdown = () => {
    return (
      <div className={css(styles.dropdown, isOpen && styles.dropdownOpen)}>
        {Object.values(reviewCategories).filter(cat => !cat.isDefault).map(cat => (
          <div className={css(styles.dropdownOpt)} onClick={() => _handleSelect(cat)}>
            <div className={css(styles.dropdownOptLabel)}>
              <span className={css(styles.plusIcon)}>{icons.plusCircleSolid}{` `}</span>
              {cat.label}
            </div>
            <div className={css(styles.dropdownOptDesc)}>{cat.description}</div>
          </div>
        ))}
      </div>
    )
  }

  const renderTrigger = () => {
    return (
      <div className={css(styles.trigger)} onClick={() => setIsOpen(!isOpen)}>
        <span className={css(styles.plusIcon)}>{icons.plusCircleSolid}</span>
        <span className={css(styles.triggerLabel)}>Add review category</span>
      </div>
    )
  }

  const dropdown = renderDropdown();
  const trigger = renderTrigger();
  return (
    <div className={css(styles.reviewCategorySelector)}>
      {trigger}
      {dropdown}
    </div>
  )  
}

const styles = StyleSheet.create({
  reviewCategorySelector: {
    position: "relative"
  },
  plusIcon: {
    fontSize: 16,
  },
  trigger: {
    userSelect: "none",
    width: "auto",
    fontWeight: 500,
    fontSize: 14,
    cursor: "pointer",
    alignItems: "center",
    display: "inline-flex",
    color: colors.NEW_BLUE(),
    ":hover": {
      transition: "0.2s",
      opacity: 0.8,
    },
    
  },
  triggerLabel: {
    marginLeft: 5,
  },
  dropdown: {
    position: "absolute",
    display: "none",
    zIndex: 1,
    background: "white",
    padding: "15px 0 10px 0",
    border: `1px solid ${colors.GREY()}`,
    borderRadius: 4,
    marginTop: 5,
    boxShadow: "rgb(101 119 134 / 20%) 0px 0px 15px, rgb(101 119 134 / 15%) 0px 0px 3px 1px",
  },
  dropdownOpen: {
    display: "block",
  },
  dropdownOpt: {
    display: "block",
    padding: "7px 25px",
    cursor: "pointer",
    ":hover": {
      background: colors.LIGHTER_GREY(),
      transition: "0.2s"
    },
    alignItems: "center"
  },
  dropdownOptLabel: {
    fontSize: 16,
    fontWeight: 500,    
  },
  dropdownOptDesc: {
    fontSize: 14,
    fontWeight: 400,
    marginTop: 2,
    paddingLeft: 20,
    color: colors.BLACK(0.7),
  },  
})

export default ReviewCategorySelector;