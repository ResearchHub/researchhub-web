import React, { ReactChildren, SyntheticEvent, useCallback } from "react";

type Props = {
  children: ReactChildren;
  shouldAllowEventsToPassDown: boolean;
};

export default function PaperDraftEventCaptureWrap({
  children,
  shouldAllowEventsToPassDown,
}: Props) {
  const eventSilencer = useCallback(
    (event: SyntheticEvent) => {
      if (shouldAllowEventsToPassDown) {
        return event;
      } else {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
    },
    [shouldAllowEventsToPassDown]
  );
  return (
    <div
      onKeyDownCapture={eventSilencer}
      onKeyPressCapture={eventSilencer}
      onKeyUpCapture={eventSilencer}
      style={{ display: "block", height: "100%", width: "100%" }}
    >
      {children}
    </div>
  );
}
