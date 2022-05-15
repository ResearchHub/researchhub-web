import { ReactElement } from "react";
import FlaggedContentDashboard from "~/components/AuditContent/FlaggedContentDashboard";
import ContentPage from "~/components/ContentPage/ContentPage";
import SideColumn from "~/components/Home/SideColumn";
import ModeratorDashboardSidebar from "~/components/shared/ModeratorDashboardSidebar";

export default function FlaggedContentPage(): ReactElement<
  typeof ContentPage
> | null {

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
