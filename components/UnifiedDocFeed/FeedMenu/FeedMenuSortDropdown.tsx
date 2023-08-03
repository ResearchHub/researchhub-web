import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/pro-regular-svg-icons";
import { faArrowRight } from "@fortawesome/pro-solid-svg-icons";
import { scopeOptions, sortOpts } from "../constants/UnifiedDocFilters";
import { css, StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";
import { useEffect, useRef, useState } from "react";

import { breakpoints } from "~/config/themes/screen";

function FeedMenuSortDropdown({
  selectedOrderingValue,
  selectedFilters,
  selectedScopeValue,
  onOrderingSelect,
  onScopeSelect,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOrderingObj = sortOpts[selectedOrderingValue];

  const availSortOpts = Object.values(sortOpts).filter((s) =>
    s.availableFor.includes(selectedFilters.type)
  );
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

  const timeScopeObj = scopeOptions[selectedScopeValue];
  return (
    (<div className={css(styles.FeedMenuSortDropdown)} ref={dropdownRef}>
      <div className={css(styles.display)} onClick={() => setIsOpen(!isOpen)}>
        <div className={css(styles.displayIcon)}>
          {selectedOrderingObj?.icon}
        </div>
        <div className={css(styles.displayLabel)}>
          {selectedOrderingObj?.selectedLabel}
          {!selectedOrderingObj.disableScope && (
            <span className={css(styles.displayTimeScope)}>
              <span className={css(styles.rightIcon)}>
                {<FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon>}
              </span>
              <span className={css(styles.selectedTimeScopeLabel)}>
                {timeScopeObj.label}
              </span>
            </span>
          )}
        </div>
        <div className={css(styles.displayDown)}>
          {<FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>}
        </div>
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
                    {Object.values(scopeOptions).map((scope) => (
                      <div
                        className={css(
                          styles.scope,
                          selectedScopeValue === scope.value &&
                            styles.selectedScope
                        )}
                        key={`scope-` + scope.value}
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
    </div>)
  );
}

const styles = StyleSheet.create({
  FeedMenuSortDropdown: {
    position: "relative",
    border: `1px solid ${colors.GREY_LINE(1)}`,
    borderRadius: 4,
    padding: "5px 12px",
    fontSize: 15,
    userSelect: "none",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      border: 0,
      padding: 0,
      color: colors.BLACK(0.6),
    },
  },
  display: {
    display: "flex",
    cursor: "pointer",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      lineHeight: "25px",
    },
  },
  displayTimeScope: {
    display: "none",
    [`@media only screen and (min-width: ${breakpoints.bigDesktop.str})`]: {
      display: "initial",
    },
  },
  selectedTimeScopeLabel: {
    fontWeight: 300,
  },
  rightIcon: {
    marginLeft: 7,
    marginRight: 7,
    fontSize: 14,
  },
  displayIcon: {
    marginRight: 8,
    fontSize: 16,
  },
  displayLabel: {
    marginRight: 8,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
  },
  displayDown: {},
  dropdownBody: {
    position: "absolute",
    top: 35,
    right: 0,
    zIndex: 50,
    height: "auto",
    width: 200,
    background: colors.WHITE(),
    boxShadow: `0px 0px 10px 0px ${colors.PURE_BLACK(0.15)}`,
    color: colors.BLACK(0.8),
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      left: -10,
    },
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
    marginRight: 7,
    marginTop: 7,
    fontSize: 13,
    padding: "4px 6px",
    ":hover": {
      background: colors.LIGHT_GREY(),
      cursor: "pointer",
    },
  },
  selectedScope: {
    background: colors.LIGHT_GREY(),
  },
});

export default FeedMenuSortDropdown;
