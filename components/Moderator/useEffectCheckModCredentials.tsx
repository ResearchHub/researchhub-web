import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useStore } from "react-redux";
import { isNullOrUndefined } from "~/config/utils/nullchecks";

export function useEffectCheckModCredentials({
  shouldRedirect = false,
}: {
  shouldRedirect: boolean;
}): boolean {
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const reduxState = useStore()?.getState();
  const auth = reduxState?.auth ?? null;
  const currentUser = auth?.user;
  const router = useRouter();
  const isReadyToCheck =
    !isNullOrUndefined(auth) && !isNullOrUndefined(currentUser?.id);
  const isLoggedIn = Boolean(auth?.isLoggedIn);
  const isCurrUserMod = isReadyToCheck ? Boolean(currentUser.moderator) : false;

  useEffect(() => {
    /*  Sending back inappropriate users to home page
        intentional boolean checks as below since redux propagates in the clientside */
    if (isReadyToCheck && (!isCurrUserMod || !isLoggedIn) && shouldRedirect) {
      router.push("/");
    } else if (isCurrUserMod) {
      setIsAllowed(true);
    }
  }, [isCurrUserMod, isLoggedIn, isReadyToCheck, setIsAllowed]);

  return isAllowed;
}
