import { ReactElement } from "react";
import { useEffectCheckModCredentials } from "~/components/Moderator/useEffectCheckModCredentials";
import ContentPage from "~/components/ContentPage/ContentPage";
import gateKeepCurrentUser from "~/config/gatekeeper/gateKeepCurrentUser";
import ModeratorDashboardSidebar from "~/components/shared/ModeratorDashboardSidebar";
import PermissionsDashboard from "~/components/PermissionsDashboard/PermissionsDashboard";
import SideColumn from "~/components/Home/SideColumn";

export default function PermissionsDashboardIndex(): ReactElement<
  typeof PermissionsDashboard
> | null {
  const isAllowedAsMod = useEffectCheckModCredentials();
  const isAllowedAsPermissionEditor = gateKeepCurrentUser({
    application: "PERMISSIONS_DASH",
    shouldRedirect: true,
  });

  if (!isAllowedAsMod && !isAllowedAsPermissionEditor) {
    return null;
  }

  return (
    <ContentPage
      mainFeed={<PermissionsDashboard />}
      sidebar={
        <SideColumn
          listItems={<ModeratorDashboardSidebar />}
          ready={true}
          title={"Admin"}
        />
      }
    />
  );
}
