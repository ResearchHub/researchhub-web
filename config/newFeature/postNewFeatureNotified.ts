import { Helpers } from "@quantfive/js-web-config";
import { useEffect, useState } from "react";
import api from "~/config/api";
import newFeature from "./newFeature";

type PostNewFeatureNotifiedArgs = {
  auth?: any;
  featureName: string;
};

export function postNewFeatureNotifiedToUser({
  auth,
  featureName,
}: PostNewFeatureNotifiedArgs): void {
  if (auth?.isLoggedIn ?? false) {
    const params = {
      user: auth.user.id,
      feature: featureName.toLocaleLowerCase(),
    };
    fetch(api.NEW_FEATURE({}), api.POST_CONFIG(params))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON);
  } else {
    window.localStorage.setItem(
      `feature_${featureName.toLocaleLowerCase()}_clicked`,
      "true"
    );
  }
}
