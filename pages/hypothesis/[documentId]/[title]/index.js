import React from "react";
import Router from "next/router";
import killswitch from "~/config/killswitch/killswitch";
import HypothesisContainer from "~/components/Hypothesis/HypothesisContainer";

const isServer = () => typeof window === "undefined";

export default function Hypothesis(props) {
  if (!killswitch("hypothesis") && !isServer()) {
    Router.push("/");
  }

  return <HypothesisContainer />;
}
