import API from "~/config/api";
import { SuggestedUser, parseUserSuggestion } from "./types";

export const fetchUserSuggestions = (
  query: string
): Promise<SuggestedUser[]> => {
  const url = `${API.BASE_URL}search/user/?search_multi_match=${query}`;

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
    .then((data: any) => {
      data.results.forEach((suggestion) => {
        const hasAuthorProfile = suggestion.author_profile;
        if (hasAuthorProfile) {
          suggestedUsers.push(parseUserSuggestion(suggestion));
        }
      });

      return suggestedUsers;
    })
    .catch((error) => {
      console.error("Request Failed:", error);
      return [];
    });
};
