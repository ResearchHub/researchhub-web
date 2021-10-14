import { connect, useStore } from "react-redux";
import { ReactElement } from "react";
import { useEffectCheckCredentials } from "../useEffectCheckCredentials";
import AuthorClaimCaseDashboard from "~/components/AuthorClaimCaseDashboard/AuthorClaimCaseDashboard";

function PermissionsDashboardIndex(): ReactElement<
  typeof PermissionsDashboard
> | null {
  const reduxStore = useStore();
  const shouldRenderUI = useEffectCheckCredentials(reduxStore);
  if (!shouldRenderUI) {
    return null;
  }
  return <PermissionsDashboard />;
}
