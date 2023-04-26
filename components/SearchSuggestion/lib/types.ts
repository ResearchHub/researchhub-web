import { AuthorProfile, ID, parseAuthorProfile } from "~/config/types/root_types";

export type SuggestedUser = {
  firstName: string;
  lastName: string;
  id: ID;
  reputation: number;
  authorProfile: AuthorProfile
}

export const parseUserSuggestion = (raw: any): SuggestedUser => {
  return {
    firstName: raw.first_name,
    lastName: raw.last_name,
    id: raw.id,
    reputation: raw.reputation || 0,
    authorProfile: parseAuthorProfile(raw.author_profile),
  }
}