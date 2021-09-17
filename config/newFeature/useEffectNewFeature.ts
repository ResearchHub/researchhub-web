import { Helpers } from "@quantfive/js-web-config";
import { useEffect, useState } from "react";
import api from "~/config/api";
import newFeature from "./newFeature";

type UseEffectNewFeatureArgs = {
  auth?: any;
  featureName: string;
};

export function useEffectNewFeatureShouldAlertUser({
  auth,
  featureName,
}: UseEffectNewFeatureArgs): [shouldAlert: boolean, setShouldAlert: Function] {
  const shouldCheckNewFeature = newFeature(featureName.toLocaleLowerCase());
  const [shouldAlert, setShouldAlert] = useState<boolean>(false);
  useEffect((): void => {
    if (shouldCheckNewFeature) {
      if (auth?.isLoggedIn ?? false) {
        fetch(
          api.NEW_FEATURE({
            route: "clicked",
            feature: featureName.toLocaleLowerCase(),
          }),
          api.GET_CONFIG()
        )
          .then(Helpers.checkStatus)
          .then(Helpers.parseJSON)
          .then((res: any): void => setShouldAlert(!res?.clicked ?? true))
          .catch((error: Error): void => setShouldAlert(true));
      } else {
        setShouldAlert(
          window?.localStorage?.getItem(
            `feature_${featureName.toLocaleLowerCase()}_clicked`
          ) === "true" ?? true
        );
      }
    }
  }, [auth, auth?.isLoggedIn]);
  return [shouldAlert, setShouldAlert];
}
