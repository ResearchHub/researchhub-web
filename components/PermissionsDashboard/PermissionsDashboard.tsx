import { css, StyleSheet } from "aphrodite";
import { ReactElement, useState } from "react";

export default function PermissionsDashboard(): ReactElement<"div"> {
  const [lastFetchTime, setLastFetchTime] = useState<number>(Date.now());
  return (
    <div className={css(styles.permissionsDashboard)}>{"Hello there!!!"}</div>
  );
}

const styles = StyleSheet.create({
  permissionsDashboard: {
    alignItems: "center",
    backgroundColor: "#FBFBFD",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflow: "auto",
    width: "100%",
  },
  caseContinaerWrap: {
    boxSizing: "border-box",
    marginTop: 16,
    width: "100%",
  },
});
