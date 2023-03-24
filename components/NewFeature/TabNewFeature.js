import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";

function TabNewFeature({ overrideStyles }) {
  return <div className={css(styles.newFeature, overrideStyles)}>New</div>;
}

const styles = StyleSheet.create({
  newFeature: {
    background: colors.RED(1),
    borderRadius: 4,
    fontSize: 12,
    padding: "2px 6px",
    color: "#fff",
    letterSpacing: 0.7,
  },
});

export default TabNewFeature;
