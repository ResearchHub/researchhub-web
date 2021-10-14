import { connect, useStore } from "react-redux";
import { isNullOrUndefined } from "~/config/utils/nullchecks";
import { useEffect } from "react";
import { useRouter } from "next/router";
import gatekeeper from "./gatekeeper";

function gateKeepCurrentUser(application: string): null {
  const router = useRouter();
  const reduxStore = useStore();

  const auth = reduxStore.getState().auth ?? null;
  const { user } = auth ?? {};
  const isReadyToCheck =
    !isNullOrUndefined(auth) && !isNullOrUndefined(user?.id);
  const isLoggedIn = Boolean(auth?.isLoggedIn);
  const isInGatekeeper = gatekeeper(application, user?.email) ?? false;

  useEffect(() => {
    /*  sending back inappropriate user to home
        intentional boolean checks as below since redux propagates in the clientside */
    if (isReadyToCheck && (!isInGatekeeper || !isLoggedIn)) {
      router.push("/");
    }
  }, [isInGatekeeper, isLoggedIn, isReadyToCheck]);

  return null;
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(gateKeepCurrentUser);
