import { StyleSheet, css } from "aphrodite";
import { RectShape, RoundShape } from "react-placeholder/lib/placeholders";
import colors from "~/config/themes/colors";
import PaperPlaceholder from "./PaperPlaceholder";

const FeedItemPlaceholder = ({ color = "#EFEFEF", rows = 1 }) => {
  return Array.from({ length: rows }).map((k, i) => (
    <div
      className={css(styles.container)}
      key={`activity-summary-placholder-${i}`}
    >
      <div className={css(styles.summaryContainer)}>
        <RoundShape className={css(styles.round)} color={color} />
        <RectShape
          className={css(styles.textRow)}
          color={color}
          style={{ width: "100%", height: "1em" }}
        />
      </div>
      <PaperPlaceholder color={color} />
    </div>
  ));
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  summaryContainer: {
    borderRadius: 3,
    display: "flex",
    width: "50%",
    marginLeft: -50,
  },
  round: {
    height: 40,
    width: 40,
    minWidth: 40,
  },
  textRow: {
    marginTop: 12,
    marginLeft: 10,
  },
});

export default FeedItemPlaceholder;
