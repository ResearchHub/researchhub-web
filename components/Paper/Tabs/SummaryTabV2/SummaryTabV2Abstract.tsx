import React, { useState } from "react";

type ComponentState = {
  abstractBody?: string;
  shouldEditAbstract: boolean;
  shouldShowAbstract: boolean;
};
type Props = {};

function SummaryTabV2Abstract(props: Props): React.ReactElement<"div"> {
  const [componentState, setComponentState] = useState<ComponentState>({
    abstractBody: null,
    shouldEditAbstract: false,
    shouldShowAbstract: true,
  });

  return <div>{"Hi this is AbstractSection"}</div>;
}

export default SummaryTabV2Abstract;
