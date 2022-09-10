import { capitalize } from "../../config/utils/string";

type FormatMainHeaderArgs = {
  hubName: string;
  isHomePage: boolean;
};

export function formatMainHeader({
  hubName,
  isHomePage,
}: FormatMainHeaderArgs): string {
  return isHomePage ? `Explore ResearchHub` : `${capitalize(hubName)}`;
}
