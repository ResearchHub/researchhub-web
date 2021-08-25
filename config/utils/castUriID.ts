import { ID } from "../types/root_types";

export function castUriID(id: string | string[] | undefined): ID {
  return Array.isArray(id) ? id[0] : id;
}
