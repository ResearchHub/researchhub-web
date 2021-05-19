import { connect, useStore } from "react-redux";
import React, { useEffect, ReactElement } from "react";
import { useRouter } from "next/router";

import { isNullOrUndefined } from "../../../config/utils/nullchecks";

function useEffectCheckCredentials(reduxStore: any): void {
  const auth = reduxStore.getState().auth;
  const user = !isNullOrUndefined(auth) ? auth.user : null;
  const isReadyToCheck =
    // need to check if id is present within "user" since it can be an empty object
    !isNullOrUndefined(auth) &&
    !isNullOrUndefined(user) &&
    !isNullOrUndefined(user.id);
  const isCurrUserMod = isReadyToCheck ? Boolean(user.moderator) : false;
  const isLoggedIn = !Boolean(auth.isLoggedIn);
  const router = useRouter();
  useEffect(() => {
    if (isReadyToCheck && (!isCurrUserMod || !isLoggedIn)) {
      // sending back inappropriate user to home
      console.warn("push away!!!");
      router.push("/");
    }
  }, [isCurrUserMod, isLoggedIn, isReadyToCheck]);
}

function AuthorClaimCaseDashboard(): ReactElement<"div"> {
  const reduxStore = useStore();
  useEffectCheckCredentials(reduxStore);
  return <div>Hi this is author claim dashboard</div>;
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(AuthorClaimCaseDashboard);
