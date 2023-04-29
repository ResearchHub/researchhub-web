import API from "~/config/api";
import { SuggestedUser, parseUserSuggestion } from "./types";

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
      suggestions.forEach(suggestion => {
        suggestion.options.forEach(option => {
          const hasAuthorProfile = option._source.author_profile;
          if (hasAuthorProfile) {
            suggestedUsers.push(parseUserSuggestion(option._source))
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
