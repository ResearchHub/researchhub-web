import { capitalize } from "../../config/utils/misc";

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
  if (feed === 0) {
    return "My Hubs";
  }

  let prefix = "";
  switch (filterBy.value) {
    case "removed":
      prefix = "Removed";
      break;
    case "hot":
      prefix = "Trending";
      break;
    case "top_rated":
      prefix = "Top";
      break;
    case "newest":
      prefix = "Newest";
      break;
    case "most_discussed":
      prefix = "Most Discussed";
      break;
    case "pulled-papers":
      prefix = "Pulled";
      break;
  }

  return isHomePage ? `${prefix} on ResearchHub` : `${capitalize(hubName)}`;
}
