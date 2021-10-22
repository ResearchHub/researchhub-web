import { useStore } from "react-redux";
import { ReactElement } from "react";
import PermissionsDashboard from "~/components/PermissionsDashboard/PermissionsDashboard";
import { useEffectCheckCredentials } from "~/components/Moderator/useEffectCheckCredentials";

export default function PermissionsDashboardIndex(): ReactElement<
  typeof PermissionsDashboard
> | null {
  const reduxStore = useStore();
  const shouldRenderUI = useEffectCheckCredentials(reduxStore);
  if (!shouldRenderUI) {
    return null;
  }
  return <PermissionsDashboard />;
}
