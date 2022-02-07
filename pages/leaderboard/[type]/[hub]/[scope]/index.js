import { Component } from "react";
import fetchHubFromSlug from "~/pages/hubs/api/fetchHubFromSlug";
import LeaderboardPage from "../../../LeaderboardPage";

class Index extends Component {
  static async getInitialProps({ store, isServer, query }) {
    let slug = query.slug;
    let hub = null;
    if (slug) {
      hub = await fetchHubFromSlug({ slug });
    }
    return { hub, slug };
  }

  render() {
    const { hub, slug } = this.props;
    return <LeaderboardPage hub={hub} />;
  }
}

export default Index;
