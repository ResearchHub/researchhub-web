import { AUTH_TOKEN } from "~/config/constants";
import HubPage from "~/components/Hubs/HubPage";
import nookies from "nookies";
import { getFetchDefaults } from "~/components/UnifiedDocFeed/utils/getFetchDefaults";
import { NextPage } from "next";
import HeadComponent from "~/components/Head";

const Index: NextPage = (props) => {
  return (
    <div>
      <HeadComponent
        title={"ResearchHub | For You"}
        description={"Discuss and Discover the latest research on ResearchHub"}
      />
      <HubPage isForYouFeed={true} {...props} />
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
    return {
      ...defaultProps,
    };
  } catch (error) {
    return defaultProps;
  }
};

export default Index;
