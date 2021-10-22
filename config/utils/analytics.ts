import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { AuthStore } from "../types/root_types";

type Event =
  | {
      eventType: "click";
      data: string;
    }
  | {
      eventType: "search_query_submitted";
      data: {
        query: string;
      };
    }
  | {
      eventType: "search_results_viewed";
      data: {
        searchType: string;
        query: string;
      };
    }
  | {
      eventType: "search_no_results";
      data: {
        searchType: string;
        query: string;
      };
    };

type EventData = Event & {
  user: AuthStore["user"] | null;
  vendor: "amp" | "google";
  interactionType?: null;
};

export const trackEvent = ({
  eventType,
  data,
  vendor,
  user = null,
  interactionType = null,
}: EventData): void => {
  try {
    switch (vendor) {
      case "amp":
        return trackAmplitudeEvent({ eventType, data, user, interactionType });
      // case "google":
      //   return trackAmplitudeEvent();
      default:
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
}: Omit<EventData, "vendor">): void => {
  if (interactionType) {
    (data as any).interaction = interactionType;
  }

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
