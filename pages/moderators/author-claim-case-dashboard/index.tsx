import { connect, useStore } from "react-redux";
import { ReactElement } from "react";
import { useEffectCheckCredentials } from "../useEffectCheckCredentials";
import AuthorClaimCaseDashboard from "~/components/AuthorClaimCaseDashboard/AuthorClaimCaseDashboard";

export default function AuthorClaimCaseDashboardIndex(): ReactElement<
  typeof AuthorClaimCaseDashboard
> | null {
  const reduxStore = useStore();
  const shouldRenderUI = useEffectCheckCredentials(reduxStore);
  // debugger;
  if (!shouldRenderUI) {
    return null;
  }
  return <AuthorClaimCaseDashboard />;
}
