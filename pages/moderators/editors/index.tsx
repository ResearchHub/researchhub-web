import { ReactElement } from "react";
import { useEffectCheckCredentials } from "~/components/Moderator/useEffectCheckCredentials";
import { useStore } from "react-redux";
import EditorsDashboard from "~/components/EditorsDashboard/EditorsDashboard";
import ContentPage from "~/components/ContentPage/ContentPage";
import ModeratorDashboardSidebar from "~/components/shared/ModeratorDashboardSidebar";
import SideColumn from "~/components/Home/SideColumn";

export default function EditorsDashboardIndex(): ReactElement<
  typeof EditorsDashboard
> | null {
  const reduxStore = useStore();
  const shouldRenderUI = useEffectCheckCredentials(reduxStore);
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
