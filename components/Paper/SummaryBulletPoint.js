import { StyleSheet, css } from "aphrodite";
import Ripples from "react-ripples";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "~/config/themes/colors";

const SummaryBulletPoint = ({ data }) => {
  let { text, plain_text } = data;

  return (
    <Ripples className={css(styles.bulletpoint)}>
      <div className={css(styles.bulletpointIcon)}>
        <i class="far fa-chevron-down" />
      </div>
      <div className={css(styles.bulletpointText)}>
        {plain_text && plain_text}
      </div>
    </Ripples>
  );
};

const styles = StyleSheet.create({
  bulletpoint: {
    display: "flex",
    backgroundColor: "#F2F2F2",
    alignItems: "flex-start",
    boxSizing: "border-box",
    padding: 20,
  },
  bulletpointIcon: {
    color: colors.BLUE(),
    height: 30,
    minHeight: 30,
    maxHeight: 30,
    width: 30,
    minWidth: 30,
    maxWidth: 30,
    borderRadius: "50%",
    boxSizing: "border-box",
    paddingTop: 3,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    border: `2px solid ${colors.BLUE()}`,
  },
  bulletpointText: {
    color: "#241F3A",
    fontWeight: 500,
    fontSize: 15,
  },
});

export default SummaryBulletPoint;
