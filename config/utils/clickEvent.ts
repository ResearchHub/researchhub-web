import { useEffect } from "react";

type IsOutsideClickArgs = {
  ref: any | null | undefined;
  clickedEl: Element;
  el?: any;
  exclude?: Array<string>;
};

type useEffectHandleClickArgs = {
  ref?: any | null | undefined;
  el?: any;
  exclude?: Array<string>;
  onOutsideClick?: Function;
  onInsideClick?: Function;
};

export function isOutsideClick({
  ref,
  clickedEl,
  el,
  exclude = [],
}: IsOutsideClickArgs) {
  const _el = (ref && ref.current) || el;
  if (!_el) return;

  const isWithin = _el.contains(clickedEl);
  const clickOnExcluded = exclude.reduce(
    (prev, selector) =>
      Boolean(
        prev || clickedEl.closest(selector as keyof HTMLElementTagNameMap)
      ),
    false
  );

  return clickedEl.isConnected && !(isWithin || clickOnExcluded);
}

export function useEffectHandleClick({
  ref,
  el,
  exclude = [],
  onOutsideClick,
  onInsideClick,
}: useEffectHandleClickArgs) {
  useEffect(() => {
    const _handleClick = (e) => {
      const _isOutsideClick = isOutsideClick({
        ref,
        el,
        clickedEl: e.target,
        exclude,
      });

      const _el = (ref && ref.current) || el;
      if (!_el) return;

      console.log("_el", _el);
      console.log("e.target", e.target);
      console.log("e.target", e.target.isConnected);

      const _isInsideClick = _el?.contains(e.target) && e.target.isConnected;
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
  }, [ref, el]);
}
