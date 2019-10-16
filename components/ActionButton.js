import { StyleSheet, css } from "aphrodite";

// Config
import colors from "~/config/themes/colors";

const ActionButton = (props) => {
  let { icon, iconNode, action } = props;

  function renderIcon() {
    if (icon) {
      return <i className={icon} />;
    } else if (iconNode) {
      return iconNode;
    }
  }

  return (
    <div className={css(styles.actionButton)} onClick={action}>
      {renderIcon()}
    </div>
  );
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
  },
});

export default ActionButton;
