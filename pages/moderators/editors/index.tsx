import { ReactElement } from "react";
import { useEffectCheckModCredentials } from "~/components/Moderator/useEffectCheckModCredentials";
import { useStore } from "react-redux";
import EditorsDashboard from "~/components/EditorsDashboard/EditorsDashboard";
import ContentPage from "~/components/ContentPage/ContentPage";
import ModeratorDashboardSidebar from "~/components/shared/ModeratorDashboardSidebar";
import SideColumn from "~/components/Home/SideColumn";
import killswitch from "~/config/killswitch/killswitch";

export default function EditorsDashboardIndex(): ReactElement<
  typeof EditorsDashboard
> | null {
  const shouldRenderUI = useEffectCheckModCredentials();

  if (!shouldRenderUI) {
    return null;
  }

  return (
    <ContentPage
      mainFeed={<EditorsDashboard />}
      sidebar={
        <SideColumn
          listItems={<ModeratorDashboardSidebar />}
          title={"Admin"}
          ready={true}
        />
      }
    />
  );
}
