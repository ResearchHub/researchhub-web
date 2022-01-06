import { css, StyleSheet } from "aphrodite";
import { ReactElement } from "react";
import { formColors } from "~/config/themes/colors";

export default function EditorsDashboard(): ReactElement<"div"> {
  return (
    <div className={css(styles.editorsDashboard)}>
      {"THIS IS EDITORS DASHBOARD"}
    </div>
  );
}

const styles = StyleSheet.create({
  editorsDashboard: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflow: "auto",
    width: "100%",
  },
});
