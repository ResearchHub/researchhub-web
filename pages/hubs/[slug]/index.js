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
    // TODO: This only works client side so we can remove it from here
    const hub = await fetchHub(query.slug);
    return { hub, slug: query.slug };
  }

  constructor(props) {
    super(props);
    this.state = {
      slug: Router.router ? decodeURIComponent(Router.router.query.slug) : "",
      currentHub: {
        name: Router.router
          ? Router.router.query.name
            ? decodeURIComponent(Router.router.query.name)
            : "ResearchHub"
          : "",
        slug: Router.router ? decodeURIComponent(Router.router.query.slug) : "",
      },
      hubDescription: "", // TODO: Pull from hub description field
    };
  }

  componentDidMount() {
    this.fetchHubInfo(this.state.slug);
  }

  componentDidUpdate(prevProp) {
    if (Router.router.query.slug !== this.state.slug) {
      this.setState(
        {
          slug: Router.router.query.slug,
        },
        () => {
          this.fetchHubInfo(Router.router.query.slug);
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
    const { currentHub, slug } = this.state;
    return <HubPage hub={currentHub} slug={slug} />;
  };

  render() {
    // TODO: Clean up head code and format slug
    return (
      <div>
        {process.browser ? (
          <Head
            title={toTitleCase(this.state.currentHub.name) + " on ResearchHub"}
            description={this.state.hubDescription}
          />
        ) : (
          <Head
            title={
              this.props.hub
                ? this.props.hub.name + " on ResearchHub"
                : this.props.slug + " on ResearchHub"
            }
            description={
              this.props.hub
                ? "Discuss and Discover " + this.props.hub.name
                : "Discuss and Discover " + this.props.slug
            }
          />
        )}
        {this.renderHub()}
      </div>
    );
  }
}

async function fetchHub(slug) {
  if (process.browser) {
    return await fetch(API.HUB({ slug }), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        return res.results[0]; // TODO: Shim and catch errors
      });
  }
}

export default Index;
