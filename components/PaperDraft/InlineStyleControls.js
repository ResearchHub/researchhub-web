import React from "react";
import { StyleSheet, css } from "aphrodite";

import StyleButton from "./StyleButton";

// Config
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

const INLINE_STYLES = [
  { label: "Bold", style: "BOLD" },
  { label: "Italic", style: "ITALIC" },
  { label: "Underline", style: "UNDERLINE" },
];

const InlineStyleControls = (props) => {
  const { editorState, onClick } = props;

  const currentStyle = editorState.getCurrentInlineStyle();

  return (
    <div className={css(styles.root)}>
      {INLINE_STYLES.map((type) => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          style={type.style}
          onClick={onClick}
        />
      ))}
    </div>
  );
};

const styles = StyleSheet.create({
  root: {
    fontFamily: "Helvetica",
    fontSize: 14,
    marginBottom: 5,
    userSelect: "none",
  },
});

export default InlineStyleControls;
