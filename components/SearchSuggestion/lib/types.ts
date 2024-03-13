import { parsePaperAuthors } from "~/components/Document/lib/types";
import { Hub, parseHub } from "~/config/types/hub";
import {
  AuthorProfile,
  ID,
  parseAuthorProfile,
} from "~/config/types/root_types";

export type SuggestedUser = {
  firstName: string;
  lastName: string;
  id: ID;
  reputation: number;
  authorProfile: AuthorProfile;
};

export type HubSuggestion = {
  id: ID;
  hub: Hub;
  name: string;
  label: string;
  value: ID;
};

export type PaperSuggestion = {
  id: ID;
  title: string;
  authors: AuthorProfile[];
};

export type PostSuggestion = {
  id: ID;
  title: string;
  authors: AuthorProfile[];
};

export type Suggestion = {
  suggestionType: "hub" | "user" | "paper" | "post";
  data: HubSuggestion | SuggestedUser | PaperSuggestion | PostSuggestion;
};

export const parsePaperSuggestion = (raw: any): PaperSuggestion => {
  return {
    id: raw.id,
    title: raw.title,
    authors: parsePaperAuthors(raw),
  }
}

export const parsePostSuggestion = (raw: any): PostSuggestion => {
  return {
    id: raw.id,
    title: raw.title,
    authors: (raw.authors || []).map((a: any) => parseAuthorProfile(a))
  }
}

export const parseSuggestion = (raw: any): Suggestion => {

  if (raw._index === "paper") {
    return {
      suggestionType: "paper",
      data: parsePaperSuggestion(raw._source),
    };
  }
  else if (raw._index === "post") {
    return {
      suggestionType: "post",
      data: parsePostSuggestion(raw._source),
    };
  }
  else if (raw._index === "user") {
    return {
      suggestionType: "user",
      data: parseUserSuggestion(raw._source),
    };
  }  

  throw new Error(`Invalid suggestion type. Type was ${raw._index}`);
};

export const parseUserSuggestion = (raw: any): SuggestedUser => {
  return {
    firstName: raw.first_name,
    lastName: raw.last_name,
    id: raw.id,
    reputation: raw.reputation || 0,
    authorProfile: parseAuthorProfile(raw.author_profile),
  };
};

export const parseHubSuggestion = (raw: any): HubSuggestion => {
  const hub = parseHub(raw);
  return {
    hub,
    name: raw.name,
    id: raw.id,
    label: raw.name,
    value: raw.id,
  };
};
