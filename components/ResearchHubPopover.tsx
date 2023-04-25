import { ArrowContainer, Popover } from "react-tiny-popover";
import { Fragment, ReactElement } from "react";

type Props = {
  align?: "start" | "center" | "end";
  className?: string;
  containerStyle?: any;
  isOpen: boolean;
  onClickOutside?: ((e: MouseEvent) => void) | undefined;
  padding?: number;
  popoverContent: ReactElement;
  positions: Array<"left" | "right" | "top" | "bottom">;
  setIsPopoverOpen?: (flag: boolean) => void;
  targetContent: ReactElement;
  withArrow?: boolean;
  popoverStyle?: any;
};

export default function ResearchHubPopover({
  align,
  isOpen,
  padding,
  popoverContent,
  popoverStyle = {},
  positions,
  targetContent,
  withArrow,
  className,
  onClickOutside,
  containerStyle,
}: Props): ReactElement<typeof Fragment | typeof Popover> {
  return (
    <Popover
      align={align}
      containerStyle={containerStyle}
      content={({ position, childRect, popoverRect }) =>
        !!withArrow ? (
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
        ) : (
          <div
            style={{
              background: "#fff",
              boxShadow: "0px 0px 10px 0px #00000026",
              borderRadius: 4,
              ...popoverStyle,
            }}
          >
            {popoverContent}
          </div>
        )
      }
      isOpen={isOpen}
      containerClassName={className}
      onClickOutside={onClickOutside}
      padding={padding}
      positions={positions} // preferred positions by priority
    >
      {targetContent}
    </Popover>
  );
}
