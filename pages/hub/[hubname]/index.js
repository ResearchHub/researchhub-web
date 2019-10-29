import React from "react";
import Head from "next/head";
import Router from "next/router";

// Components
import HubPage from "~/components/Hubs/HubPage";
import LockedHubPage from "~/components/Hubs/LockedHubPage";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { toTitleCase } from "~/config/utils";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hubName: Router.router.query.hubname,
      currentHub: null,
    };
  }

  componentDidMount() {
    this.fetchHubInfo(this.state.hubName);
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

  fetchHubInfo = (name) => {
    name = name.split("-").join(" ");
    return fetch(API.HUB({ name }), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        this.setState({ currentHub: res.results[0] });
      });
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
        <Head>
          <title>{toTitleCase(this.state.hubName)}</title>
        </Head>
        {this.renderHub()}
      </div>
    );
  }
}

export default Index;
