import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { StyleSheet, css } from "aphrodite";
import colors, { paperTabColors } from "~/config/themes/colors";
import { paperTabFont } from "~/config/themes/fonts";
import Loader from "~/components/Loader/Loader";

// Components
import ComponentWrapper from "./ComponentWrapper";

// Config
import icons from "~/config/themes/icons";

const TabBar = (props) => {
  const selectedTab = props.selectedTab;
  const { dynamic_href, fetching } = props;
  const [position, setPosition] = useState(0);
  const [atEnd, toggleAtEnd] = useState(false);

  const tabs = props.tabs.map(formatTabs);
  const scrollContainer = useRef();

  useEffect(() => {
    if (scrollContainer && scrollContainer.current) {
      scrollContainer.current.addEventListener("scroll", setScrollPosition);
      return () => {
        scrollContainer.current.removeEventListener(
          "scroll",
          setScrollPosition
        );
      };
    }
  });

  function setScrollPosition(e) {
    let element = e.target;
    setPosition(element.scrollLeft);
    isAtEnd(element);
  }

  function isAtEnd(element) {
    if (!element) return;

    toggleAtEnd(
      element.scrollWidth - element.scrollLeft === element.clientWidth
    );
  }

  function navigateLeft() {
    autoScroll(scrollContainer.current, -300, 300);
  }

  function navigateRight() {
    autoScroll(scrollContainer.current, 300, 300);
  }

  function autoScroll(element, change, duration) {
    let start = element.scrollLeft,
      currentTime = 0,
      increment = 20;

    const _easeInOutQuad = function(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    };

    const _animateScroll = () => {
      currentTime += increment;
      let val = _easeInOutQuad(currentTime, start, change, duration);
      // setPosition(val);
      element.scrollLeft = val;
      if (currentTime < duration) {
        setTimeout(_animateScroll, increment);
      }
    };

    _animateScroll();
  }

  return (
    <div className={css(styles.container)}>
      <ComponentWrapper overrideStyle={styles.componentWrapper}>
        <div className={css(styles.navbuttonContainer, styles.left)}>
          <div
            className={css(styles.navbutton, position > 5 && styles.reveal)}
            onClick={navigateLeft}
          >
            <i className="far fa-angle-left" />
          </div>
        </div>
        <div className={css(styles.tabContainer)} ref={scrollContainer}>
          {tabs.map((tab) => {
            if (tab.label === "transactions" || tab.label === "boosts") {
              let { user, author } = props;
              if (author.user !== user.id) {
                return null;
              }
            }
            return renderTab(
              tab,
              selectedTab,
              dynamic_href,
              props.fetching,
              props.author.id
            );
          })}
        </div>
        <div className={css(styles.navbuttonContainer, styles.right)}>
          <div
            className={css(styles.navbutton, !atEnd && styles.reveal)}
            onClick={navigateRight}
          >
            <i className="far fa-angle-right" />
          </div>
        </div>
      </ComponentWrapper>
    </div>
  );
};

function formatTabs(tab) {
  tab.key = `nav-link-${tab.href}`;
  return tab;
}

function renderTab(
  { key, href, label, showCount, count },
  selected,
  dynamic_href,
  fetching,
  userId
) {
  let isSelected = false;
  let classNames = [styles.tab];

  if (href === selected) {
    isSelected = true;
    classNames.push(styles.selected);
  }

  return (
    <Link key={key} href={dynamic_href} as={`/user/${userId}/${href}`}>
      <div className={css(classNames)}>
        <div className={css(styles.link)}>
          {label}{" "}
          {showCount && (
            <Count
              isSelected={isSelected}
              amount={count()}
              fetching={fetching}
            />
          )}
        </div>
      </div>
    </Link>
  );
}

const Count = (props) => {
  const { amount, isSelected, fetching } = props;
  // if (amount < 1) {
  //   return <span id="discussion_count"></span>;
  // }

  return (
    <UIStyling isSelected={isSelected}>
      <span
        id="discussion_count"
        className={css(styles.count, fetching & styles.loaderContainer)}
      >
        {fetching ? (
          <Loader
            size={4}
            loading={true}
            containerStyle={styles.loaderStyle}
            color={paperTabColors.FONT}
          />
        ) : amount > 0 ? (
          amount
        ) : (
          0
        )}
      </span>
    </UIStyling>
  );
};

const UIStyling = (props) => {
  const { isSelected, label } = props;
  return <span className={css(styles.ui)}>{props.children}</span>;
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    overflow: "auto",
    borderBottom: "1px solid #F0F0F0",
  },
  componentWrapper: {
    position: "relative",
    overflow: "visible",
  },
  tabContainer: {
    display: "flex",
    width: "100%",
    minWidth: 450,
    justifyContent: "flex-start",
    overflowX: "scroll",
    "::-webkit-scrollbar": {
      display: "none",
    },
    "-ms-overflow-style": "none",
    scrollbarWidth: "none",
  },
  firstTab: {
    paddingLeft: 0,
  },
  tab: {
    color: "rgba(36, 31, 58, .6)",
    fontWeight: 500,
    padding: "1rem",
    minWidth: "max-content",
    "@media only screen and (min-width: 768px)": {
      marginRight: 28,
    },
    ":hover": {
      color: colors.PURPLE(1),
      cursor: "pointer",
    },
  },
  count: {
    padding: "3px 8px",
    borderRadius: 3,
    fontSize: 14,
  },
  ui: {
    border: "1px solid rgba(36, 31, 58, 0.1)",
    background: "rgba(36, 31, 58, 0.03)",
    color: "#241F3A",
    borderRadius: 3,
    marginLeft: 5,
  },
  selectedUi: {
    borderColor: colors.PURPLE(1),
  },
  link: {
    textAlign: "center",
    textDecoration: "none",
    textTransform: "capitalize",
  },
  selected: {
    color: colors.PURPLE(1),
    borderBottom: "solid 3px",
    borderColor: colors.PURPLE(1),
  },
  loaderContainer: {
    padding: 0,
    width: "unset",
  },
  loaderStyle: {
    display: "unset",
  },
  navbuttonContainer: {
    // background:
    //   "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.8) 40%, rgb(255, 255, 255) 100%)",
    background: "rgba(255, 255, 255, 0.4)",
    boxShadow: "0 0 4px rgba(255, 255, 255, 5)",
  },
  navbutton: {
    justifyContent: "center",
    alignItems: "center",
    fontSize: 18,
    fontWeight: 500,
    height: 35,
    width: 35,
    borderRadius: "50%",
    border: "1px solid rgba(36, 31, 58, 0.1)",
    boxShadow: "0 0 4px rgba(0, 0, 0, 0.14)",
    background: "#FFF",
    cursor: "pointer",
    color: colors.BLUE(),
    display: "none",
    zIndex: 2,
    ":hover": {
      boxShadow: "0 0 8px rgba(0, 0, 0, 0.14)",
    },
    "@media only screen and (max-width: 415px)": {
      display: "none",
    },
  },
  left: {
    position: "absolute",
    left: -25,
    top: 8,
    "@media only screen and (max-width: 768px)": {
      left: 0,
    },
  },
  right: {
    position: "absolute",
    right: -25,
    top: 8,
    "@media only screen and (max-width: 768px)": {
      right: 0,
    },
  },
  reveal: {
    display: "flex",
  },
});

export default TabBar;
