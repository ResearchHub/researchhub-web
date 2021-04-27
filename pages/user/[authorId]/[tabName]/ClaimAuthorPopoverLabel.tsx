import React, { ReactElement } from "react";
import ResearchHubPopover from "../../../../components/ResearchHubPopover";

type Props = {
  auth: any;
  author: any;
  user: any;
};

export default function ClaimAuthorPopoverLabel({
  auth,
  author,
  user,
}: Props): ReactElement<"div"> {
  return (
    <div>
      <ResearchHubPopover
        contentRenderer={({ close, open, visible }) => <>HI THIS IS BODY</>}
        targetElement={<div>Hello, click me</div>}
      />
    </div>
  );
}
