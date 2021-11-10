import { connect, useStore } from "react-redux";
import { ReactElement } from "react";
import AuthorClaimCaseDashboard from "~/components/AuthorClaimCaseDashboard/AuthorClaimCaseDashboard";
import { useEffectCheckCredentials } from "~/components/Moderator/useEffectCheckCredentials";

export default function AuthorClaimCaseDashboardIndex(): ReactElement<
  typeof AuthorClaimCaseDashboard
> | null {
  const reduxStore = useStore();
  const shouldRenderUI = useEffectCheckCredentials(reduxStore);
  if (!shouldRenderUI) {
    return null;
  }
  return <AuthorClaimCaseDashboard />;
}
