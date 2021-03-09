import React, { useState } from "React";

type AbstractState = {
  abstract?: string;
  shouldEditAbstract: boolean;
  shouldShowAbstract: boolean;
};
type Props = {};

function SummaryTabV2Abstract(props: Props) {
  const [abstractState, setAbstractState] = useState<AbstractState>({
    abstract: "",
    shouldEditAbstract: false,
    shouldShowAbstract: true,
  });
}

module.exports = SummaryTabV2Abstract;
