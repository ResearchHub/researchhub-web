import { Helpers } from "~/config/api/index";
import { useEffect, useState } from "react";
import api from "~/config/api";

type UseEffectNewFeatureArgs = {
  auth?: any;
  featureName: string;
};

type PostNewFeatureNotifiedArgs = {
  auth?: any;
  featureName: string;
};

	
type DissmissStatus = "unchecked" | "checked" | "checking"


export function useDismissableFeature({
  auth,
  featureName,
}: UseEffectNewFeatureArgs): {
  isDismissed: boolean,
  dismissFeature: Function,
  dismissStatus: DissmissStatus
} {
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [status, setStatus] = useState<DissmissStatus>("unchecked");
  const dismissFeature = () => {
    setIsDismissed(true);
    _dismissFeatureAPI({ auth, featureName })
  }
  useEffect((): void => {

    if (!auth.authChecked) {
      return;
    }
    else if (status === "checked" || status === "checking") {
      return;
    }

    if (auth?.isLoggedIn) {
      fetch(
        api.NEW_FEATURE({
          route: "clicked",
          feature: featureName.toLocaleLowerCase(),
        }),
        api.GET_CONFIG()
      )
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res: any): void => {
          setIsDismissed(res?.clicked ?? true);
        })
        .catch((error: Error): void => setIsDismissed(true))
        .finally(() => {
          setStatus("checked");
        })
    } else {
      const localStorageValue =
        window?.localStorage?.getItem(
          `feature_${featureName.toLocaleLowerCase()}_dismissed`
        ) ?? "false";
      setIsDismissed(localStorageValue === "true")
      setStatus("checked");
    }
  }, [auth, auth?.isLoggedIn]);

  return {
    isDismissed: isDismissed,
    dismissFeature,
    dismissStatus: status,
  };
}

function _dismissFeatureAPI({
  auth,
  featureName,
}: PostNewFeatureNotifiedArgs): void {
  if (auth?.isLoggedIn) {
    const params = {
      user: auth.user.id,
      feature: featureName.toLocaleLowerCase(),
    };
    fetch(api.NEW_FEATURE({}), api.POST_CONFIG(params))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON);
  } else {
    window.localStorage.setItem(
      `feature_${featureName.toLocaleLowerCase()}_dismissed`,
      "true"
    );
  }
}
