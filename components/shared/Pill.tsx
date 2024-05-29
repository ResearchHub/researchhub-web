import { css, StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";

const Pill = ({ text }: { text: string }) => {
  return (
    <div className={css(styles.rootWrapper)}>
      {text}
    </div>
  )
}

const styles = StyleSheet.create({
  rootWrapper: {
    background: colors.LIGHT_BLUE2(),
    color: colors.NEW_BLUE(),
    borderRadius: 4,
    fontSize: 13,
    padding: "3px 6px 3px 6px",
  }
});

export default Pill;