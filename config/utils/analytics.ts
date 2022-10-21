import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { AuthStore, ID, User } from "../types/root_types";
import { emptyFncWithMsg } from "./nullchecks";

type Event =
  | {
      eventType: "click";
      data: string;
    }
  | {
      eventType: "search_query_submitted";
      vendor: string;
      user: User;
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
    }
  | {
      eventType: "create_bounty";
      data: any;
    };

type EventData = Event & {
  insertId?: ID;
  interactionType?: null | "click";
  user: AuthStore["user"] | null;
  vendor: "amp" | "google";
};

export const trackEvent = ({
  data,
  eventType,
  insertId = null,
  interactionType = null,
  user = null,
  vendor,
}: EventData): void => {
  try {
    emptyFncWithMsg;
    switch (vendor) {
      case "amp":
        return trackAmplitudeEvent({
          eventType,
          data,
          user,
          interactionType,
          insertId,
        });
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
  data,
  eventType,
  insertId = null,
  interactionType = null,
  user = null,
}: Omit<EventData, "vendor">): void => {
  if (interactionType) {
    (data as any).interaction = interactionType;
  }

  const payload: any = {
    event_type: eventType,
    user_id: user ? user.id : null,
    time: +new Date(),
    event_properties: data,
  };

  if (insertId) {
    payload.insertId = insertId;
  }

  fetch(API.AMP_ANALYTICS, API.POST_CONFIG(payload))
    .then(Helpers.checkStatus)
    .then((res) => res)
    .catch((err) => err);
};
