import { isNullOrUndefined } from "~/config/utils/nullchecks";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useStore } from "react-redux";
import gatekeeper from "./gatekeeper";

export default function gateKeepCurrentUser({
  application,
  shouldRedirect = true,
}: {
  application: string;
  shouldRedirect?: boolean;
}): boolean {
  const router = useRouter();
  const [gkResult, setGKResult] = useState<boolean | null>(null);
  const reduxState = useStore()?.getState();
  const auth = reduxState?.auth ?? null;
  const { user } = auth ?? {};
  const isLoggedIn = Boolean(auth?.isLoggedIn);
  const isReadyToCheck =
    !isNullOrUndefined(user?.id) && !isNullOrUndefined(gkResult);

  if (isLoggedIn && isNullOrUndefined(gkResult)) {
    gatekeeper(application, user?.email, setGKResult);
  }

  useEffect(() => {
    /*  Sending back inappropriate users to home page
        Note redux propagates in the clientside; hence boolean checks need to be done like this */
    if (shouldRedirect && isReadyToCheck && (!isLoggedIn || !gkResult)) {
      router.push("/");
    }
  }, [gkResult, isLoggedIn, isReadyToCheck]);

  return Boolean(gkResult);
}
