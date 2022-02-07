import { ID } from "../types/root_types";
import { getInitialScope } from "./dates";
import { isNullOrUndefined } from "./nullchecks";

type FEReturnType = "hypothesis" | "post" | "paper" | "all";
type BEReturnType = "hypothesis" | "paper" | "posts" | "all";

// this function is used to resolve BE model name discrepencies with FE naming conventions
// the return type is intentionally kept strict.
export function getUnifiedDocType(
  input: string | null | undefined
): FEReturnType {
  const lowerCasedInput = input?.toLowerCase() ?? null;
  switch (lowerCasedInput) {
    case "discussion":
    case "post":
    case "posts":
      return "post";
    case "hypothesis":
      return "hypothesis";
    case "paper":
      return "paper";
    default:
      return "all";
  }
}

// this function is used to resolve FE type name to with BE naming conventions
export function getBEUnifiedDocType(
  input: string | null | undefined
): BEReturnType {
  const lowerCasedInput = input?.toLowerCase() ?? null;
  switch (lowerCasedInput) {
    case "post":
    case "posts":
      return "posts";
    case "hypothesis":
      return "hypothesis";
    case "paper":
      return "paper";
    default:
      return "all";
  }
}

// NOTE: Yes, this function is redundant. However, it exists to keep the payload consistent thoughout js & ts files
// TODO: calvinhlee - use this to consolidate all the fetches in server & client
export function getFetchParamsWithoutCallbacks({
  docTypeFilter,
  hubID,
  isLoggedIn,
  page,
  subFilters,
  subscribedHubs,
  timePeriod,
}: {
  docTypeFilter: BEReturnType;
  hubID: ID;
  isLoggedIn: boolean;
  page: number;
  subFilters: any;
  subscribedHubs: boolean;
  timePeriod: any;
}) {
  return {
    docTypeFilter,
    hubID,
    isLoggedIn,
    page,
    subFilters,
    subscribedHubs,
    timePeriod: timePeriod ?? getInitialScope(),
  };
}
