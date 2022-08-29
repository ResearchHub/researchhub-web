import { css, StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

const FeedMenuTagDropdown = ({ options, handleSelect, selectedTags }) => {
  return (
    <div className={css(styles.additionalOpts)}>
      {options.map((opt) => (
        <div
          className={css(styles.tag)}
          onClick={(event) => {
            event.stopPropagation();
            handleSelect(opt.value);
          }}
        >
          <span className={css(styles.tagLabel)}>{opt.label}</span>
          {selectedTags.includes(opt.value) ? (
            <span className={css(styles.tagIcon, styles.toggleOn)}>
              {icons.toggleOn}
            </span>
          ) : (
            <span className={css(styles.tagIcon, styles.toggleOff)}>
              {icons.toggleOff}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

const styles = StyleSheet.create({
  additionalOpts: {
    position: "absolute",
    background: "white",
    top: 30,
    left: 0,
    width: 150,
    zIndex: 5,
    padding: 5,
    boxShadow: "rgb(0 0 0 / 15%) 0px 0px 10px 0px",
  },
  tag: {
    padding: "6px 5px ",
    color: colors.BLACK(1.0),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    ":hover": {
      color: colors.NEW_BLUE(1.0),
    },
  },
  tagLabel: {},
  tagIcon: {
    fontSize: 22,
    color: colors.NEW_BLUE(),
  },
  toggleOn: {
    color: colors.NEW_BLUE(),
  },
  toggleOff: {
    color: "#c3c3c3",
  },
});

export default FeedMenuTagDropdown;
