import { capitalize } from "../../config/utils/string";

type FormatMainHeaderArgs = {
  feed: number;
  filterBy: any;
  hubName: string;
  isHomePage: boolean;
};

export function formatMainHeader({
  feed,
  filterBy,
  hubName,
  isHomePage,
}: FormatMainHeaderArgs): string {
  if (feed === 1) {
    return "My Hubs";
  }

  return isHomePage ? `Explore Research Hub` : `${capitalize(hubName)}`;
}
