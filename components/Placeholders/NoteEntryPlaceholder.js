import { StyleSheet, css } from "aphrodite";
import {
  RectShape,
} from "react-placeholder/lib/placeholders";
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";

const NoteEntryPlaceholder = ({ color, rows = 2 }) => {
  const html = [];

  for (let i = 0; i < rows; i++) {
    html.push(
      <div
        key={`noteplacholder-${i}`}
        className={css(styles.placeholderContainer) + " show-loading-animation"}
      >
        <div className={css(styles.noteIcon)}>{icons.paper}</div>
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
    padding: 20,
    display: "flex",
    borderBottom: `1px solid ${colors.GREY(0.3)}`,
  },
  noteIcon: {
    color: colors.GREY(),
    marginRight: 10,
    fontSize: 14,
  },
  textRow: {
    marginBottom: 0,
    marginRight: 0,
  },
  space: {},
  label: {},
});

export default NoteEntryPlaceholder;
