import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { isNullOrUndefined } from "~/config/utils/nullchecks";

export default function useEffectCheckCredentials(reduxStore: any): boolean {
  const [shouldRenderUI, setShouldRenderUI] = useState<boolean>(false);
  const auth = reduxStore.getState().auth ?? null;
  const router = useRouter();

  const { user } = auth ?? {};
  const isReadyToCheck =
    !isNullOrUndefined(auth) && !isNullOrUndefined(user?.id);
  const isLoggedIn = Boolean(auth?.isLoggedIn);
  const isCurrUserMod = isReadyToCheck ? Boolean(user.moderator) : false;

  useEffect(() => {
    /*  Sending back inappropriate users to home page
        intentional boolean checks as below since redux propagates in the clientside */
    if (isReadyToCheck && (!isCurrUserMod || !isLoggedIn)) {
      router.push("/");
    } else if (isCurrUserMod) {
      setShouldRenderUI(true);
    }
  }, [isCurrUserMod, isLoggedIn, isReadyToCheck, setShouldRenderUI]);

  return shouldRenderUI;
}
