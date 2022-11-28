import { AUTH_TOKEN } from "~/config/constants";
import { fetchUnifiedDocFeed } from "~/config/fetch";
import { isNullOrUndefined } from "~/config/utils/nullchecks";
import HubPage from "~/components/Hubs/HubPage";
import nookies from "nookies";
import { getSelectedUrlFilters } from "~/components/UnifiedDocFeed/utils/getSelectedUrlFilters";
import { getFetchDefaults } from "~/components/UnifiedDocFeed/utils/getFetchDefaults";

const Index = (props) => {
  return <HubPage home={true} {...props} />;
};

export async function getStaticProps(ctx) {
  return {
    props: {},
  };
}

// Index.getInitialProps = async (ctx) => {
//   const { query } = ctx;
//   const cookies = nookies.get(ctx);
//   const authToken = cookies[AUTH_TOKEN];
//   const defaultProps = getFetchDefaults({ query, authToken });

//   if (process.browser) {
//     return defaultProps;
//   }

//   try {
//     const selectedFilters = getSelectedUrlFilters({ query, pathname: "/" });
//     const initialFeed = await fetchUnifiedDocFeed(
//       {
//         selectedFilters,
//         hubId: null,
//         page: 1,
//       },
//       authToken,
//       !isNullOrUndefined(authToken) /* withVotes */
//     );

//     console.log('-----------------')
//     console.log(selectedFilters)
//     console.log('-----------------')

//     return {
//       ...defaultProps,
//       initialFeed,
//     };
//   } catch (error) {
//     return defaultProps;
//   }
// };

export default Index;
