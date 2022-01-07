import { css, StyleSheet } from "aphrodite";
import { ReactElement } from "react";

export default function EditorsDashboard(): ReactElement<"div"> {
  return (
    <div className={css(styles.editorsDashboard)}>
      {"Editor Dashboard - Killswitched on Prod, won't be visible"}
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
