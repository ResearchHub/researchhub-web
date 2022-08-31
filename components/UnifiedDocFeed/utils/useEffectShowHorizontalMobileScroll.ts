const useEffectShowHorizontalMobileScroll = ({
  elem,
  handleShowScrollUI,
  handleShowLeftScrollBtn,
  handleShowRightScrollBtn,
}) => {
  const _handleScroll = (event) => {
    const showMobileRightScroll =
      event.currentTarget.scrollWidth - event.currentTarget.scrollLeft !==
      event.currentTarget.offsetWidth;
    const showMobileLeftScroll = event.currentTarget.scrollLeft > 0;

    handleShowLeftScrollBtn(showMobileLeftScroll);
    handleShowRightScrollBtn(showMobileRightScroll);
  };

  if (elem) {
    const hasHorizontalScroll =
      elem.clientWidth <
      elem.scrollWidth;

    if (hasHorizontalScroll) {
      handleShowScrollUI(hasHorizontalScroll);
      handleShowRightScrollBtn(true);
    }

    elem.addEventListener("scroll", _handleScroll);
  }

  return () => {
    if (elem) {
      elem.removeEventListener("scroll", _handleScroll);
    }
  };
};

export default useEffectShowHorizontalMobileScroll;
