import React, { useState } from "React";

type ComponentState = {
  abstractBody?: string;
  shouldEditAbstract: boolean;
  shouldShowAbstract: boolean;
};
type Props = {};

function SummaryTabV2Abstract(props: Props) {
  const [ComponentState, setComponentState] = useState<ComponentState>({
    abstractBody: "",
    shouldEditAbstract: false,
    shouldShowAbstract: true,
  });
}

module.exports = SummaryTabV2Abstract;
