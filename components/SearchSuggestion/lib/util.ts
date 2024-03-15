import {
  HubSuggestion,
  PaperSuggestion,
  PostSuggestion,
  QuestionSuggestion,
  SuggestedUser,
  Suggestion,
} from "./types";

export const buildPageUrlFromSuggestion = (suggestion: Suggestion) => {
  switch (suggestion.suggestionType) {
    case "paper":
      const paperSuggestion = suggestion.data as PaperSuggestion;
      return `/paper/${paperSuggestion.id}/${paperSuggestion.slug}`;
    case "post":
      const postSuggestion = suggestion.data as PostSuggestion;
      return `/post/${postSuggestion.id}/${postSuggestion.slug}`;
    case "user":
      const userSuggestion = suggestion.data as SuggestedUser;
      return `/user/${userSuggestion.authorProfile.id}/overview`;
    case "hub":
      const hubSuggestion = suggestion.data as HubSuggestion;
      return `/hubs/${hubSuggestion.hub.slug}`;
    case "question":
      const questionSuggestion = suggestion.data as QuestionSuggestion;
      return `/question/${questionSuggestion.id}/${questionSuggestion.slug}`;
  }
};
