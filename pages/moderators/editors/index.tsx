import { ReactElement } from "react";
import { useEffectCheckCredentials } from "~/components/Moderator/useEffectCheckCredentials";
import { useStore } from "react-redux";
import EditorsDashboard from "~/components/EditorsDashboard/EditorsDashboard";
import ContentPage from "~/components/ContentPage/ContentPage";
import ModeratorDashboardSidebar from "~/components/shared/ModeratorDashboardSidebar";
import SideColumn from "~/components/Home/SideColumn";
import killswitch from "~/config/killswitch/killswitch";

export default function EditorsDashboardIndex(): ReactElement<
  typeof EditorsDashboard
> | null {
  const reduxStore = useStore();
  const shouldRenderUI = useEffectCheckCredentials(reduxStore);
  const ksCanUseEditorDash = killswitch("editorDash");

  if (!shouldRenderUI || !ksCanUseEditorDash) {
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
