import { css, StyleSheet } from "aphrodite";
import { ReactElement, useEffect, useState, useRef } from "react";
import colors from "~/config/themes/colors";
import { angleDown, check } from "~/config/themes/icons";

import NewFeatureTooltip from "../Tooltips/NewFeatureTooltip";
import postTypes, { POST_TYPES, questionPostTypes } from "./config/postTypes";

function PostTypeSelector({
  selectedType,
  handleSelect,
  documentType,
}): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const _handleSelect = (type) => {
    handleSelect(type);
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
        className={css(
          dropdownStyles.dropdown,
          isOpen && dropdownStyles.dropdownOpen
        )}
        ref={dropdownRef}
      >
        <div
          className={css(
            dropdownStyles.dropdownGroup,
            dropdownStyles.dropdownGroup
          )}
        >
          <div className={css(dropdownStyles.dropdownGroupTitle)}>
            Contribution Type
          </div>
          {postTypes.map((t) => (
            <div
              className={css(dropdownStyles.dropdownOpt)}
              onClick={() => _handleSelect(t)}
            >
              <div
                className={css(
                  dropdownStyles.dropdownOptIcon,
                  dropdownStyles.dropdownOptIconContribute
                )}
              >
                {t.icon}
              </div>
              <div className={css(dropdownStyles.dropdownOptLabel)}>
                {t.label}
              </div>
              {selectedType?.value === t.value && (
                <div className={css(dropdownStyles.check)}>{check}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDropdownTrigger = () => {
    return (
      <div
        className={css(styles.trigger)}
        onClick={() => setIsOpen(!isOpen)}
        ref={triggerRef}
      >
        <NewFeatureTooltip
          featureName={`discussiontypes`}
          position={["bottom"]}
        />
        <span className={css(styles.selectedTypeIcon)}>
          {selectedType?.icon}
        </span>
        {selectedType?.label}{" "}
        <span className={css(styles.downIcon)}>{angleDown}</span>
      </div>
    );
  };

  const renderQuestionToggle = () => {
    return (
      <div
        className={css(
          toggle.container,
          selectedType.value === POST_TYPES.ANSWER
            ? toggle.containerForAnswer
            : toggle.containerForDiscuss
        )}
      >
        {questionPostTypes.map((t, index) => (
          <div
            className={css(
              toggle.opt,
              selectedType.value === t.value && toggle[`${t.value}_OPT`]
            )}
            key={index}
            onClick={() => _handleSelect(t)}
          >
            <span className={css(toggle.optIcon)}>{t.icon}</span>
            <span className={css(toggle.text)}>{t.label}</span>
          </div>
        ))}
      </div>
    );
  };

  if (documentType === "question" || documentType === "bounty") {
    const toggle = renderQuestionToggle();

    return <div className={css(styles.postTypeSelector)}>{toggle}</div>;
  } else {
    const dropdown = renderDropdown();
    const trigger = renderDropdownTrigger();
    return (
      <div className={css(styles.postTypeSelector)}>
        {trigger}
        {dropdown}
      </div>
    );
  }
}

const toggle = StyleSheet.create({
  container: {
    display: "inline-flex",
    padding: 4,
    border: `1px solid ${colors.NEW_BLUE()}`,
    background: "white",
    borderRadius: "4px",
    width: "auto",
    alignItems: "center",
    boxSizing: "border-box",
    // height: 26,
  },
  containerForDiscuss: {},
  containerForAnswer: {
    border: `1px solid ${colors.NEW_GREEN()}`,
  },
  text: {
    marginLeft: 7,
    fontSize: 14,
    fontWeight: 500,
  },
  optIcon: {
    fontSize: 13,
  },
  opt: {
    padding: "4px 16px",
    display: "flex",
    width: "auto",
    textAlign: "center",
    alignItems: "center",
    color: colors.MEDIUM_GREY2(),
    borderRadius: 4,
    cursor: "pointer",
  },
  DISCUSSION_OPT: {
    color: colors.NEW_BLUE(),
    background: colors.LIGHTER_BLUE(),
  },
  ANSWER_OPT: {
    background: colors.NEW_GREEN(0.1),
    color: colors.NEW_GREEN(),
  },
  selected: {
    background: colors.LIGHTER_BLUE(),
    color: colors.NEW_BLUE(),
  },
});

const dropdownStyles = StyleSheet.create({
  dropdown: {
    position: "absolute",
    display: "none",
    zIndex: 3,
    background: "white",
    padding: "15px 0 10px 0",
    borderRadius: 4,
    marginTop: 5,
    width: 220,
    boxShadow:
      "rgb(101 119 134 / 20%) 0px 0px 15px, rgb(101 119 134 / 15%) 0px 0px 3px 1px",
  },
  dropdownGroup: {
    color: colors.NEW_BLUE(),
    width: "100%",
  },
  dropdownOpen: {
    display: "flex",
  },
  dropdownGroupTitle: {
    fontWeight: 600,
    marginBottom: 10,
    marginLeft: 25,
    marginRight: 35,
    fontSize: 16,
  },
  check: {
    position: "absolute",
    right: 15,
    top: 8,
    fontSize: 12,
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
    marginRight: 10,
    fontSize: 14,
  },
  dropdownOptIconContribute: {
    color: colors.NEW_BLUE(),
  },
  dropdownOptLabel: {
    fontSize: 14,
    fontWeight: 500,
  },
});

const styles = StyleSheet.create({
  trigger: {
    color: colors.NEW_BLUE(),
    position: "relative",
    borderRadius: "4px",
    userSelect: "none",
    border: "1px solid",
    background: "white",
    width: "auto",
    padding: "4px 12px",
    boxSizing: "border-box",
    fontWeight: 500,
    fontSize: 15,
    height: 26,
    cursor: "pointer",
    alignItems: "center",
    display: "inline-flex",
    ":hover": {
      background: colors.NEW_BLUE(0.05),
      transition: "0.2s",
    },
  },
  selectedTypeIcon: {
    marginRight: 8,
    fontSize: 13,
  },
  downIcon: {
    fontSize: 20,
    marginLeft: 5,
  },
  postTypeSelector: {
    position: "relative",
  },
});

export default PostTypeSelector;
