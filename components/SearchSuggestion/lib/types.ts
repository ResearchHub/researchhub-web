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
  name: string;
  description: string;
  slug: string;
  label: string;
  value: ID;
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
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    label: raw.name,
    value: raw.id,
    description: raw.description,
  };
};
