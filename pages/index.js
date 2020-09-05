import { connect } from "react-redux";
import { StyleSheet } from "aphrodite";
import API from "~/config/api";

import HubPage from "../components/Hubs/HubPage";

import { getInitialScope } from "~/config/utils/dates";

class Index extends React.Component {
  static async getInitialProps(ctx) {
    let { query } = ctx;
    let defaultProps = {
      initialFeed: null,
      leaderboardFeed: null,
      initialHubList: null,
    };

    try {
      const [initialFeed, leaderboardFeed] = await Promise.all([
        fetch(
          API.GET_HUB_PAPERS({
            // Initial Feed
            hubId: 0,
            ordering: "hot",
            timePeriod: getInitialScope(),
          }),
          API.GET_CONFIG()
        ).then((res) => res.json()),
        fetch(
          API.LEADERBOARD({ limit: 10, page: 1, hubId: 0 }), // Leaderboard
          API.GET_CONFIG()
        ).then((res) => res.json()),
        // fetch(API.SORTED_HUB({}), API.GET_CONFIG()).then((res) => res.json()),
      ]);

      return { initialFeed, leaderboardFeed, query };
    } catch {
      return defaultProps;
    }
  }

  render() {
    return <HubPage home={true} {...this.props} />;
  }
}

var styles = StyleSheet.create({});

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);
