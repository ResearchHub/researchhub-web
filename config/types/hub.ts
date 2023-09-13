import { ID } from "./root_types";

export type Hub = {
  id: ID;
  slug: string;
  name: string;
  description: string;
  relevancyScore: number;
  numPapers?: number;
  numComments?: number;
};

export const parseHub = (raw: any): Hub => {

  const parsed = {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    relevancyScore: raw.relevancy_score || 0,
    description: raw.description || "",
  };

  if (raw.discussion_count) {
    parsed["discussion_count"] = raw.discussion_count;
  }

  if (raw.paper_count) {
    parsed["numPapers"] = raw.paper_count;
  }  

  return parsed;
};
