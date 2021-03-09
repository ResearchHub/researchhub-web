import React, { useState } from "react";

type ComponentState = {
  didFinishedLoading: boolean;
  doesSummaryExists: boolean;
  editorValue?: string;
  isEditing: boolean;
  isReadOnly: boolean;
};
type Props = {};

function SumamryTab(props: Props) {
  const [componentState, setComponentState] = useState<ComponentState>({
    didFinishedLoading: false,
    doesSummaryExists: false,
    editorValue: null,
    isEditing: false,
    isReadOnly: true,
  });
}

export default SumamryTab;
