import React from "react";
import Router, { useRouter } from "next/router";

import HubPage from "~/components/Hubs/HubPage";
import LockedHubPage from "~/components/Hubs/LockedHubPage";

const Index = (props) => {
  const router = useRouter();
  const { hubName } = router.query;

  function convertUrlToName(hubName) {
    let nameArr = hubName.split("-");
    if (nameArr.length > 1) {
      return nameArr
        .map((el) => {
          let name = el[0].toUpperCase() + el.slice(1);
          return name;
        })
        .join(" ");
    } else {
      let name = hubName[0].toUpperCase() + hubName.slice(1);
      return name;
    }
  }

  if (hubName === "artificial-intelligence") {
    return <LockedHubPage hubName={hubName && convertUrlToName(hubName)} />;
  }
  return <HubPage hubName={hubName && convertUrlToName(hubName)} />;
};

export default Index;
