import { ReactElement } from "react";
import ResearchHubPopover from "~/components/ResearchHubPopover";
import { RHUser } from "~/config/types/root_types";
import { genClientId } from "~/config/utils/id";
import UserPopover from "../UserPopover";

interface UserTooltipProps {
  setUserPopoverOpen: (isOpen: boolean) => void;
  isOpen: boolean;
  createdBy: RHUser | null;
  targetContent: ReactElement;
  inPopoverRef: React.MutableRefObject<boolean>;
}

export default function UserTooltip({
  setUserPopoverOpen,
  isOpen,
  createdBy,
  targetContent,
  inPopoverRef,
}: UserTooltipProps): ReactElement {
  return (
    <ResearchHubPopover
      containerStyle={{ zIndex: 100 }}
      positions={["bottom", "right", "top"]}
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
            inPopoverRef.current = false;
            setUserPopoverOpen(false);
          }}
          id={`user-popover-${genClientId()}`}
        >
          <UserPopover userId={createdBy?.id} />
        </div>
      }
      isOpen={isOpen}
      targetContent={targetContent}
    />
  );
}
