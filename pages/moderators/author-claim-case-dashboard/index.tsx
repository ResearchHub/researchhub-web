import { css } from "aphrodite";
import { mainFeedStyles } from "~/pages/leaderboard/LeaderboardPage";
import { ReactElement, useEffect } from "react";
import { useEffectCheckModCredentials } from "~/components/Moderator/useEffectCheckModCredentials";
import { useStore } from "react-redux";
import AuthorClaimCaseDashboard from "~/components/AuthorClaimCaseDashboard/AuthorClaimCaseDashboard";
import ContentPage from "~/components/ContentPage/ContentPage";
import ModeratorDashboardSidebar from "~/components/shared/ModeratorDashboardSidebar";
import SideColumn from "~/components/Home/SideColumn";
import api, { generateApiUrl } from "~/config/api";

export default function AuthorClaimCaseDashboardIndex(): ReactElement<
  typeof AuthorClaimCaseDashboard
> | null {
  const shouldRenderUI = useEffectCheckModCredentials({ shouldRedirect: true });
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
