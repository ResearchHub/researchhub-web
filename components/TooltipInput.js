import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { faArrowRight } from "@fortawesome/pro-solid-svg-icons";
import { Component } from "react";
import { StyleSheet, css } from "aphrodite";

// Config
import colors from "~/config/themes/colors";

export class TooltipInput extends Component {
  detectEnter = (e) => {
    let keycode = e.keyCode ? e.keyCode : e.which;
    if (keycode == "13") {
      this.props.save && this.props.save();
    }
  };

  /**
   * Alert if clicked on outside of element
   */
  handleClickOutside = (event) => {
    if (this.container && !this.container.contains(event.target)) {
      this.props.close && this.props.close();
    }
  };

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  render() {
    let { title, value, onChange, save, classContainer, close } = this.props;
    return (
      <div
        ref={(ref) => (this.container = ref)}
        className={css(styles.tooltipEditContainer, classContainer)}
      >
        <div className={css(styles.tooltipTitle)}>{title}</div>
        <div className={css(styles.tooltipInputContainer)}>
          <input
            className={css(styles.tooltipInput)}
            value={value}
            onChange={(e) => onChange(e)}
            onKeyPress={this.detectEnter}
            autoFocus={true}
          />
          <div className={css(styles.submitTooltipButton)} onClick={save}>
            {<FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon>}
          </div>
        </div>
        <span className={css(styles.close)} onClick={close}>
          {<FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>}
        </span>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  tooltipTitle: {
    textTransform: "capitalize",
    fontSize: 18,
    marginBottom: 5,
  },
  tooltipInput: {
    background: colors.WHITE(),
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
    background: colors.WHITE(),
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

    border: `1px solid ${colors.LIGHT_GREYISH_BLUE}`,
    backgroundColor: colors.ICY_GREY,
    ":focus": {
      borderColor: colors.LIGHT_GRAYISH_BLUE6(),
    },

    fontWeight: "400",
    borderRadius: 2,
    color: colors.DARK_DESATURATED_BLUE(),
  },
  submitTooltipButton: {
    background: colors.BLUE(1),
    //borderRadius: "0 8px 8px 0",
    color: colors.WHITE(),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    cursor: "pointer",
    width: 20,
    ":hover": {
      background: colors.BRIGHT_BLUE2(),
    },
  },
  close: {
    position: "absolute",
    top: 10,
    right: 10,
    fontSize: 16,
    cursor: "pointer",
  },
});
