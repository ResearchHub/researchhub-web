import { connect, useStore } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { ReactElement, useState } from "react";
import gateKeepCurrentUser from "~/config/gatekeeper/gateKeepCurrentUser";
import HubEditorCreateForm from "./Hub/HubEditorCreateForm";
import HubEditorDeleteForm from "./Hub/HubEditorDeleteForm";
import PermissionsDashboardNavbar, {
  FormTypes,
} from "./PermissionsDashboardNavbar";

function PermissionsDashboard(): ReactElement<"div"> | null {
  const reduxStore = useStore();
  const shouldRenderUI = gateKeepCurrentUser({
    application: "PERMISSIONS_DASH",
    auth: reduxStore?.getState()?.auth ?? null,
    shouldRedirect: true,
  });
  const [formType, setFormType] = useState<FormTypes>("add");

  return shouldRenderUI ? (
    <div className={css(styles.permissionsDashboard)}>
      <PermissionsDashboardNavbar
        currentFormType={formType}
        setFormType={setFormType}
      />
      {formType === "add" ? <HubEditorCreateForm /> : <HubEditorDeleteForm />}
    </div>
  ) : null;
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PermissionsDashboard);

const styles = StyleSheet.create({
  permissionsDashboard: {
    paddingLeft: 36,
    alignItems: "center",
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
