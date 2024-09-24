import sanitizeHtml from "sanitize-html";
import { SanitizedAndSafeHtml } from "~/config/types/root_types";

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
      return `/author/${userSuggestion.authorProfile.id}`;
    case "hub":
    case "journal":
      const hubSuggestion = suggestion.data as HubSuggestion;
      return `/hubs/${hubSuggestion.hub.slug}`;
    case "question":
      const questionSuggestion = suggestion.data as QuestionSuggestion;
      return `/question/${questionSuggestion.id}/${questionSuggestion.slug}`;
  }
};

export const highlightTextInSuggestion = (
  text: string,
  textToHighlight?: string,
  aphroditeCssClass: any = null
): SanitizedAndSafeHtml => {
  // First, let's sanitize the text to ensure it doesn't have any unsanctioned HTML to avoid an XSS hack.
  const _sanitizedText = sanitizeHtml(text, {
    allowedTags: [], // No tags are allowed, so all will be stripped
    allowedAttributes: {}, // No attributes are allowed
  });

  // Now we can add our own sanctioned HTML.
  if (textToHighlight) {
    const regExp = new RegExp(textToHighlight, "gi");

    return _sanitizedText.replace(
      regExp,
      (match) => `<span class=${aphroditeCssClass}>${match}</span>`
    );
  }

  return text;
};
