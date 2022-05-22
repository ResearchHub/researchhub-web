import { getCurrentUser } from "~/config/utils/getCurrentUser";
import { ReactElement } from "react";
import AuditContentDashboard from "~/components/AuditContent/AuditContentDashboard";
import ContentPage from "~/components/ContentPage/ContentPage";
import ModeratorDashboardSidebar from "~/components/shared/ModeratorDashboardSidebar";
import SideColumn from "~/components/Home/SideColumn";

export default function AuditContentPage(): ReactElement<
  typeof ContentPage
> | null {
  const currentUser = getCurrentUser();
  const isUserModerator = Boolean(currentUser?.moderator);
  const isUserHubEditor = Boolean(currentUser?.author_profile?.is_hub_editor);  

  if (!(isUserHubEditor || isUserModerator)) {
    return null;
  }

  return (
    <ContentPage
      mainFeed={<AuditContentDashboard />}
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
