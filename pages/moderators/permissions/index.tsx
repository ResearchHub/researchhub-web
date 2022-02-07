import { ReactElement } from "react";
import { useEffectCheckCredentials } from "~/components/Moderator/useEffectCheckCredentials";
import { useStore } from "react-redux";
import PermissionsDashboard from "~/components/PermissionsDashboard/PermissionsDashboard";
import ContentPage from "~/components/ContentPage/ContentPage";
import SideColumn from "~/components/Home/SideColumn";
import ModeratorDashboardSidebar from "~/components/shared/ModeratorDashboardSidebar";

export default function PermissionsDashboardIndex(): ReactElement<
  typeof PermissionsDashboard
> | null {
  const reduxStore = useStore();
  const shouldRenderUI = useEffectCheckCredentials(reduxStore);

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
