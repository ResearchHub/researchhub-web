import { useEffect } from "react";

type Args = {
  onResize: (getDisplayWidth: number) => void;
};

export const getCurrMediaWidth = (): number =>
  typeof window !== "undefined"
    ? window?.innerWidth ??
      document?.documentElement?.clientWidth ??
      document?.body?.clientWidth ??
      0
    : 0;

export function useEffectOnScreenResize({ onResize }: Args): void {
  const handleResize = (): void => {
    onResize(getCurrMediaWidth());
  };
  useEffect((): (() => void) => {
    window.addEventListener("resize", handleResize);
    return (): void => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
}
