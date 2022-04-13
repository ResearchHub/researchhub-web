import { ReactElement } from "react";
import PermissionsDashboard from "~/components/PeerReviews/PeerReviewRequestDashboard";
import ContentPage from "~/components/ContentPage/ContentPage";
import SideColumn from "~/components/Home/SideColumn";
import ModeratorDashboardSidebar from "~/components/shared/ModeratorDashboardSidebar";

export default function ReviewsIndex(): ReactElement<
  typeof PermissionsDashboard
> | null {

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
