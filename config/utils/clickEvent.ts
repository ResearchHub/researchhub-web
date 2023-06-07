import { useEffect } from "react";

type IsOutsideClickArgs = {
  ref: any | null | undefined;
  clickedEl: Element;
  exclude?: Array<string>;
};

type useEffectHandleClickArgs = {
  ref: any | null | undefined;
  exclude?: Array<string>;
  onOutsideClick?: Function;
  onInsideClick?: Function;
};

export function isOutsideClick({
  ref,
  clickedEl,
  exclude = [],
}: IsOutsideClickArgs) {
  if (!ref.current) {
    console.log("[isOutsideClick] el is not defined");
    return false;
  }

  const isWithin = ref.current === clickedEl || ref.current?.contains(clickedEl);
  const clickOnExcluded = exclude.reduce(
    (prev, selector) =>
      Boolean(
        prev || clickedEl.closest(selector as keyof HTMLElementTagNameMap)
      ),
    false
  );

  return !(isWithin || clickOnExcluded);
}

export function useEffectHandleClick({
  ref,
  exclude = [],
  onOutsideClick,
  onInsideClick,
}: useEffectHandleClickArgs) {
  useEffect(() => {
    const _handleClick = (e) => {
      const _isOutsideClick = isOutsideClick({
        ref,
        clickedEl: e.target,
        exclude,
      });

      const _isInsideClick = ref && ref.current?.contains(e.target);
      if (_isOutsideClick) {
        onOutsideClick && onOutsideClick();
      } else if (_isInsideClick) {
        onInsideClick && onInsideClick();
      }
    };

    document.addEventListener("click", _handleClick);

    return () => {
      document.removeEventListener("click", _handleClick);
    };
  }, [ref]);
}
