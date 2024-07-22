import { ReactElement, useRef, useState } from "react";
import { StyleSheet, css } from "aphrodite";

// Components
import ResearchHubPopover from "~/components/ResearchHubPopover";
import UserPopover from "./UserPopover";

// Utils
import { RHUser } from "~/config/types/root_types";
import { genClientId } from "~/config/utils/id";
import { getIsOnMobileScreenSize } from "~/config/utils/getIsOnMobileScreenSize";

interface UserTooltipProps {
  createdBy: RHUser | null;
  targetContent: ReactElement;
  positions?: ("left" | "right" | "top" | "bottom")[];
  overrideTargetStyle?: any | null;
}

const TOOLTIP_DELAY = 400;

export default function UserTooltip({
  createdBy,
  targetContent,
  positions,
  overrideTargetStyle,
}: UserTooltipProps): ReactElement | null {
  const [userPopoverOpen, setUserPopoverOpen] = useState(false);

  const inPopoverRef = useRef(false);
  const popoverRefTimeout = useRef(null);
  const leavePopoverTimeout = useRef(null);

  const isMobileScreen = getIsOnMobileScreenSize();

  if (!createdBy?.id) {
    return null;
  }

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
            clearTimeout(leavePopoverTimeout.current);
            leavePopoverTimeout.current = setTimeout(() => {
              inPopoverRef.current = false;
              setUserPopoverOpen(false);
              leavePopoverTimeout.current = null;
            }, TOOLTIP_DELAY / 2);
          }}
          id={`user-popover-${genClientId()}`}
        >
          <UserPopover userId={createdBy?.id} />
        </div>
      }
      isOpen={userPopoverOpen}
      targetContent={
        <div
          className={css(styles.targetWrapper, overrideTargetStyle)}
          onMouseEnter={() => {
            clearTimeout(popoverRefTimeout.current);
            if (!isMobileScreen && !leavePopoverTimeout.current) {
              popoverRefTimeout.current = setTimeout(() => {
                setUserPopoverOpen(true);
              }, TOOLTIP_DELAY);
            }
          }}
          onMouseLeave={(e) => {
            clearTimeout(leavePopoverTimeout.current);
            if (userPopoverOpen) {
              leavePopoverTimeout.current = setTimeout(() => {
                if (!inPopoverRef.current) {
                  setUserPopoverOpen(false);
                }
                leavePopoverTimeout.current = null;
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
  targetWrapper: {
    padding: 4,
    margin: -4,
  },
});
