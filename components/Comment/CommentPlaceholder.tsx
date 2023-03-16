import { StyleSheet, css } from "aphrodite";
import { RectShape, RoundShape } from "react-placeholder/lib/placeholders";
import colors from "./lib/colors";

const CommentPlaceholder = () => {
  return (
    <div className={css(styles.wrapper) + " show-loading-animation"}>
      <div className={css(styles.header)}>
        <RoundShape className={css(styles.avatar)} color={colors.placeholder} />
        <div className={css(styles.detailsWrapper)}>
          <RectShape
            color={colors.placeholder}
            style={{ width: "80%", height: "1em" }}
          />
          <RectShape
            color={colors.placeholder}
            style={{ width: "70%", height: "1em" }}
          />
        </div>
      </div>
      <div className={css(styles.body)}>
        <RectShape
          color={colors.placeholder}
          style={{ width: "100%", height: "1em" }}
        />
        <RectShape
          color={colors.placeholder}
          style={{ width: "90%", height: "1em" }}
        />
        <RectShape
          color={colors.placeholder}
          style={{ width: "80%", height: "1em" }}
        />
        <RectShape
          color={colors.placeholder}
          style={{ width: "70%", height: "1em" }}
        />                        
      </div>
    </div>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%"
  },
  header: {
    display: "flex",
  },
  avatar: {
    height: 26,
    width: 26,
  },
  detailsWrapper: {
    marginLeft: 8,
    display: "flex",
    flexDirection: "column",
    rowGap: 6,
    fontSize: 9,
    width: "100%",
  },
  body: {
    marginTop: 16,
    fontSize: 15,
    display: "flex",
    flexDirection: "column",
    rowGap: 8,
  }
});

export default CommentPlaceholder