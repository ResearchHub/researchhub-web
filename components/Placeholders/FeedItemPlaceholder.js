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
      <div className={css(styles.avatarWrapper)}>
        <RoundShape className={css(styles.round)} color={color} />
      </div>
      <div className={css(styles.contentWrapper)}>
        <div className={css(styles.summaryContainer)}>
          <RectShape
            className={css(styles.textRow)}
            color={color}
            style={{ width: "100%", height: "1em" }}
          />
        </div>
        <PaperPlaceholder color={color} />
      </div>
    </div>
  ));
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
    display: "flex",
    alignItems: "flex-start",
    width: "100%",
  },
  avatarWrapper: {
    marginTop: -5,
  },
  contentWrapper: {
    width: "calc(100% - 50px)",
    marginLeft: 15,
  },

  summaryContainer: {
    borderRadius: 3,
    display: "flex",
    width: "50%",
  },
  round: {
    height: 35,
    width: 35,
    minWidth: 35,
  },
  textRow: {
    marginTop: 5,
    marginLeft: 10,
    ":first-child": {
      marginLeft: 0,
    },
  },
});

export default FeedItemPlaceholder;
