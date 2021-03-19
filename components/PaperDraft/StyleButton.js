import { formatBlockStyleToggle } from "../PaperDraftInlineComment/util/PaperDraftInlineCommentUtil";
import { StyleSheet, css } from "aphrodite";
import React, { useMemo } from "react";
import { draftCssToCustomCss } from "./util/PaperDraftTextEditorUtil";

const StyleButton = (props) => {
  const { style, label, onClick, selectionBlockTypes = new Set() } = props;
  const onToggle = (event) => {
    event.stopPropagation();
    const newSlectionBlockTypes = formatBlockStyleToggle({
      selectionBlockTypes,
      toggledStyle: style,
    });
    onClick(Array.from(newSlectionBlockTypes).join(" "));
  };
  const isStyleActive = useMemo(
    () =>
      selectionBlockTypes.has(style) ||
      selectionBlockTypes.has(draftCssToCustomCss[style] ?? ""),
    [selectionBlockTypes, style]
  );
  return (
    <span
      className={css([styles.button, isStyleActive && styles.active])}
      onClick={onToggle}
    >
      {label}
    </span>
  );
};

const styles = StyleSheet.create({
  button: {
    color: "#999",
    cursor: "pointer",
    marginRight: 16,
    padding: "2px 0",
    display: "inline-block",
  },
  active: {
    color: "#5890ff",
  },
});

export default StyleButton;
