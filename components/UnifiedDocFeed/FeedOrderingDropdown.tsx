import { sortOpts } from "./constants/UnifiedDocFilters";
import { scopeOptions } from "~/config/utils/options";
import { css, StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";
import { useEffect, useRef, useState } from "react";
import icons from "~/config/themes/icons";
import { breakpoints } from "~/config/themes/screen";

function FeedOrderingDropdown({
  selectedOrderingValue,
  selectedFilters,
  selectedScopeValue,
  onOrderingSelect,
  onScopeSelect,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOrderingObj = sortOpts.find(
    (o) => o.value === selectedOrderingValue
  );

  const availSortOpts = sortOpts.filter(s => s.availableFor.includes(selectedFilters.type));
  const dropdownRef = useRef<HTMLDivElement>(null);

  const _handleOrderingClick = (selected) => {
    onOrderingSelect(selected);
    if (selected.disableScope) {
      setIsOpen(false);
    }
  };

  const _handleScopeClick = ({ event, scope }) => {
    event.stopPropagation();
    onScopeSelect(scope);
    setIsOpen(true);
  };

  const _handleOutsideClick = (e) => {
    if (!dropdownRef.current?.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", _handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", _handleOutsideClick);
    };
  }, []);

  return (
    <div className={css(styles.feedOrderingDropdown)} ref={dropdownRef}>
      <div className={css(styles.display)} onClick={() => setIsOpen(!isOpen)}>
        <div className={css(styles.displayIcon)}>
          {selectedOrderingObj?.icon}
        </div>
        <div className={css(styles.displayLabel)}>
          {selectedOrderingObj?.label}
        </div>
        <div className={css(styles.displayDown)}>{icons.chevronDown}</div>
      </div>
      {isOpen && (
        <div className={css(styles.dropdownBody)}>
          {availSortOpts.map((opt) => (
            <div
              onClick={() => _handleOrderingClick(opt)}
              className={css(
                styles.opt,
                selectedScopeValue === opt.value && styles.selectedOpt
              )}
              key={"sort-" + opt.value}
            >
              <div className={css(styles.optLineItem)}>
                <div className={css(styles.optIcon)}>{opt.icon}</div>
                <div className={css(styles.optLabel)}>{opt.label}</div>
              </div>
              {selectedOrderingObj?.value === opt.value &&
                !selectedOrderingObj?.disableScope && (
                  <div className={css(styles.timeScopeContainer)}>
                    {scopeOptions.map((scope) => (
                      <div
                        className={css(
                          styles.scope,
                          selectedScopeValue === scope.value &&
                            styles.selectedScope
                        )}
                        onClick={(event) => _handleScopeClick({ event, scope })}
                      >
                        {scope.label.replace("This ", "")}
                      </div>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = StyleSheet.create({
  feedOrderingDropdown: {
    position: "relative",
    border: `1px solid ${colors.GREY_LINE(1)}`,
    borderRadius: 4,
    padding: "5px 12px",
    fontSize: 15,
    userSelect: "none",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      border: 0,
      paddingTop: 0,
      paddingLeft: 0,
      color: colors.BLACK(0.6),
      paddingRight: 0,
    }    
  },
  display: {
    display: "flex",
    cursor: "pointer",
  },
  displayIcon: {
    marginRight: 8,
    fontSize: 16,
  },
  displayLabel: {
    marginRight: 8,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    }
  },
  displayDown: {},
  dropdownBody: {
    position: "absolute",
    top: 35,
    right: 0,
    zIndex: 50,
    height: "auto",
    width: 200,
    background: "white",
    boxShadow: "0px 0px 10px 0px #00000026",
    color: colors.BLACK(0.8),
  },
  opt: {
    padding: "10px 14px",
    ":hover": {
      backgroundColor: colors.GREY(0.1),
    },
  },
  optLineItem: {
    display: "flex",
    fontSize: 15,
    cursor: "pointer",
  },
  selectedOpt: {
    background: colors.LIGHT_GREY(),
  },
  optLabel: {},
  optIcon: {
    marginRight: 5,
    width: 20,
  },
  timeScopeContainer: {
    display: "flex",
    flexWrap: "wrap",
    marginTop: 8,
  },
  scope: {
    border: `1px solid ${colors.GREY()}`,
    borderRadius: "4px",
    marginRight: 4,
    marginTop: 4,
    fontSize: 13,
    padding: 4,
    ":hover": {
      background: colors.LIGHT_GREY(),
      cursor: "pointer",
    },
  },
  selectedScope: {
    background: colors.LIGHT_GREY(),
  },
});

export default FeedOrderingDropdown;