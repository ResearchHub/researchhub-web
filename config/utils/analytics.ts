import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { AuthStore } from "../types/root_types";
import { emptyFncWithMsg } from "./nullchecks";

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
  interactionType?: null | "click";
};

export const trackEvent = ({
  eventType,
  data,
  vendor,
  user = null,
  interactionType = null,
}: EventData): void => {
  try {
    emptyFncWithMsg;
    switch (vendor) {
      case "amp":
        return trackAmplitudeEvent({ eventType, data, user, interactionType });
      // doesn't seem to be used
      // case "google":
      //   return trackAmplitudeEvent();
      default:
        throw new Error(
          "No vendor or unhandled vendor specified while tracking event."
        );
    }
  } catch (err) {
    emptyFncWithMsg(err);
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
