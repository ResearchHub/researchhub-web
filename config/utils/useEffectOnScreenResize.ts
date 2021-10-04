type Args = {
  onResize: (newMediaWidth: number) => void;
};

export function useEffectOnScreenResize({ onResize }: Args): void {
  window.addEventListener("resize", () => {
    const newMediaWidth =
      window?.innerWidth ??
      document?.documentElement?.clientWidth ??
      document?.body?.clientWidth;
    onResize(newMediaWidth);
  });
}
