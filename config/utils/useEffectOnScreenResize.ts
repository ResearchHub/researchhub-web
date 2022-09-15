import { useEffect } from "react";
import { isServer } from "~/config/server/isServer";

type Args = {
  onResize: (getDisplayWidth: number) => void;
};

export const getCurrMediaWidth = (): number =>
  isServer()
    ? 0
    : typeof window !== "undefined"
    ? window?.innerWidth ??
      document?.documentElement?.clientWidth ??
      document?.body?.clientWidth ??
      0
    : 0;

export function useEffectOnScreenResize({ onResize }: Args): void {
  const isReadyToCalc = !isServer();
  const handleResize = (): void => {
    onResize(getCurrMediaWidth());
  };
  useEffect((): (() => void) => {
    if (isReadyToCalc) {
      handleResize();
      window.addEventListener("resize", handleResize);
    }
    return (): void => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isReadyToCalc]);
}
