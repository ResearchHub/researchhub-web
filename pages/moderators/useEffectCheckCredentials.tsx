import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { isNullOrUndefined } from "~/config/utils/nullchecks";

export function useEffectCheckCredentials(reduxStore: any): boolean {
  const [shouldRenderUI, setShouldRenderUI] = useState<boolean>(false);
  const auth = reduxStore.getState().auth ?? null;
  const router = useRouter();

  const { user } = auth ?? {};
  const isReadyToCheck =
    !isNullOrUndefined(auth) && !isNullOrUndefined(user?.id);
  const isLoggedIn = Boolean(auth?.isLoggedIn);
  const isCurrUserMod = isReadyToCheck ? Boolean(user.moderator) : false;

  useEffect(() => {
    /*  sending back inappropriate user to home
        intentional boolean checks as below since redux propagates in the clientside */
    if (isReadyToCheck && (!isCurrUserMod || !isLoggedIn)) {
      router.push("/");
    } else if (isCurrUserMod) {
      setShouldRenderUI(true);
    }
  }, [isCurrUserMod, isLoggedIn, isReadyToCheck, setShouldRenderUI]);

  return shouldRenderUI;
}
