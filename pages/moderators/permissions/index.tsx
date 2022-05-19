import { ReactElement } from "react";
import { useEffectCheckModCredentials } from "~/components/Moderator/useEffectCheckModCredentials";
import { useStore } from "react-redux";
import PermissionsDashboard from "~/components/PermissionsDashboard/PermissionsDashboard";
import ContentPage from "~/components/ContentPage/ContentPage";
import SideColumn from "~/components/Home/SideColumn";
import ModeratorDashboardSidebar from "~/components/shared/ModeratorDashboardSidebar";

export default function PermissionsDashboardIndex(): ReactElement<
  typeof PermissionsDashboard
> | null {
  const shouldRenderUI = useEffectCheckModCredentials();

  if (!shouldRenderUI) {
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
