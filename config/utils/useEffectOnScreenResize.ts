import { useEffect } from "react";

type Args = {
  onResize: (newMediaWidth: number) => void;
};

export function useEffectOnScreenResize({ onResize }: Args): void {
  useEffect((): void => {
    window.addEventListener("resize", (): void => {
      const newMediaWidth =
        window?.innerWidth ??
        document?.documentElement?.clientWidth ??
        document?.body?.clientWidth;
      onResize(newMediaWidth);
    });
  }, []);
}
