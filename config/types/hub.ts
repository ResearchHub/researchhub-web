import { ID } from "./root_types";

export type Hub = {
  id: ID;
  slug: string;
  name: string;
  description: string;
  relevancyScore: number;
  numDocs?: number;
  numComments?: number;
  isUsedForRep: boolean;
};

export const parseHub = (raw: any): Hub => {
  const parsed = {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    isUsedForRep: raw.is_used_for_rep || false,
    relevancyScore: raw.relevancy_score || 0,
    description: raw.description || "",
  };

  if (raw.discussion_count) {
    parsed["numComments"] = raw.discussion_count || 0;
  }

  if (raw.paper_count) {
    parsed["numDocs"] = raw.paper_count || 0;
  }

  return parsed;
};
