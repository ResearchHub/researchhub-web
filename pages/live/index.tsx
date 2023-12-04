import { AUTH_TOKEN } from "~/config/constants";
import { fetchUnifiedDocFeed } from "~/config/fetch";
import { isNullOrUndefined } from "~/config/utils/nullchecks";
import HubPage from "~/components/Hubs/HubPage";
import nookies from "nookies";
import { getSelectedUrlFilters } from "~/components/UnifiedDocFeed/utils/getSelectedUrlFilters";
import { getFetchDefaults } from "~/components/UnifiedDocFeed/utils/getFetchDefaults";
import { NextPage } from "next";
import colors from "~/config/themes/colors";
import HeadComponent from "~/components/Head";

const Index: NextPage = (props) => {
  return (
    <div>
      <HeadComponent
        title={"ResearchHub | Live Activity"}
        description={"Discuss and Discover the latest research on ResearchHub"}
      />
      <HubPage isLiveFeed={true} {...props} />
    </div>
  );
};

Index.getInitialProps = async (ctx) => {
  const { query } = ctx;
  const cookies = nookies.get(ctx);
  const authToken = cookies[AUTH_TOKEN];
  const defaultProps = getFetchDefaults({ query, authToken });

  if (process.browser) {
    return defaultProps;
  }

  try {
    const selectedFilters = getSelectedUrlFilters({ query, pathname: "/" });
    const initialFeed = await fetchUnifiedDocFeed(
      {
        selectedFilters,
        hubId: null,
        page: 1,
      },
      authToken,
      !isNullOrUndefined(authToken) /* withVotes */
    );

    return {
      ...defaultProps,
      initialFeed,
    };
  } catch (error) {
    return defaultProps;
  }
};

export default Index;
