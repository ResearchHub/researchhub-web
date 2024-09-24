import API from "~/config/api";
import {
  SuggestedUser,
  HubSuggestion,
  parseUserSuggestion,
  parseHubSuggestion,
  parseSuggestion,
  Suggestion,
  JournalSuggestion,
  parseJournalSuggestion,
} from "./types";
import { NullableString } from "~/config/types/root_types";

export const fetchAllSuggestions = (
  query: NullableString
): Promise<Suggestion[]> => {
  const url = `${API.BASE_URL}search/combined-suggest/?query=${query}`;

  return fetch(url, API.GET_CONFIG())
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("HTTP-Error: " + response.status);
      }
    })
    .then((rawSuggestions) => {
      return rawSuggestions
        .map((raw) => {
          try {
            return parseSuggestion(raw);
          } catch (err) {
            console.warn("Failed to parse suggestion: ", raw, "Error: ", err);
            return null;
          }
        })
        .filter((suggestion) => suggestion !== null);
    })
    .catch((error) => {
      console.error("Request Failed:", error);
      return [];
    });
};

export const fetchHubSuggestions = ({
  query,
  namespace,
}: {
  query: string;
  namespace?: "journal" | null;
}): Promise<HubSuggestion[]> => {
  const url = `${API.BASE_URL}search/${namespace === "journal" ? "journals" : "hubs"}/suggest/?name_suggest__completion=${query}`;

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

export const fetchJournalSuggestions = (
  query: string
): Promise<JournalSuggestion[]> => {
  const url = `${API.BASE_URL}search/journal/suggest/?name_suggest__completion=${query}`;

  const journalSuggestions: JournalSuggestion[] = [];
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
          const parsed = parseJournalSuggestion(option._source);
          journalSuggestions.push(parsed);
        });
      });

      return journalSuggestions;
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
