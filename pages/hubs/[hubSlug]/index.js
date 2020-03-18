import React from "react";
import Router from "next/router";

// Components
import Head from "~/components/Head";
import HubPage from "~/components/Hubs/HubPage";
import LockedHubPage from "~/components/Hubs/LockedHubPage";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { toTitleCase } from "~/config/utils";

class Index extends React.Component {
  static async getInitialProps({ query }) {
    const hub = await fetchHub(query.hubSlug);
    return { hub };
  }

  constructor(props) {
    super(props);
    this.state = {
      hubSlug: Router.router
        ? decodeURIComponent(Router.router.query.hubSlug)
        : "",
      currentHub: null,
      hubDescription: "", // TODO: Pull from hub description field
    };
  }

  async componentDidMount() {
    await this.fetchHubInfo(this.state.hubSlug);
  }

  componentDidUpdate(prevProp) {
    if (Router.router.query.hubSlug !== this.state.hubSlug) {
      this.setState(
        {
          hubSlug: Router.router.query.hubSlug,
        },
        () => {
          this.fetchHubInfo(Router.router.query.hubSlug);
        }
      );
    }
  }

  fetchHubInfo = async (name) => {
    const currentHub = await fetchHub(name);
    if (currentHub) {
      this.setState({
        currentHub,
        hubDescription: this.props.hub && this.props.hub.name,
      });
    }
  };

  renderHub = () => {
    const { currentHub, hubSlug } = this.state;

    if (currentHub) {
      if (currentHub.is_locked) {
        return <LockedHubPage hub={currentHub} hubSlug={hubSlug} />;
      } else {
        return <HubPage hub={currentHub} hubSlug={hubSlug} />;
      }
    } else {
      return null;
    }
  };

  render() {
    return (
      <div>
        {process.browser ? (
          <Head
            title={toTitleCase(this.state.hubSlug)}
            description={this.state.hubDescription}
          />
        ) : (
          <Head title={"ResearchHub"} description={"ResearchHub"} />
        )}
        {this.renderHub()}
      </div>
    );
  }
}

async function fetchHub(name) {
  if (process.browser) {
    return await fetch(API.HUB({ name }), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        return res.results[0]; // TODO: Shim and catch errors
      });
  }
}

export default Index;
