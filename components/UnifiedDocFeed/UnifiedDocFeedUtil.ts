import { capitalize } from "../../config/utils/string";

type FormatMainHeaderArgs = {
  hubName: string;
  isHomePage: boolean;
};

export function formatMainHeader({
  hubName,
  isHomePage,
}: FormatMainHeaderArgs): string {
<<<<<<< HEAD
  if (feed === 1) {
    return "My Hubs";
  }

  return isHomePage ? `Explore ResearchHub` : `${capitalize(hubName)}`;
=======
  return isHomePage ? `Explore Research Hub` : `${capitalize(hubName)}`;
>>>>>>> ca59e7a9f (Fetching docs based on URL states instead of event handlers; FE => BE filters conversion)
}
