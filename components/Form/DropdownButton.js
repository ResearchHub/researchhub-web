import { StyleSheet, css } from "aphrodite";
import colors, { iconColors } from "~/config/themes/colors";
import { DownIcon } from "~/config/themes/icons";
import ResearchHubPopover from "~/components/ResearchHubPopover";
import { Fragment } from "react";

const DropdownButton = ({
  opts,
  onClick,
  onSelect,
  label,
  onClose,
  onClickOutside,
  dropdownClassName,
  customButtonClassName,
  popoverStyle,
  labelAsHtml = null,
  selected = null,
  overridePopoverStyle = null,
  overrideOptionsStyle = null,
  overrideTargetStyle = null,
  overrideTitleStyle = null,
  overrideTargetButton = null,
  overrideDownIconStyle = null,
  htmlBefore = null, // HTML to be injected before the list
  htmlAfter = null, // HTML to be injected after the list
  closeAfterSelect = true,
  positions = ["bottom", "top"],
  isOpen = false,
  withDownIcon = true,
}) => {
  return (
    <ResearchHubPopover
      containerStyle={{ "z-index": 100 }}
      isOpen={isOpen}
      popoverStyle={popoverStyle}
      popoverContent={
        <div className={css(styles.popoverBodyContent, overridePopoverStyle)}>
          <div className={css(styles.htmlBefore)}>{htmlBefore}</div>
          <div className={css(styles.options, overrideOptionsStyle)}>
            {opts.map((option, i) => (
              <div
                className={css(
                  styles.optContainer,
                  option.value === selected && styles.selectedOpt
                )}
                onClick={() => {
                  option.onSelect
                    ? // Specific onSelect per option
                      option.onSelect(option.value)
                    : // Generic, top level onSelect function
                      onSelect(option.value);

                  if (closeAfterSelect) {
                    onClose();
                  }
                }}
                key={`opt-${i}`}
              >
                <div className={css(styles.infoContainer)}>
                  {option.html ? (
                    option.html
                  ) : (
                    <Fragment>
                      <div
                        className={css(
                          styles.optTitle,
                          option.titleStyle,
                          overrideTitleStyle
                        )}
                      >
                        {option.title || option.label}
                      </div>
                      <div className={css(styles.optDesc)}>
                        {option.description}
                      </div>
                    </Fragment>
                  )}
                </div>
                <div className={css(styles.selectionContainer)}></div>
              </div>
            ))}
          </div>
          <div className={css(styles.htmlAfter)}>{htmlAfter}</div>
        </div>
      }
      positions={positions}
      onClickOutside={onClickOutside}
      className={dropdownClassName}
      targetContent={
        <div
          className={css(styles.dropdownContainer, overrideTargetStyle)}
          onClick={() => (isOpen ? onClose() : onClick())}
        >
          <div
            className={css(
              styles.targetBtn,
              overrideTargetButton,
              customButtonClassName
            )}
          >
            {labelAsHtml || label}
            {withDownIcon && (
              <DownIcon
                withAnimation={false}
                overrideStyle={[styles.downIcon, overrideDownIconStyle]}
              />
            )}
          </div>
        </div>
      }
    />
  );
};

const styles = StyleSheet.create({
  popoverBodyContent: {
    backgroundColor: "white",
    borderRadius: 4,
    // boxShadow: "0px 0px 10px 0px #00000026",
    display: "flex",
    flexDirection: "column",
    // marginLeft: 10,
    // marginTop: 5,
    userSelect: "none",
    width: 270,
    overflowY: "scroll",
  },
  dropdownContainer: {
    cursor: "pointer",
    marginLeft: "auto",
    zIndex: 1,
  },
  optContainer: {
    padding: "10px 14px",
    ":hover": {
      cursor: "pointer",
      backgroundColor: colors.GREY(0.2),
    },
  },
  optTitle: {
    fontWeight: 500,
  },
  selectedOpt: {
    background: colors.LIGHTER_GREY(),
  },
  optDesc: {
    fontSize: 14,
  },
  infoContainer: {},
  selectionContainer: {
    display: "flex",
  },
  targetBtn: {
    padding: "8px 16px",
    userSelect: "none",
    textTransform: "capitalize",
    color: colors.BLACK(0.8),
    ":hover": {
      background: iconColors.BACKGROUND,
      borderRadius: 3,
      transition: "0.3s",
    },
  },
  downIcon: {
    padding: 4,
    fontSize: 11,
  },
  htmlAfter: {},
});

export default DropdownButton;
