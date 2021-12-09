import { Component } from "react";
import Router from "next/router";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

import LeaderboardPage from "../../LeaderboardPage";

const fetchHub = (slug) => {
  return fetch(API.HUB({ slug }), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((res) => {
      return res.results[0]; // TODO: Shim and catch errors
    });
};

class Index extends Component {
  static async getInitialProps({ store, isServer, query }) {
    let slug = query.slug;
    let hub = null;
    if (slug) {
      hub = await fetchHub(slug);
    }
    return { hub, slug };
  }

  render() {
    const { hub } = this.props;
    return <LeaderboardPage hub={hub} />;
  }
}

export default Index;
