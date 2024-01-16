import { Helpers } from "@quantfive/js-web-config";
import API, { generateApiUrl } from "~/config/api";
import { captureEvent } from "~/config/utils/events";

export const setCompletedOnboardingApi = async (): Promise<void> => {
  try {
    const url = generateApiUrl("user/has_completed_onboarding");

    await fetch(url, API.PATCH_CONFIG({}, undefined)).then((res): any =>
      Helpers.parseJSON(res)
    );
  } catch (err) {
    captureEvent({
      msg: "Unable to set onboarding as completed",
    });

    throw Error(err as any);
  }
};
