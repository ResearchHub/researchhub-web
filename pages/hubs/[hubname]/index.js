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
    const hub = await fetchHub(query.hubname);
    return { hub };
  }

  constructor(props) {
    super(props);
    this.state = {
      hubName: process.browser && Router.router.query.hubname,
      currentHub: process.browser && props.hubs ? props.hubs.name : null,
      hubDescription: null, // TODO: Pull from hub description field
    };
  }

  async componentDidMount() {
    await this.fetchHubInfo(this.state.hubName);
  }

  componentDidUpdate(prevProp) {
    if (Router.router.query.hubname !== this.state.hubName) {
      this.setState(
        {
          hubName: Router.router.query.hubname,
        },
        () => {
          this.fetchHubInfo(Router.router.query.hubname);
        }
      );
    }
  }

  fetchHubInfo = async (name) => {
    const currentHub = await fetchHub(name);
    if (currentHub) {
      this.setState({ currentHub });
    }
  };

  renderHub = () => {
    const { currentHub, hubName } = this.state;

    if (currentHub) {
      if (currentHub.is_locked) {
        return <LockedHubPage hub={currentHub} hubName={hubName} />;
      } else {
        return <HubPage hub={currentHub} hubName={hubName} />;
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
            title={toTitleCase(this.state.hubName)}
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
    name = name.split("-").join(" ");
    return await fetch(API.HUB({ name }), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        return res.results[0]; // TODO: Shim and catch errors
      });
  }
}

export default Index;
