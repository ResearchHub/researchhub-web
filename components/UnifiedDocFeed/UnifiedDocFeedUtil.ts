import { capitalize } from "../../config/utils/string";

type FormatMainHeaderArgs = {
  label: string;
  isHomePage: boolean;
  isLiveFeed?: boolean;
};

export function formatMainHeader({
  label,
  isHomePage,
  isLiveFeed,
}: FormatMainHeaderArgs): string {
  return isHomePage || isLiveFeed
    ? `Explore ResearchHub`
    : `${capitalize(label)}`;
}
