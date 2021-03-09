import React, { useState } from "react";

type ComponentState = {
  isReadOnly: boolean;
  editorValue?: string;
  doesSummaryExists: boolean;
  isEditing: boolean;
  didFinishedLoading: boolean;
};
type Props = {};

function SumamryTab(props: Props) {
  const [componentState, setComponentState] = useState<ComponentState>({
    isReadOnly: true,
    editorValue: null,
    doesSummaryExists: false,
    isEditing: false,
    didFinishedLoading: false,
  });
}

export default SumamryTab;
