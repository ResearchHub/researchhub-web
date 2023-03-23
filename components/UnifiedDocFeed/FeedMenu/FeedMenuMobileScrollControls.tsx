import { useState, useEffect } from "react";
import useEffectShowHorizontalMobileScroll from "../utils/useEffectShowHorizontalMobileScroll";
import { css, StyleSheet } from "aphrodite";

const FeedMenuMobileScrollControls = ({ tabsContainerRef, viewportWidth }) => {
  const [showMobileLeftScroll, setShowMobileLeftScroll] = useState(false);
  const [showMobileRightScroll, setShowMobileRightScroll] = useState(false);
  const [showMobileScrollNav, setShowMobileScrollNav] = useState(false);

  useEffect(() => {
    useEffectShowHorizontalMobileScroll({
      elem: tabsContainerRef?.current,
      handleShowScrollUI: setShowMobileScrollNav,
      handleShowLeftScrollBtn: setShowMobileLeftScroll,
      handleShowRightScrollBtn: setShowMobileRightScroll,
    });
  }, [tabsContainerRef]);

  useEffect(() => {
    const hasHorizontalScroll =
      tabsContainerRef.current.clientWidth <
      tabsContainerRef.current.scrollWidth;
    if (hasHorizontalScroll) {
      setShowMobileScrollNav(true);
      setShowMobileRightScroll(true);
    } else {
      setShowMobileLeftScroll(false);
      setShowMobileRightScroll(false);
      setShowMobileScrollNav(false);
    }
  }, [viewportWidth, tabsContainerRef]);

  return (
    <div>
      <div
        className={css(
          styles.mobileScrollNav,
          !showMobileScrollNav && styles.hideMobileScroll
        )}
      >
        <span
          className={css(
            styles.mobileScrollBtn,
            styles.mobileLeftScroll,
            !showMobileLeftScroll && styles.hideMobileScroll
          )}
          onClick={() =>
            // @ts-ignore
            tabsContainerRef.current.scrollBy({ left: -60, behavior: "smooth" })
          }
        >
          {<i className="fa-regular fa-chevron-left"></i>}
        </span>
        <span
          className={css(
            styles.mobileScrollBtn,
            styles.mobileRightScroll,
            !showMobileRightScroll && styles.hideMobileScroll
          )}
          onClick={() => {
            // @ts-ignore
            tabsContainerRef.current.scrollBy({ left: 60, behavior: "smooth" });
          }}
        >
          {<i className="fa-regular fa-chevron-right"></i>}
        </span>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  mobileScrollNav: {},
  mobileScrollBtn: {
    position: "absolute",
    zIndex: 2,
  },
  hideMobileScroll: {
    display: "none",
  },
  mobileLeftScroll: {
    left: 70,
    padding: "8px 24px 7px 8px",
    background:
      "linear-gradient(270deg, rgba(255, 255, 255, 0) 0px, rgb(255, 255, 255) 50%)",
  },

  mobileRightScroll: {
    right: 0,
    padding: "8px 8px 7px 24px",
    background:
      "linear-gradient(90deg, rgba(255, 255, 255, 0) 0px, rgb(255, 255, 255) 50%)",
  },
});

export default FeedMenuMobileScrollControls;
