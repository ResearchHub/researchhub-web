import { getCurrentUser } from "~/config/utils/getCurrentUser";
import { ReactElement } from "react";
import ContentPage from "~/components/ContentPage/ContentPage";
import ModeratorDashboardSidebar from "~/components/shared/ModeratorDashboardSidebar";
import SideColumn from "~/components/Home/SideColumn";
import ActivityFeed from "~/components/ActivityFeed/ActivityFeed";


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
      mainFeed={<ActivityFeed />}
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
