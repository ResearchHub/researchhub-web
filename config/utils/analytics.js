import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

export const VENDOR_AMPLITUDE = "amp";
export const VENDOR_GOOGLE = "google";

export const CLICK_INTERACTION = "click";

export const trackEvent = ({
  eventType,
  data,
  vendor,
  user = null,
  interactionType = null,
}) => {
  try {
    if (vendor === VENDOR_AMPLITUDE) {
      return trackAmplitudeEvent({ eventType, data, user, interactionType });
    } else if (vendor === VENDOR_GOOGLE) {
      return trackAmplitudeEvent();
    } else {
      console.warn("No vendor specified while tracking event");
    }
  } catch (err) {
    console.error("Exception while tracking event", err);
  }
};

const trackAmplitudeEvent = ({
  eventType,
  data,
  user = null,
  interactionType = null,
}) => {
  if (interactionType) {
    data.interaction = interactionType;
  }

  const payload = {
    event_type: eventType,
    user_id: user ? user.id : null,
    time: +new Date(),
    event_properties: data,
  };

  return fetch(API.AMP_ANALYTICS, API.POST_CONFIG(payload))
    .then(Helpers.checkStatus)
    .then((res) => res)
    .catch((err) => err);
};
