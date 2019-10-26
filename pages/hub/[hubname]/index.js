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
      hub: "",
    };
  }

  componentDidMount() {
    this.setState(
      {
        hub: Router.router.query.hubname,
      },
      () => {
        this.fetchHubInfo(this.state.hub);
      }
    );
  }

  fetchHubInfo = (name) => {
    return fetch(API.HUB({ name }), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        console.log("res", res);
        // this.setState({ currentHub: res.result })
      });
  };

  render() {
    let currentHub = {
      name: "blank",
      id: 1,
    };

    return <HubPage hub={currentHub} hubName={this.state.hubname} />;
  }
}

// const Index = (props) => {
// const router = useRouter();
// const dispatch = useDispatch();
// const store = useStore();
// let { hubname } = router.query;
// let hubName = hubname;
// var { currentHub, hubs } = store.getState().hubs;

// const getHubs = async () => {
//   await dispatch(HubActions.getHubs());
//   hubs = store.getState().hubs.hubs;
// };

// const convertUrlToName = (hubName) => {
//   let nameArr = hubName.split("-");
//   if (nameArr.length > 1) {
//     return nameArr
//       .map((el) => {
//         let name = el[0].toUpperCase() + el.slice(1);
//         return name;
//       })
//       .join(" ");
//   } else {
//     let name = hubName[0].toUpperCase() + hubName.slice(1);
//     return name;
//   }
// };

// if (hubs.length < 1) {
//   getHubs();
// }

// hubName = convertUrlToName(hubName);

// /**
//  * If current hub doesn't exist then use the hubName passed down
//  * to set current hub and then check to see if currentHub.isLocked is true / false
//  */

// if (
//   currentHub === null ||
//   JSON.stringify(currentHub) === JSON.stringify({})
// ) {
//   // if currentHub is empty
//   let current = hubs.filter((hub) => hub.name === hubName).pop();
//   if (current !== undefined) {
//     dispatch(HubActions.updateCurrentHubPage(current));
//     currentHub = store.getState().hubs.currentHub;
//   } else {
//     currentHub = {
//       is_locked: true,
//     };
//   }
// }

// if (currentHub.is_locked) {
//   return <LockedHubPage hub={currentHub} hubName={hubName} />;
// } else {
//   return <HubPage hub={currentHub} hubName={hubName} />;
// }
// };

export default Index;
