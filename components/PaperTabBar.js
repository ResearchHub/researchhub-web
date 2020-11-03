import { useState, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";
import { useStore } from "react-redux";

// Components
import ComponentWrapper from "./ComponentWrapper";
import Loader from "~/components/Loader/Loader";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors, { paperTabColors } from "~/config/themes/colors";
import { paperTabFont } from "~/config/themes/fonts";

const VIEW_TIMER = 3000; // 3 seconds

const PaperTabBar = (props) => {
  const store = useStore();
  const [selectedTab, setSelectedTab] = useState("main");
  const [tabs, setTabs] = useState(props.activeTabs.map(formatTabs));
  const { scrollView } = props;
  var timer;

  useEffect(() => {
    window.addEventListener("scroll", scrollListener);

    return () => window.removeEventListener("scroll", scrollListener);
  }, [scrollListener]);

  useEffect(() => {
    clearTimer();
    startTimer();
  }, [selectedTab]);

  useEffect(() => {
    setTabs(props.activeTabs.map(formatTabs));
  }, [props.activeTabs.length]);

  useEffect(() => {
    function getActiveTabs() {
      let tabs = [
        { href: "main", label: "main" },
        { href: "takeaways", label: "key takeaways" },
      ];

      tabs.push({ href: "summary", label: "description" });
      tabs.push({ href: "comments", label: "comments" });
      // tabs.push({ href: "figures", label: "figures" });
      tabs.push({ href: "paper", label: "Paper PDF" });
      // // tabs.push({ href: "citations", label: "cited by" });
      // tabs.push({ href: "limitations", label: "limitations" });
      return tabs;
    }
    if (props.showAllSections) {
      setTabs(getActiveTabs().map(formatTabs));
    }
  }, [props.showAllSections]);

  const startTimer = () => {
    timer = setTimeout(() => {
      trackEvent("scroll", selectedTab);
    }, VIEW_TIMER);
  };

  const clearTimer = () => {
    clearTimeout(timer);
  };

  const getCoords = (elem) => {
    // crossbrowser version
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    var top = box.top + scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
  };

  const calculateOffset = (id, offset) => {
    let offsetElement = document.getElementById(id);
    if (!offsetElement) {
      return 100000000;
    }
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let value =
      getCoords(offsetElement).top + offsetElement.offsetHeight + offset;
    return value;
  };

  function scrollListener() {
    if (!scrollView) {
      setSelectedTab("main");
      return;
    }

    let navbarHeight = props.paperTabsRef.current
      ? props.paperTabsRef.current.clientHeight + 80
      : 139;

    if (window.scrollY < 200) {
      setSelectedTab("main");
    } else if (
      window.scrollY <= calculateOffset("takeaways-tab", -navbarHeight)
    ) {
      setSelectedTab("key takeaways");
    } else if (
      document.getElementById("summary-tab") &&
      window.scrollY <= calculateOffset("summary-tab", -navbarHeight)
    ) {
      setSelectedTab("summary");
      if (window.outerWidth < 667) {
        let paperNavigation = document.getElementById("paper-navigation");
        paperNavigation.scroll({
          left: 0,
          behavior: "smooth",
        });
      }
    } else if (
      window.scrollY <= calculateOffset("comments-tab", -navbarHeight)
    ) {
      setSelectedTab("comments");
      if (window.outerWidth < 667) {
        let paperNavigation = document.getElementById("paper-navigation");
        paperNavigation.scroll({
          left: paperNavigation.offsetWidth,
          behavior: "smooth",
        });
      }
    }
    // else if (
    //   window.scrollY <= calculateOffset("figures-tab", -navbarHeight)
    // ) {
    //   setSelectedTab("figures");
    // }
    else if (window.scrollY <= calculateOffset("paper-tab", -navbarHeight)) {
      setSelectedTab("Paper PDF");
    }
    // else if (
    //   window.scrollY <= calculateOffset("citedby-tab", -navbarHeight)
    // ) {
    //   setSelectedTab("citations");
    // }
    // else if (
    //   window.scrollY <= calculateOffset("limitations-tab", -navbarHeight)
    // ) {
    //   setSelectedTab("limitations");
    // }
    else {
      // setSelectedTab("key takeaways");
    }
  }

  function formatTabs(tab) {
    tab.key = `nav-link-${tab.href}`;
    return tab;
  }

  function trackEvent(interaction, label) {
    let auth = store.getState().auth;
    let user;
    if (auth.isLoggedIn) {
      user = auth.user;
    }
    let paperId = props.paper.id;
    let googlePayload = {
      paper: paperId,
      interaction,
      item: {
        name: "tab",
        value: label,
      },
      utc: new Date(),
    };

    let ampPayload = {
      event_type: "paper_tab",
      user_id: user ? user.id : null,
      time: +new Date(),
      event_properties: {
        interaction,
        tab_name: label,
        paper: paperId,
      },
    };

    fetch(
      API.GOOGLE_ANALYTICS({ ignorePaper: true, ignoreUser: true }),
      API.POST_CONFIG(googlePayload)
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {});

    fetch(API.AMP_ANALYTICS, API.POST_CONFIG(ampPayload))
      .then(Helpers.checkStatus)
      .then((res) => {});
  }

  function scrollToPage(label) {
    setSelectedTab(label);
    if (label === "main") {
      window.scrollTo({
        behavior: "auto",
        top: 0,
      });
    }
    trackEvent("click", label);
  }

  function renderCount(label, selected) {
    var count, loading;
    switch (label) {
      case "comments":
        count = props.discussionCount && props.discussionCount;
        loading = false;
        break;
      case "figures":
        count = props.figureCount && props.figureCount;
        loading = !props.fetchedFigures;
        break;
      case "cited-by":
        count = props.referencedByCount && props.referencedByCount;
        loading = props.loadingReferencedBy;
        break;
      default:
        break;
    }

    if (count) {
      return (
        <Count
          amount={count}
          isSelected={selected === label}
          loading={loading}
        />
      );
    }
  }

  function renderPreregistrationTag() {
    if (props.paper && props.paper.paper_type === "PRE_REGISTRATION") {
      return (
        <div className={css(styles.preRegContainer)}>
          <img src="/static/icons/wip.png" className={css(styles.preRegIcon)} />
          Funding Request
        </div>
      );
    }
    return null;
  }

  function renderTab({ key, href, label, ui }, selected, index) {
    let isSelected = false;
    let classNames = [styles.tab];
    if (label === selected || href === selected) {
      isSelected = true;
      classNames.push(styles.selected);
    }

    if (index === 2) {
      classNames.push(styles.lastTab);
    }
    return (
      <a
        href={`#${href}`}
        className={css(styles.tag)}
        key={`paper_tab_bar_${index}`}
      >
        <div className={css(classNames)} onClick={() => scrollToPage(label)}>
          {label} {ui && ui(isSelected)}
          {renderCount(label, selected)}
        </div>
      </a>
    );
  }

  return (
    <div className={css(styles.container)} id="paper-navigation">
      <ComponentWrapper overrideStyle={styles.componentWrapper}>
        <div className={css(styles.tabContainer)}>
          {tabs.map((tab, index) => renderTab(tab, selectedTab, index))}
        </div>
        {renderPreregistrationTag()}
      </ComponentWrapper>
    </div>
  );
};

const Count = (props) => {
  const { amount, isSelected, loading } = props;
  if (amount < 1) {
    return <span id="discussion_count"></span>;
  }
  return (
    <UIStyling isSelected={isSelected} loading={loading}>
      <span id="discussion_count" className={css(styles.count)}>
        {loading ? (
          <Loader
            key={"discussionLoader"}
            loading={true}
            size={4}
            color={paperTabColors.FONT}
            containerStyle={styles.customLoader}
            // type={'beat'}
          />
        ) : (
          amount
        )}
      </span>
    </UIStyling>
  );
};

const UIStyling = (props) => {
  const { isSelected, label, loading } = props;
  return (
    <span
      id={"count_border"}
      className={css(
        styles.ui,
        loading && styles.loading,
        isSelected && styles.selectedUi
      )}
    >
      {props.children}
    </span>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    background: "#fff",
    borderBottom: "1.5px solid #F0F0F0",
    overflow: "auto",
  },
  tabContainer: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-start",
    minWidth: 200,
  },
  firstTab: {
    paddingLeft: 0,
  },
  tab: {
    color: paperTabColors.FONT,
    fontFamily: paperTabFont,
    padding: "1rem",
    textAlign: "center",
    textDecoration: "none",
    textTransform: "capitalize",
    whiteSpace: "nowrap",

    "@media only screen and (max-width: 767px)": {
      padding: 16,
    },

    "@media only screen and (min-width: 1288px)": {
      marginRight: 0,
    },
    ":hover": {
      color: paperTabColors.HOVER_FONT,
      cursor: "pointer",
    },
    ":hover #count_border": {
      borderColor: colors.BLACK(),
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 13,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 12,
      padding: "16px 8px 16px 8px",
    },
  },
  lastTab: {
    marginRight: 0,
    "@media only screen and (min-width: 1288px)": {
      marginRight: 0,
    },
  },
  count: {
    padding: "3px 5px",
    borderRadius: 3,
    fontSize: 14,
    "@media only screen and (max-width: 415px)": {
      fontSize: 13,
      padding: "3px 5px",
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 11,
    },
  },
  ui: {
    border: "1px solid #AAA7B9",
    borderRadius: 3,
  },
  loading: {
    padding: 0,
    width: "unset",
  },
  customLoader: {
    display: "unset",
  },
  selectedUi: {
    borderColor: colors.PURPLE(1),
  },
  selected: {
    color: paperTabColors.SELECTED,
    borderBottom: "solid 3px",
    borderColor: paperTabColors.SELECTED,
  },
  tag: {
    color: "unset",
    textDecoration: "unset",
    display: "flex",
    justifyContent: "center",
  },
  componentWrapper: {
    position: "relative",
  },
  preRegContainer: {
    display: "flex",
    alignItems: "center",
    position: "absolute",
    right: 0,
    bottom: 4,
    paddingBottom: "1rem",
    color: "rgba(36, 31, 58, 0.5)",
    fontSize: 16,
    "@media only screen and (max-width: 767px)": {
      display: "none",
    },
  },
  preRegIcon: {
    height: 15,
    marginRight: 8,
    "@media only screen and (max-width: 415px)": {
      height: 15,
    },
  },
});

export default PaperTabBar;
