import { Popover } from "@varld/popover";
import React, { ReactElement, ReactNode } from "react";

type contentRendererArgs = {
  close: () => void;
  open: boolean;
  visible: boolean;
};

type Props = {
  contentRenderer: (contentRendererArgs) => ReactElement;
  targetElement: ReactElement;
};

export default function ResearchHubPopover({
  contentRenderer,
  targetElement,
}: Props): ReactElement<typeof Popover> {
  return <Popover popover={contentRenderer}>{targetElement}</Popover>;
}
