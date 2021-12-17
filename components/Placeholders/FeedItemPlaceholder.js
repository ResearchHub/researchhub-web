import { StyleSheet, css } from "aphrodite";
import { RectShape, RoundShape } from "react-placeholder/lib/placeholders";
import colors from "~/config/themes/colors";
import PaperPlaceholder from "./PaperPlaceholder";
import { breakpoints } from "~/config/themes/screen";

const FeedItemPlaceholder = ({ color = "#EFEFEF", rows = 1 }) => {
  return Array.from({ length: rows }).map((k, i) => (
    <div
      className={css(styles.container) + " show-loading-animation"}
      key={`activity-summary-placholder-${i}`}
    >
      <div className={css(styles.avatarWrapper)}>
        <RoundShape className={css(styles.round)} color={color} />
      </div>
      <div className={css(styles.contentWrapper)}>
        <div className={css(styles.summaryContainer)}>
          <div className={css(styles.avatarWrapperSmall)}>
            <RoundShape className={css(styles.round)} color={color} />
          </div>
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
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
  },
  avatarWrapperSmall: {
    display: "none",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "block",
      marginRight: 15,
    },
  },
  contentWrapper: {
    width: "calc(100% - 50px)",
    marginLeft: 10,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: "calc(100% - 20px)",
    },
  },

  summaryContainer: {
    borderRadius: 3,
    display: "flex",
    width: "65%",
  },
  round: {
    height: 35,
    width: 35,
    minWidth: 35,
  },
  textRow: {
    marginTop: 5,
    marginLeft: 0,
    ":first-child": {
      marginLeft: 0,
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      marginTop: 10,
    },
  },
});

export default FeedItemPlaceholder;
