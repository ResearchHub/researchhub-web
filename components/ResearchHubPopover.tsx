import { ArrowContainer, Popover } from "react-tiny-popover";
import { Fragment, ReactElement } from "react";
import { isNullOrUndefined } from "../config/utils/nullchecks";

type Props = {
  align: "start" | "center" | "end";
  containerStyle: object;
  isOpen: boolean;
  padding: number;
  popoverContent: ReactElement;
  positions: Array<"left" | "right" | "top" | "bottom">;
  setIsPopoverOpen: (flag: boolean) => void;
  targetContent: ReactElement;
  withArrow: boolean;
};

export default function ResearchHubPopover({
  align,
  isOpen,
  padding,
  popoverContent,
  positions,
  setIsPopoverOpen,
  targetContent,
  withArrow,
  containerStyle
}: Props): ReactElement<typeof Fragment | typeof Popover> {
  if (isNullOrUndefined(typeof window)) {
    return <Fragment />;
  }
  return (
    <Popover
      align={align}
      containerStyle={containerStyle}
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
      padding={padding}
      positions={positions} // preferred positions by priority
    >
      {targetContent}
    </Popover>
  );
}
