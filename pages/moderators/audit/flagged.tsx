import { getCurrentUser } from "~/config/utils/getCurrentUser";
import { ReactElement } from "react";
import ContentPage from "~/components/ContentPage/ContentPage";
import FlaggedContentDashboard from "~/components/AuditContent/FlaggedContentDashboard";
import ModeratorDashboardSidebar from "~/components/shared/ModeratorDashboardSidebar";
import SideColumn from "~/components/Home/SideColumn";

export default function FlaggedContentPage(): ReactElement<
  typeof ContentPage
> | null {
  const currentUser = getCurrentUser();
  const isUserHubEditor = currentUser.author_profile?.is_hub_editor;

  if (!isUserHubEditor) {
    return null;
  }

  return (
    <ContentPage
      mainFeed={<FlaggedContentDashboard />}
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
