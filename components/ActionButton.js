import { StyleSheet, css } from "aphrodite";

// Config
import colors from "~/config/themes/colors";

const ActionButton = (props) => {
  let { icon, action } = props;

  return (
    <div className={css(styles.actionButton)} onClick={action}>
      <i className={icon} />
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
  },
});

export default ActionButton;
