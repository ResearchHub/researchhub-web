import { ID } from "./root_types";

export type Hub = {
  id: ID;
  slug: string;
  name: string;
  relevancyScore: number;
};

export const parseHub = (raw: any): Hub => {
  console.log("raw", raw);
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    relevancyScore: raw.relevancy_score || 0,
  };
};
