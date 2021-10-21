import { StyleSheet, css } from "aphrodite";
import { RectShape, RoundShape } from "react-placeholder/lib/placeholders";
import colors from "~/config/themes/colors";

const OrgEntryPlaceholder = ({ color, rows = 1 }) => {
  const html = [];

  for (let i = 0; i < rows; i++) {
    html.push(
      <div
        key={`org-entry-placholder-${i}`}
        className={css(styles.placeholderContainer) + " show-loading-animation"}
      >
        <RoundShape className={css(styles.round)} color={color} />
        <RectShape
          className={css(styles.textRow)}
          color={color}
          style={{ width: "100%", height: 17 }}
        />
      </div>
    );
  }

  return html;
};

const styles = StyleSheet.create({
  placeholderContainer: {
    borderRadius: 3,
    display: "flex",
    width: "100%",
  },
  round: {
    height: 30,
    width: 30,
    minWidth: 30,
  },
  textRow: {
    // marginBottom: 0,
    // marginRight: 0,
    marginTop: 7,
    marginLeft: 10,
  },
});

export default OrgEntryPlaceholder;
