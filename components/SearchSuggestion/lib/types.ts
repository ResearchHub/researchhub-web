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
