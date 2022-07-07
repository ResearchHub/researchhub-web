import { useState } from "react";
import { breakpoints } from "../themes/screen";
import {
  getCurrMediaWidth,
  useEffectOnScreenResize,
} from "./useEffectOnScreenResize";

export function getIsOnMobileScreenSize(): boolean {
  const mobileScreenSizeThreshold = breakpoints.mobile.int;
  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(
    getCurrMediaWidth() < mobileScreenSizeThreshold
  );

  useEffectOnScreenResize({
    onResize: (currScreenSize: number): void =>
      setIsMobileScreen(currScreenSize < mobileScreenSizeThreshold),
  });

  return isMobileScreen;
}
