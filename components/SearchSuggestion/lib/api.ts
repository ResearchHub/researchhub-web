import API from "~/config/api";
import {
  SuggestedUser,
  HubSuggestion,
  parseUserSuggestion,
  parseHubSuggestion,
} from "./types";

export const fetchHubSuggestions = (
  query: string
): Promise<HubSuggestion[]> => {
  const url = `${API.BASE_URL}search/hubs/suggest/?name_suggest__completion=${query}`;

  const hubSuggestions: HubSuggestion[] = [];
  return fetch(url, API.GET_CONFIG())
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("HTTP-Error: " + response.status);
      }
    })
    .then((data) => {
      const suggestions = data.name_suggest__completion;
      suggestions.forEach((suggestion) => {
        suggestion.options.forEach((option) => {
          const parsed = parseHubSuggestion(option._source);
          hubSuggestions.push(parsed);
        });
      });

      return hubSuggestions;
    })
    .catch((error) => {
      console.error("Request Failed:", error);
      return [];
    });
};

export const fetchUserSuggestions = (
  query: string
): Promise<SuggestedUser[]> => {
  const url = `${API.BASE_URL}search/user/suggest/?full_name_suggest__completion=${query}`;

  const suggestedUsers: SuggestedUser[] = [];
  return fetch(url, API.GET_CONFIG())
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        // TODO: Unexpected error. log to sentry
        throw new Error("HTTP-Error: " + response.status);
      }
    })
    .then((data) => {
      const suggestions = data.full_name_suggest__completion;
      suggestions.forEach((suggestion) => {
        suggestion.options.forEach((option) => {
          const hasAuthorProfile = option._source.author_profile;
          if (hasAuthorProfile) {
            suggestedUsers.push(parseUserSuggestion(option._source));
          }
        });
      });

      return suggestedUsers;
    })
    .catch((error) => {
      console.error("Request Failed:", error);
      return [];
    });
};
