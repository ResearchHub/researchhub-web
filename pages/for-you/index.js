import { ENV_AUTH_TOKEN } from "~/config/utils/auth";
import { fetchUnifiedDocFeed } from "~/config/fetch";
import { isNullOrUndefined } from "~/config/utils/nullchecks";
import HubPage from "~/components/Hubs/HubPage";
import nookies from "nookies";
import { getSelectedUrlFilters } from "~/components/UnifiedDocFeed/utils/getSelectedUrlFilters";
import { getFetchDefaults } from "~/components/UnifiedDocFeed/utils/getFetchDefaults";

const Index = (props) => {
  return <HubPage home={true} {...props} />;
};

Index.getInitialProps = async (ctx) => {
  const { query } = ctx;
  const cookies = nookies.get(ctx);
  const authToken = cookies[ENV_AUTH_TOKEN];
  const defaultProps = getFetchDefaults({ query, authToken });

  if (process.browser) {
    return defaultProps;
  }

  try {
    const selectedFilters = getSelectedUrlFilters({
      query,
      pathname: "/for-you",
    });
    // const initialFeed = await fetchUnifiedDocFeed(
    //   {
    //     selectedFilters,
    //     hubId: null,
    //     page: 1,
    //   },
    //   authToken,
    //   !isNullOrUndefined(authToken) /* withVotes */
    // );

    return {
      ...defaultProps,
      // initialFeed,
    };
  } catch (error) {
    return defaultProps;
  }
};

export default Index;
