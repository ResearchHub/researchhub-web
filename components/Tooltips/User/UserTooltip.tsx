import { ReactElement, useRef, useState } from "react";

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

export default function UserTooltip({
  createdBy,
  targetContent,
  positions,
}: UserTooltipProps): ReactElement {
  const [userPopoverOpen, setUserPopoverOpen] = useState(false);

  const inPopoverRef = useRef(false);

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
          style={{ marginTop: -4 }}
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
            }, 50);
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
              setTimeout(() => {
                setUserPopoverOpen(true);
              }, 50);
            }
          }}
          onMouseLeave={(e) => {
            setTimeout(() => {
              if (!inPopoverRef.current) {
                setUserPopoverOpen(false);
              }
            }, 50);
          }}
        >
          {targetContent}
        </div>
      }
    />
  );
}
