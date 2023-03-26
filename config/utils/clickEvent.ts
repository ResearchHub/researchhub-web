import { useEffect } from "react";

type IsOutsideClickArgs = {
  el: Element | null | undefined,
  clickedEl: Element,
  exclude?: Array<String>,
}

type useEffectHandleClickArgs = {
  el: Element | null | undefined,
  exclude?: Array<String>,
  onOutsideClick?: Function,
  onInsideClick?: Function
}

export function isOutsideClick({ el, clickedEl, exclude = [] }: IsOutsideClickArgs){
  if (!el) {
    return false;
  }

  const isWithin = el === clickedEl || el?.contains(clickedEl);
  const clickOnExcluded = exclude.reduce(
    (prev, selector) => Boolean(prev || clickedEl.closest(selector as keyof HTMLElementTagNameMap)),
    false
  );

  return !(isWithin || clickOnExcluded);
}

export function useEffectHandleClick({ el, exclude = [], onOutsideClick, onInsideClick }: useEffectHandleClickArgs) {

  useEffect(() => {
    const _handleClick = (e) => {
      const _isOutsideClick = isOutsideClick({
        el,
        clickedEl: e.target,
        exclude,
      });

      const _isInsideClick = el && el.contains(e.target);
      if (_isOutsideClick) {
        onOutsideClick && onOutsideClick();
      }
      else if (_isInsideClick) {
        onInsideClick && onInsideClick();
      }
    };

    document.addEventListener("click", _handleClick);

    return () => {
      document.removeEventListener("click", _handleClick);
    };
  }, [el]);  
}



