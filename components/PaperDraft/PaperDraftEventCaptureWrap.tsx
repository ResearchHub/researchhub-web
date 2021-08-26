import { ReactChildren, SyntheticEvent, useCallback } from "react";

type Props = {
  children: ReactChildren;
  shouldAllowKeyEvents: boolean;
  shouldAllowMouseEvents: boolean;
};

export default function PaperDraftEventCaptureWrap({
  children,
  shouldAllowKeyEvents = false,
  shouldAllowMouseEvents = false,
}: Props) {
  const eventSilencer = useCallback(
    (shouldAllow) => (event: SyntheticEvent) => {
      if (!shouldAllow) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      return event;
    },
    []
  );
  return (
    <div
      onClickCapture={eventSilencer(shouldAllowMouseEvents)}
      onKeyDownCapture={eventSilencer(shouldAllowKeyEvents)}
      onKeyPressCapture={eventSilencer(shouldAllowKeyEvents)}
      onKeyUpCapture={eventSilencer(shouldAllowKeyEvents)}
      onMouseDownCapture={eventSilencer(shouldAllowMouseEvents)}
      onMouseUpCapture={eventSilencer(shouldAllowMouseEvents)}
      style={{ display: "block", height: "100%", width: "100%" }}
    >
      {children}
    </div>
  );
}
