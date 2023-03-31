import { ReactElement, useRef, useState } from "react";
import { StyleSheet, css } from "aphrodite";

// Components
import ResearchHubPopover from "~/components/ResearchHubPopover";
import UserPopover from "./UserPopover";

// Utils
import { RHUser } from "~/config/types/root_types";
import { genClientId } from "~/config/utils/id";
import { getIsOnMobileScreenSize } from "~/config/utils/getIsOnMobileScreenSize";
import RSCPopover from "./RSCPopover";

interface RSCTooltipProps {
  amount: number;
  targetContent: ReactElement;
  positions?: ("left" | "right" | "top" | "bottom")[];
}

const TOOLTIP_DELAY = 400;

export default function RSCTooltip({
  amount,
  targetContent,
  positions,
}: RSCTooltipProps): ReactElement {
  const [userPopoverOpen, setUserPopoverOpen] = useState(false);

  const inPopoverRef = useRef(false);
  const popoverRefTimeout = useRef(null);

  const isMobileScreen = getIsOnMobileScreenSize();

  return (
    <ResearchHubPopover
      containerStyle={{ zIndex: 100 }}
      positions={positions || ["bottom", "top", "right", "left"]}
      onClickOutside={(): void => {
        setUserPopoverOpen(false);
      }}
      popoverContent={
        <div
          className={css(
            positions?.length === 1 && positions[0] === "left"
              ? styles.userPopoverLeft
              : styles.userPopover
          )}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onMouseEnter={(e) => {
            inPopoverRef.current = true;
          }}
          onMouseLeave={(e) => {
            setTimeout(() => {
              inPopoverRef.current = false;
              setUserPopoverOpen(false);
            }, TOOLTIP_DELAY / 2);
          }}
        >
          <RSCPopover amount={amount} />
        </div>
      }
      isOpen={userPopoverOpen}
      targetContent={
        <div
          style={{
            paddingBottom: 10,
            marginBottom: -10,
          }}
          onClick={(e) => {
            e.stopPropagation();
            setUserPopoverOpen(!userPopoverOpen);
          }}
          onMouseEnter={() => {
            if (!isMobileScreen) {
              popoverRefTimeout.current = setTimeout(() => {
                setUserPopoverOpen(true);
              }, TOOLTIP_DELAY);
            }
          }}
          onMouseLeave={(e) => {
            if (userPopoverOpen) {
              setTimeout(() => {
                if (!inPopoverRef.current) {
                  setUserPopoverOpen(false);
                }
              }, TOOLTIP_DELAY / 2);
            } else {
              if (!inPopoverRef.current) {
                clearTimeout(popoverRefTimeout.current);
                setUserPopoverOpen(false);
              }
            }
          }}
        >
          {targetContent}
        </div>
      }
    />
  );
}

const styles = StyleSheet.create({
  userPopover: {
    marginTop: -4,
  },
  userPopoverLeft: {
    marginRight: -4,
  },
});
