import { css, StyleSheet } from "aphrodite";
import { ReactElement, useState } from "react";
import gateKeepCurrentUser from "~/config/gatekeeper/gateKeepCurrentUser";

export default function PermissionsDashboard(): ReactElement<"div"> {
  const [_lastFetchTime, _setLastFetchTime] = useState<number>(Date.now());
  gateKeepCurrentUser("ELN");
  return <div className={css(styles.permissionsDashboard)} />;
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
