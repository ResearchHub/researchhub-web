type IsOutsideClickArgs = {
  el: Element | null | undefined,
  clickedEl: Element,
  exclude?: Array<String>,
}

const isOutsideClick = ({ el, clickedEl, exclude = [] }: IsOutsideClickArgs) => {
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

export default isOutsideClick;
