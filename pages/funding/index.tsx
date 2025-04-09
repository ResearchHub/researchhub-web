import { ENV_AUTH_TOKEN } from "~/config/utils/auth";
import { fetchUnifiedDocFeed } from "~/config/fetch";
import { isNullOrUndefined } from "~/config/utils/nullchecks";
import HubPage from "~/components/Hubs/HubPage";
import nookies from "nookies";
import {
  SelectedUrlFilters,
  getSelectedUrlFilters,
} from "~/components/UnifiedDocFeed/utils/getSelectedUrlFilters";
import { getFetchDefaults } from "~/components/UnifiedDocFeed/utils/getFetchDefaults";
import { NextPage } from "next";
import HeadComponent from "~/components/Head";

const Index: NextPage = (props) => {
  return (
    <div>
      <HeadComponent
        title={"ResearchHub | Funding"}
        description={"Crowdfund preregistrations on ResearchHub"}
      />
      <HubPage
        isSingleDocTypeFeed={true}
        docType="preregistration"
        {...props}
      />
    </div>
  );
};

Index.getInitialProps = async (ctx) => {
  const { query } = ctx;
  const cookies = nookies.get(ctx);
  const authToken = cookies[ENV_AUTH_TOKEN];
  const defaultProps = getFetchDefaults({ query, authToken });

  try {
    const selectedFilters: SelectedUrlFilters = {
      ...getSelectedUrlFilters({ query, pathname: "/" }),
      type: "preregistration",
    };
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
