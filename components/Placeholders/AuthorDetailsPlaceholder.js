import { StyleSheet, css } from "aphrodite";
import { RectShape, RoundShape } from "react-placeholder/lib/placeholders";
import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";

const AuthorDetailsPlaceholder = ({ color = "#EFEFEF", rows = 1 }) => {
  return (
    <div className={css(styles.container) + " show-loading-animation"}>
      <div className={css(styles.avatarWrapper)}>
        <RoundShape className={css(styles.round)} color={color} />
      </div>
      <div className={css(styles.details)}>
        <RectShape
          className={css(styles.textRow)}
          color={color}
          style={{ width: "25%", height: "20px" }}
        />
        <RectShape className={css(styles.textRow)} color={color} />
        <RectShape className={css(styles.textRow)} color={color} />
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "flex-start",
    width: "100%",
    padding: "38px 0px",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      flexDirection: "column",
      padding: "40px 0px",
    },
  },
  details: {
    width: "100%",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      flexDirection: "column",
      display: "flex",
    },
  },
  textRow: {
    marginTop: 12,
    width: "35%",
    height: 20,
    marginLeft: 20,
    ":first-child": {
      marginTop: 20,
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      marginTop: 10,
      width: "55%",
      marginLeft: 0,
    },
  },
  round: {
    height: 115,
    width: 115,
    minWidth: 115,
  },
  avatarWrapper: {},
});

export default AuthorDetailsPlaceholder;
