import React from "react";
import Router, { useRouter } from "next/router";

import HubPage from "~/components/Hubs/HubPage";

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

  return <HubPage hubName={hubName && convertUrlToName(hubName)} />;
};

export default Index;
