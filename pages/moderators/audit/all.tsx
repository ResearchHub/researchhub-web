import { ReactElement } from "react";
import { AuditContentDashboard } from "~/components/AuditContent/AuditContentDashboard";
import ContentPage from "~/components/ContentPage/ContentPage";
import SideColumn from "~/components/Home/SideColumn";
import ModeratorDashboardSidebar from "~/components/shared/ModeratorDashboardSidebar";

export default function AuditContentPage(): ReactElement<
  typeof ContentPage
> | null {

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
