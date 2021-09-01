import { ArrowContainer, Popover } from "react-tiny-popover";
import { Fragment, ReactElement } from "react";
import { isNullOrUndefined } from "~/config/utils/nullchecks";

type Props = {
  isOpen: boolean;
  popoverContent: ReactElement;
  setIsPopoverOpen: (flag: boolean) => void;
  targetContent: ReactElement;
};

export default function ResearchHubPopover({
  isOpen,
  popoverContent,
  setIsPopoverOpen,
  targetContent,
}: Props): ReactElement<typeof Fragment | typeof Popover> {
  if (isNullOrUndefined(typeof window)) {
    return <Fragment />;
  }
  return (
    <Popover
      content={({ position, childRect, popoverRect }) => (
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
      )}
      isOpen={isOpen}
      onClickOutside={(): void => setIsPopoverOpen(false)}
      positions={["top"]} // preferred positions by priority
    >
      {targetContent}
    </Popover>
  );
}
