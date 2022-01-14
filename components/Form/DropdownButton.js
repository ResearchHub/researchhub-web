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
  selected = null,
  positions = ["bottom", "top"],
  isOpen = false,
  overridePopoverStyle = null,
  overrideOptionsStyle = null,
  overrideTargetStyle = null,
  overrideTitleStyle = null,
  closeAfterSelect = true,
  htmlBefore = null, // HTML to be injected before the list
  htmlAfter = null, // HTML to be injected after the list
}) => {
  console.log("selected", selected);

  return (
    <ResearchHubPopover
      containerStyle={{ "z-index": 100 }}
      isOpen={isOpen}
      popoverContent={
        <div className={css(styles.popoverBodyContent, overridePopoverStyle)}>
          <div className={css(styles.htmlBefore)}>{htmlBefore}</div>
          <div className={css(styles.options, overrideOptionsStyle)}>
            {opts.map((o, i) => (
              <div
                className={css(
                  styles.optContainer,
                  o.value === selected && styles.selectedOpt
                )}
                onClick={() => {
                  onSelect(o.value);
                  if (closeAfterSelect) {
                    onClose();
                  }
                }}
                key={`opt-${i}`}
              >
                <div className={css(styles.infoContainer)}>
                  {o.html ? (
                    o.html
                  ) : (
                    <Fragment>
                      <div
                        className={css(
                          styles.optTitle,
                          overrideTitleStyle,
                          o.titleStyle
                        )}
                      >
                        {o.title || o.label}
                      </div>
                      <div className={css(styles.optDesc)}>{o.description}</div>
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
          <div className={css(styles.targetBtn, customButtonClassName)}>
            {label}
            <DownIcon withAnimation={false} overrideStyle={styles.downIcon} />
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
    boxShadow: "0px 0px 10px 0px #00000026",
    display: "flex",
    flexDirection: "column",
    marginLeft: 10,
    marginTop: 5,
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
    padding: "7px 10px",
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
