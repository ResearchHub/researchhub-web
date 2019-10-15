import { StyleSheet, css } from "aphrodite";

// Config
import colors from "~/config/themes/colors";
const HubLabel = (props) => {
  let { hub, onClick } = props;
  return (
    <div className={css(styles.hubTag)} onClick={onClick && onClick}>
      {hub.name.toUpperCase()}
    </div>
  );
};

const styles = StyleSheet.create({
  hubTag: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.BLUE(1),
    background: colors.BLUE(0.1),
    padding: 5,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
    height: 13,
    borderRadius: 4,
    cursor: "pointer",
  },
});

export default HubLabel;
