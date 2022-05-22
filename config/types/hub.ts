import { ID } from "./root_types"

export type Hub = {
  id: ID;
  slug: string;
  name: string;
}

export const parseHub = (raw: any): Hub => {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
  }
}
