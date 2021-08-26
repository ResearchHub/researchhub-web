import { connect, useStore } from "react-redux";
import { isNullOrUndefined } from "../../../config/utils/nullchecks";
import { useRouter } from "next/router";
import AuthorClaimCaseDashboard from "../../../components/AuthorClaimCaseDashboard/AuthorClaimCaseDashboard";
import { ReactElement, useEffect } from "react";

function useEffectCheckCredentials(reduxStore: any): void {
  const auth = reduxStore.getState().auth;
  const user = !isNullOrUndefined(auth) ? auth.user : null;
  const isReadyToCheck =
    // need to check if id is present within "user" since it can be an empty object
    !isNullOrUndefined(auth) &&
    !isNullOrUndefined(user) &&
    !isNullOrUndefined(user.id);
  const isCurrUserMod = isReadyToCheck ? Boolean(user.moderator) : false;
  const isLoggedIn = Boolean(auth.isLoggedIn);
  const router = useRouter();
  useEffect(() => {
    if (isReadyToCheck && (!isCurrUserMod || !isLoggedIn)) {
      // sending back inappropriate user to home
      router.push("/");
    }
  }, [isCurrUserMod, isLoggedIn, isReadyToCheck]);
}

function AuthorClaimCaseDashboardIndex(): ReactElement<
  typeof AuthorClaimCaseDashboard
> {
  const reduxStore = useStore();
  useEffectCheckCredentials(reduxStore);
  return <AuthorClaimCaseDashboard />;
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(AuthorClaimCaseDashboardIndex);
