import { connect, useStore } from "react-redux";
import { ReactElement } from "react";
import AuthorClaimCaseDashboard from "~/components/AuthorClaimCaseDashboard/AuthorClaimCaseDashboard";
import { useEffectCheckCredentials } from "~/components/Moderator/useEffectCheckCredentials";

function AuthorClaimCaseDashboardIndex(): ReactElement<
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

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(AuthorClaimCaseDashboardIndex);
