import { ArrowContainer, Popover } from "react-tiny-popover";
import { Fragment, ReactElement } from "react";
import { isNullOrUndefined } from "../config/utils/nullchecks";

type Props = {
  isOpen: boolean;
  popoverContent: ReactElement;
  positions: Array<"left" | "right" | "top" | "bottom">;
  setIsPopoverOpen: (flag: boolean) => void;
  targetContent: ReactElement;
  withArrow: boolean;
};

export default function ResearchHubPopover({
  isOpen,
  popoverContent,
  positions,
  setIsPopoverOpen,
  targetContent,
  withArrow,
}: Props): ReactElement<typeof Fragment | typeof Popover> {
  if (isNullOrUndefined(typeof window)) {
    return <Fragment />;
  }
  return (
    <Popover
      content={({ position, childRect, popoverRect }) => (
        withArrow ? (
          <ArrowContainer
            arrowClassName="popover-arrow"
            arrowColor={"#fff"}
            arrowSize={10}
            childRect={childRect}
            className="popover-arrow-container"
            popoverRect={popoverRect}
            position={position}
          >
            {popoverContent}
          </ArrowContainer>
        ) : popoverContent
      )}
      isOpen={isOpen}
      onClickOutside={(): void => setIsPopoverOpen(false)}
      positions={positions} // preferred positions by priority
    >
      {targetContent}
    </Popover>
  );
}
