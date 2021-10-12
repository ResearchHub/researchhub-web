import { StyleSheet, css } from "aphrodite";
import {
  RectShape,
  TextBlock,
  TextRow,
} from "react-placeholder/lib/placeholders";
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";

const NoteEntryPlaceholder = ({ color, rows = 5 }) => {
  const html = [];

  for (let i = 0; i < rows; i++) {
    html.push(
      <div
        className={css(styles.placeholderContainer) + " show-loading-animation"}
      >
        <div className={css(styles.noteIcon)}>{icons.paper}</div>
        <RectShape
          className={css(styles.textRow)}
          color={color}
          style={{ width: "100%", height: 20 }}
        />
      </div>
    );
  }

  return html;
};

const styles = StyleSheet.create({
  placeholderContainer: {
    borderRadius: 3,
    padding: "10px 20px 10px 20px",
    display: "flex"
  },
  noteIcon: {
    color: colors.GREY(),
    marginRight: 10,
  },
  textRow: {
    marginBottom: 0,
  },
  space: {},
  label: {},
});

export default NoteEntryPlaceholder;
