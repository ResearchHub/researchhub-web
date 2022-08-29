const useEffectForHorizontalScroll = ({
  tabsContainerRef,
  setShowMobileLeftScroll,
  setShowMobileRightScroll,
  setShowMobileScrollNav,
}) => {
  const _handleScroll = (event) => {
    const showMobileRightScroll =
      event.currentTarget.scrollWidth - event.currentTarget.scrollLeft !==
      event.currentTarget.offsetWidth;
    const showMobileLeftScroll = event.currentTarget.scrollLeft > 0;

    setShowMobileLeftScroll(showMobileLeftScroll);
    setShowMobileRightScroll(showMobileRightScroll);
  };

  if (tabsContainerRef?.current) {
    const hasHorizontalScroll =
      tabsContainerRef.current.clientWidth <
      tabsContainerRef.current.scrollWidth;

    if (hasHorizontalScroll) {
      setShowMobileScrollNav(hasHorizontalScroll);
      setShowMobileRightScroll(true);
    }

    tabsContainerRef.current.addEventListener("scroll", _handleScroll);
  }

  return () => {
    if (tabsContainerRef?.current) {
      tabsContainerRef.current.removeEventListener("scroll", _handleScroll);
    }
  };
};

export default useEffectForHorizontalScroll;
