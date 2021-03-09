import React, { useState } from "React";

type AbstractState = {
  abstract?: string;
  shouldShowAbstract: boolean;
  shouldEditAbstract: boolean;
};
type Props = {};

function SummaryTabV2Abstract(props: Props) {
  const [abstractState, setAbstractState] = useState<AbstractState>({
    abstract: "",
    shouldShowAbstract: true,
    shouldEditAbstract: false,
  });
}

module.exports = SummaryTabV2Abstract;
