import { connect } from "react-redux";
import { StyleSheet } from "aphrodite";
import { useRouter } from "next/router";

import HubPage from "../components/Hubs/HubPage";

import API from "~/config/api";
import { getInitialScope } from "~/config/utils/dates";
const isServer = () => typeof window === "undefined";

const Index = (props) => {
  return <HubPage home={true} {...props} />;
};

Index.getInitialProps = async (ctx) => {
  if (!isServer()) {
    return { props: {} };
  }
  let { query } = ctx;
  let defaultProps = {
    initialFeed: null,
    leaderboardFeed: null,
    initialHubList: null,
  };
  let page = query.page ? query.page : 1;
  try {
    const [initialFeed] = await Promise.all([
      fetch(
        API.GET_HUB_PAPERS({
          hubId: 0,
          ordering: "hot",
          timePeriod: getInitialScope(),
          page,
        }),
        API.GET_CONFIG()
      ).then((res) => res.json()),
    ]);

    let props = { initialFeed, query };
    return props;
  } catch (e) {
    console.log(e);
    return defaultProps;
  }
};

export default Index;
