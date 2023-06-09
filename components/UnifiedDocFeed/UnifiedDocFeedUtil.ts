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
}: FormatMainHeaderArgs): string | null {
  return isHomePage || isLiveFeed
    ? `Explore ResearchHub`
    : label
    ? `${capitalize(label)}`
    : null;
}
