import { HubSuggestion, SuggestedUser, Suggestion } from "./types";

export const buildPageUrlFromSuggestion = (suggestion: Suggestion) => {
  switch (suggestion.suggestionType) {
    case "paper":
      return `/paper/${suggestion.data.id}`;
    case "post":
      return `/post/${suggestion.data.id}`;
    case "user":
      const userSuggestion = suggestion.data as SuggestedUser;
      return `/user/${userSuggestion.authorProfile.id}/overview`;
    case "hub":
      const hubSuggestion = suggestion.data as HubSuggestion;
      return `/hubs/${hubSuggestion.hub.slug}`;
    case "question":
      return `/question/${suggestion.data.id}`;
  }
};
