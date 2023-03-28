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
}

const TOOLTIP_DELAY = 300;

export default function UserTooltip({
  createdBy,
  targetContent,
  positions,
}: UserTooltipProps): ReactElement {
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
          id={`user-popover-${genClientId()}`}
        >
          <UserPopover userId={createdBy?.id} />
        </div>
      }
      isOpen={userPopoverOpen}
      targetContent={
        <div
          style={{
            padding: 4,
            margin: -4,
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
