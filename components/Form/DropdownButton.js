import { StyleSheet, css } from "aphrodite";
import colors, { iconColors } from "~/config/themes/colors";
import { DownIcon } from "~/config/themes/icons";
import ResearchHubPopover from "~/components/ResearchHubPopover";

const DropdownButton = ({
  opts,
  onClick,
  onSelect,
  label,
  onClose,
  onClickOutside,
  dropdownClassName,
  selected = null,
  positions = ["bottom", "top"],
  isOpen = false,
  overridePopoverStyle = null,
  overrideTargetStyle = null,
  closeAfterSelect = true,
}) => {
  console.log("onClose", onClose);
  console.log("isOpen", isOpen);
  return (
    <ResearchHubPopover
      containerStyle={{ "z-index": 100 }}
      isOpen={isOpen}
      popoverContent={
        <div className={css(styles.popoverBodyContent, overridePopoverStyle)}>
          {opts.map((o, i) => (
            <div
              className={css(styles.optContainer)}
              onClick={() => {
                onSelect(o.value);
                if (closeAfterSelect) {
                  onClose();
                }
              }}
              key={`opt-${i}`}
            >
              <div className={css(styles.infoContainer)}>
                <div className={css(styles.optTitle, o.titleStyle)}>
                  {o.title}
                </div>
                <div className={css(styles.optDesc)}>{o.description}</div>
              </div>
              <div className={css(styles.selectionContainer)}></div>
            </div>
          ))}
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
          <div className={css(styles.targetBtn)}>
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
});

export default DropdownButton;
