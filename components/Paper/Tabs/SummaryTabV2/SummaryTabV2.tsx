import React, { useState } from "react";
import SummaryTabV2Abstract from "~/components/Paper/Tabs/SummaryTabV2/SummaryTabV2Abstract.tsx";

type ComponentState = {
  didFinishedLoading: boolean;
  doesSummaryExists: boolean;
  editorValue?: string;
  isEditing: boolean;
  isReadOnly: boolean;
};
type Props = {};

function SummaryTabV2(props: Props): React.ReactElement<"div"> {
  const [componentState, setComponentState] = useState<ComponentState>({
    didFinishedLoading: false,
    doesSummaryExists: false,
    editorValue: null,
    isEditing: false,
    isReadOnly: true,
  });

  return (
    <div>
      {"Hello this is V2 of Summary Tab"}
      <SummaryTabV2Abstract />
    </div>
  );
}

export default SummaryTabV2;
