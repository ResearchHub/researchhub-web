import { connect } from "react-redux";
import { StyleSheet } from "aphrodite";
import API from "~/config/api";

import HubPage from "../components/Hubs/HubPage";

import { getInitialScope } from "~/config/utils/dates";

class Index extends React.Component {
  static async getInitialProps(ctx) {
    try {
      // Grab initial home feed as props
      const [initialFeed, leaderboardFeed] = await Promise.all([
        fetch(
          API.GET_HUB_PAPERS({
            hubId: 0,
            ordering: "hot",
            timePeriod: getInitialScope(),
          }),
          API.GET_CONFIG()
        ).then((res) => res.json()),
        fetch(
          API.LEADERBOARD({ limit: 10, page: 1, hubId: 0 }),
          API.GET_CONFIG()
        ).then((res) => res.json()),
      ]);

      return { initialFeed, leaderboardFeed };
    } catch {
      return { initialFeed: null, leaderboardFeed: null };
    }
  }

  render() {
    return (
      <HubPage
        home={true}
        initialFeed={this.props.initialFeed}
        leaderboardFeed={this.props.leaderboardFeed}
      />
    );
  }
}

var styles = StyleSheet.create({});

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);
