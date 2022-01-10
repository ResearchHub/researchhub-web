import { ReactElement } from "react";
import { useEffectCheckCredentials } from "~/components/Moderator/useEffectCheckCredentials";
import { useStore } from "react-redux";
import AuthorClaimCaseDashboard from "~/components/AuthorClaimCaseDashboard/AuthorClaimCaseDashboard";
import ContentPage from "~/components/ContentPage/ContentPage";
import ModeratorDashboardSidebar from "~/components/shared/ModeratorDashboardSidebar";
import SideColumn from "~/components/Home/SideColumn";
import { mainFeedStyles } from "~/pages/leaderboard/LeaderboardPage";
import { css } from "aphrodite";

export default function AuthorClaimCaseDashboardIndex(): ReactElement<
  typeof AuthorClaimCaseDashboard
> | null {
  const reduxStore = useStore();
  const shouldRenderUI = useEffectCheckCredentials(reduxStore);
  if (!shouldRenderUI) {
    return null;
  }

  return (
    <ContentPage
      mainFeed={
        <div className={css(mainFeedStyles.row)}>
          <AuthorClaimCaseDashboard />
        </div>
      }
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
