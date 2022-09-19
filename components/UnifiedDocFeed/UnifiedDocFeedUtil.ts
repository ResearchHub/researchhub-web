import { capitalize } from "../../config/utils/string";

type FormatMainHeaderArgs = {
  label: string;
  isHomePage: boolean;
};

export function formatMainHeader({
  label,
  isHomePage,
}: FormatMainHeaderArgs): string {
  return isHomePage ? `Explore ResearchHub` : `${capitalize(label)}`;
}
