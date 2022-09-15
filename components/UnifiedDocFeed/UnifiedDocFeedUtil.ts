import { capitalize } from "../../config/utils/string";

type FormatMainHeaderArgs = {
  hubName: string;
  isHomePage: boolean;
  isLiveFeed?: boolean;
};

export function formatMainHeader({
  hubName,
  isHomePage,
  isLiveFeed,
}: FormatMainHeaderArgs): string {
  return (isHomePage || isLiveFeed) ? `Explore ResearchHub` : `${capitalize(hubName)}`;
}
