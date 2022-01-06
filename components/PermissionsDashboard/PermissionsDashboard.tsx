import { connect, useStore } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { ReactElement, useState } from "react";
import gateKeepCurrentUser from "~/config/gatekeeper/gateKeepCurrentUser";
import HubEditorCreateForm from "./Hub/HubEditorCreateForm";
import { formColors } from "~/config/themes/colors";

function PermissionsDashboard(): ReactElement<"div"> | null {
  const [_lastFetchTime, _setLastFetchTime] = useState<number>(Date.now());
  const reduxStore = useStore();
  const shouldRenderUI = gateKeepCurrentUser({
    application: "PERMISSIONS_DASH",
    auth: reduxStore?.getState()?.auth ?? null,
    shouldRedirect: true,
  });
  return shouldRenderUI ? (
    <div className={css(styles.permissionsDashboard)}>
      <HubEditorCreateForm />
    </div>
  ) : null;
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PermissionsDashboard);

const styles = StyleSheet.create({
  permissionsDashboard: {
    alignItems: "center",
    backgroundColor: formColors.INPUT,
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
