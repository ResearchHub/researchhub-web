import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

const VENDOR_AMPLITUDE = "amp";

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
    console.warn("Exception while tracking event", err);
  }
};

const trackAmplitudeEvent = ({
  eventType,
  data,
  user = null,
  interactionType = null,
}) => {
  data = interactionType ? { ...data, interactionType } : data;

  const payload = {
    event_type: eventType,
    user_id: user ? user.id : null,
    time: +new Date(),
    event_properties: data,
  };

  fetch(API.AMP_ANALYTICS, API.POST_CONFIG(payload))
    .then(Helpers.checkStatus)
    .then((res) => res)
    .catch((err) => err);
};
