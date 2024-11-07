import { parsePaperAuthors } from "~/components/Document/lib/types";
import { Hub, parseHub } from "~/config/types/hub";
import {
  AuthorProfile,
  ID,
  parseAuthorProfile,
} from "~/config/types/root_types";
import { formatDateStandard } from "~/config/utils/dates";

export type SuggestedUser = {
  firstName: string;
  lastName: string;
  fullName: string;
  id: ID;
  reputation: number;
  createdDate: string;
  authorProfile: AuthorProfile;
};

export type SuggestedInstitution = {
  id: ID;
  name: string;
  worksCount: number;
  thumbnailImageUrl?: string;
  imageUrl?: string;
  hIndex?: number;
  i10Index?: number;
  region?: string;
  city?: string;
  countryCode?: string;
}

export type SuggestedAuthor = {
  id: ID;
  fullName: string;
  profileImage: string;
  institutions: Array<{
    id: ID;
    name: string;
  }>;
  headline: string;
  reputationHubs: string[];
  userId?: ID;
  createdDate?: string;
  education: string;
};

export type HubSuggestion = {
  id: ID;
  hub: Hub;
  name: string;
  label: string;
  value: ID;
};

export type JournalSuggestion = {
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
  publishedDate: string;
  slug: string;
};

export type PostSuggestion = {
  id: ID;
  title: string;
  authors: AuthorProfile[];
  createdDate: string;
  slug: string;
};

export type QuestionSuggestion = {
  id: ID;
  title: string;
  authors: AuthorProfile[];
  createdDate: string;
  slug: string;
};

export type Suggestion = {
  suggestionType: "hub" | "user" | "paper" | "post" | "question" | "journal";
  data:
    | HubSuggestion
    | SuggestedUser
    | PaperSuggestion
    | PostSuggestion
    | JournalSuggestion;
};

export const parseInstitutionSuggestion = (raw: any): SuggestedInstitution => {
  return {
    id: raw.id,
    name: raw.display_name,
    worksCount: raw.works_count,
    thumbnailImageUrl: raw.image_thumbnail_url || null,
    imageUrl: raw.image_url || null,
    hIndex: raw.h_index,
    i10Index: raw.i10_index,
    region: raw.region,
    city: raw.city,
    countryCode: raw.country_code,
  };
}

export const parseAuthorSuggestion = (raw: any): SuggestedAuthor => {
  return {
    id: raw.id,
    fullName: raw.full_name || (raw.first_name + " " + raw.last_name) || "",
    profileImage: raw.profile_image || null,
    institutions: raw.institutions,
    education: raw.education,
    headline: raw?.headline?.title || "",
    reputationHubs: raw.reputation_hubs || [],
    userId: raw.user_id,
    createdDate: formatDateStandard(raw.created_date, "MMM D, YYYY"),
  };
};

export const parsePaperSuggestion = (raw: any): PaperSuggestion => {
  return {
    id: raw.id,
    title: raw.title,
    publishedDate: formatDateStandard(raw.paper_publish_date, "MMM D, YYYY"),
    authors: parsePaperAuthors(raw, true, false),
    slug: raw.slug,
  };
};

export const parsePostSuggestion = (raw: any): PostSuggestion => {
  return {
    id: raw.id,
    title: raw.title,
    createdDate: formatDateStandard(raw.created_date, "MMM D, YYYY"),
    authors: (raw.authors || []).map((a: any) => parseAuthorProfile(a)),
    slug: raw.slug,
  };
};

export const parseQuestionSuggestion = (raw: any): QuestionSuggestion => {
  return {
    id: raw.id,
    title: raw.title,
    createdDate: formatDateStandard(raw.created_date, "MMM D, YYYY"),
    authors: (raw.authors || []).map((a: any) => parseAuthorProfile(a)),
    slug: raw.slug,
  };
};

export const parseSuggestion = (raw: any): Suggestion => {
  if (raw._index === "paper") {
    return {
      suggestionType: "paper",
      data: parsePaperSuggestion(raw._source),
    };
  } else if (
    raw._index === "post" &&
    raw._source.document_type === "QUESTION"
  ) {
    return {
      suggestionType: "question",
      data: parseQuestionSuggestion(raw._source),
    };
  } else if (
    raw._index === "post" &&
    raw._source.document_type === "DISCUSSION"
  ) {
    return {
      suggestionType: "post",
      data: parsePostSuggestion(raw._source),
    };
  } else if (raw._index === "user") {
    return {
      suggestionType: "user",
      data: parseUserSuggestion(raw._source),
    };
  } else if (raw._index === "hub") {
    return {
      suggestionType: "hub",
      data: parseHubSuggestion(raw._source),
    };
  } else if (raw._index === "journal") {
    return {
      suggestionType: "journal",
      data: parseJournalSuggestion(raw._source),
    };
  }

  throw new Error(`Invalid suggestion type. Type was ${raw._index}`);
};

export const parseUserSuggestion = (raw: any): SuggestedUser => {
  return {
    firstName: raw.first_name,
    lastName: raw.last_name,
    fullName: raw.full_name,
    id: raw.id,
    reputation: raw.reputation || 0,
    createdDate: formatDateStandard(raw.created_date, "MMM D, YYYY"),
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

export const parseJournalSuggestion = (raw: any): JournalSuggestion => {
  const hub = parseHub(raw);
  return {
    hub,
    name: raw.name,
    id: raw.id,
    label: raw.name,
    value: raw.id,
  };
};
