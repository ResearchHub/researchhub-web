import React from "react";
import Router, { useRouter } from "next/router";
import { useStore, useDispatch } from "react-redux";

// Components
import HubPage from "~/components/Hubs/HubPage";
import LockedHubPage from "~/components/Hubs/LockedHubPage";

// Redux
import { HubActions } from "~/redux/hub";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

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

  render() {
    let { currentHub, hubName } = this.state;

    if (currentHub) {
      if (currentHub.is_locked) {
        return <LockedHubPage hub={currentHub} hubName={hubName} />;
      } else {
        return <HubPage hub={currentHub} hubName={hubName} />;
      }
    } else {
      return null;
    }
  }
}

export default Index;
