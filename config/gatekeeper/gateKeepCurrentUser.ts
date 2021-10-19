import { isNullOrUndefined } from "~/config/utils/nullchecks";
import { useEffect } from "react";
import { useRouter } from "next/router";
import gatekeeper from "./gatekeeper";

export default function gateKeepCurrentUser({
  application,
  auth = null,
  shouldRedirect = true,
}: {
  application: string;
  auth?: any /* most likely from redux */;
  shouldRedirect?: boolean;
}): boolean {
  const router = useRouter();
  const { user } = auth ?? {};
  const isReadyToCheck =
    !isNullOrUndefined(auth) && !isNullOrUndefined(user?.id);
  const isLoggedIn = Boolean(auth?.isLoggedIn);
  const isInGatekeeper = gatekeeper(application, user?.email) ?? false;

  useEffect(() => {
    /*  Sending back inappropriate users to home page
        Note redux propagates in the clientside; hense boolean checks need to be done like this */
    if (shouldRedirect && isReadyToCheck && (!isInGatekeeper || !isLoggedIn)) {
      router.push("/");
    }
  }, [isInGatekeeper, isLoggedIn, isReadyToCheck]);

  return isInGatekeeper;
}
