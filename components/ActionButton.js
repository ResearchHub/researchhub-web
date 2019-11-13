import { StyleSheet, css } from "aphrodite";
import Ripples from "react-ripples";
// Config
import colors from "~/config/themes/colors";

const ActionButton = (props) => {
  let { icon, iconNode, action, size, addRipples } = props;

  function renderIcon() {
    if (icon) {
      return (
        <span className={css(styles.icon)}>
          <i className={icon} />
        </span>
      );
    } else if (iconNode) {
      return iconNode;
    }
  }

  if (addRipples) {
    return (
      <Ripples className={css(styles.actionButton) + " " + props.className} onClick={action}>
        <div className={css(styles.actionButton) + " " + props.className}>{renderIcon()}</div>
      </Ripples>
    );
  } else {
    return (
      <div className={css(styles.actionButton) + " " + props.className} onClick={action}>
        {renderIcon()}
      </div>
    );
  }
};

const styles = StyleSheet.create({
  actionButton: {
    width: 46,
    height: 46,
    borderRadius: "100%",
    background: colors.LIGHT_GREY(1),
    color: colors.GREY(1),
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    marginLeft: 5,
    marginRight: 5,
    display: "flex",
    flexShrink: 0,
    "@media only screen and (max-width: 760px)": {
      width: 35,
      height: 35,
    },
    "@media only screen and (max-width: 415px)": {
      height: 33,
      width: 33,
    },
    "@media only screen and (max-width: 321px)": {
      height: 31,
      width: 31,
    },
  },
  icon: {
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 13,
    },
  },
});

export default ActionButton;
