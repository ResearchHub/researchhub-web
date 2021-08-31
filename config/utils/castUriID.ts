import { ID } from "../types/root_types";
import { nullthrows } from "./nullchecks";

export function castUriID(id: string | string[] | undefined): ID {
  return Array.isArray(id) ? parseInt(id[0]) : parseInt(nullthrows(id));
}
