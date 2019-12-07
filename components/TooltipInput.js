import { StyleSheet, css } from "aphrodite";

// Config
import colors from "~/config/themes/colors";

export const TooltipInput = (props) => {
  const { title, value, onChange, save } = props;
  return (
    <div className={css(styles.tooltipEditContainer)}>
      <div className={css(styles.tooltipTitle)}>{title}</div>
      <div className={css(styles.tooltipInputContainer)}>
        <input
          className={css(styles.tooltipInput)}
          value={value}
          onChange={(e) => onChange(e)}
        />
        <div className={css(styles.submitTooltipButton)} onClick={save}>
          <i className="fas fa-arrow-right"></i>
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  tooltipTitle: {
    textTransform: "capitalize",
    fontSize: 18,
    marginBottom: 5,
  },
  tooltipInput: {
    background: "#fff",
    border: "none",
    outline: "none",
    boxSizing: "border-box",
  },
  fullOpacity: {
    opacity: 1,
  },
  tooltipEditContainer: {
    position: "absolute",
    bottom: -60,
    left: "50%",
    transform: "translateX(-50%)",
    background: "#fff",
    boxShadow: "0 5px 10px 0 #ddd",
    padding: 10,
    borderRadius: 8,
    zIndex: 5,
  },
  edittooltip: {
    position: "relative",
  },
  tooltipInputContainer: {
    display: "flex",
    width: 300,
    height: 30,
    overflow: "hidden",

    border: "1px solid #E8E8F2",
    backgroundColor: "#FBFBFD",
    ":focus": {
      borderColor: "#D2D2E6",
    },

    fontWeight: "400",
    borderRadius: 2,
    color: "#232038",
  },
  submitTooltipButton: {
    background: colors.BLUE(1),
    //borderRadius: "0 8px 8px 0",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    cursor: "pointer",
    width: 20,
    ":hover": {
      background: "#3E43E8",
    },
  },
});
