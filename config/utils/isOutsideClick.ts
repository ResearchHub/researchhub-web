import { useEffect } from "react";

type IsOutsideClickArgs = {
  el: Element | null | undefined,
  clickedEl: Element,
  exclude?: Array<String>,
}

type useEffectHandleOutsideClickArgs = {
  el: Element | null | undefined,
  exclude?: Array<String>,
  onOutsideClick: Function,
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

export function useEffectHandleOutsideClick({ el, exclude = [], onOutsideClick }: useEffectHandleOutsideClickArgs) {

  useEffect(() => {
    const _handleClick = (e) => {
      const _isOutsideClick = isOutsideClick({
        el,
        clickedEl: e.target,
        exclude,
      });

      if (_isOutsideClick) {
        onOutsideClick();
      }
    };

    document.addEventListener("click", _handleClick);

    return () => {
      document.removeEventListener("click", _handleClick);
    };
  }, [el]);  
}

