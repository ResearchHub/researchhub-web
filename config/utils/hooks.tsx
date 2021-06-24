import { useEffect } from "react";

export function useRequireLogin(auth: any, router: any, redirect: string) {
  useEffect(() => {
    if (auth.authChecked && !auth.isLoggedIn) {
      router.push(redirect);
    }
  }, [auth.authChecked, auth.isLoggedIn]);
}
