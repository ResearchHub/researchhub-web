import { useState, useEffect } from "react";
import Link from "next/link";
import { StyleSheet, css } from "aphrodite";
import colors, { paperTabColors } from "~/config/themes/colors";
import { paperTabFont } from "~/config/themes/fonts";

// Components
import ComponentWrapper from "./ComponentWrapper";

const PaperTabBar = (props) => {
  // const selectedTab = props.selectedTab;
  const [selectedTab, setSelectedTab] = useState(
    props.tabName ? props.tabName : "main"
  );
  const {
    keyTakeawayRef,
    descriptionRef,
    discussionRef,
    paperPdfRef,
    citationRef,
    scrollView,
  } = props;

  useEffect(() => {
    setSelectedTab(props.tabName);
    scrollToPage(props.tabName);
  }, [props.tabName]);

  useEffect(() => {
    window.addEventListener("scroll", scrollListener);

    return () => window.removeEventListener("scroll", scrollListener);
  }, [scrollListener]);

  function scrollListener() {
    if (!scrollView) {
      setSelectedTab("main");
      return;
    }
    if (window.scrollY >= 1399 + 350) {
      setSelectedTab("Paper PDF");
    } else if (window.scrollY >= 1170 + 350) {
      setSelectedTab("cited by");
    } else if (window.scrollY >= 739 + 350) {
      setSelectedTab("discussions");
    } else if (window.scrollY >= 346 + 350) {
      setSelectedTab("description");
    } else if (window.scrollY >= 25 + 350) {
      setSelectedTab("key takeaway");
    } else if (window.scrollY <= 10 + 350) {
      setSelectedTab("main");
    }
  }

  const tabs = [
    { href: "main", label: "main" },
    { href: "takeaways", label: "key takeaway" },
    { href: "description", label: "description" },
    { href: "discussions", label: "discussions" },
    { href: "citations", label: "cited by" },
    { href: "paper", label: "Paper PDF" },
  ].map(formatTabs);

  function formatTabs(tab) {
    tab.key = `nav-link-${tab.href}`;
    return tab;
  }

  function scrollToPage(label) {
    let { setSticky, sticky, paperCardRef } = props;
    let offset = paperCardRef.current.clientHeight + 100;

    // setSelectedTab(label);
    if (label === "main" || label === "summary") {
      window.scrollTo({
        behavior: "smooth",
        top: 0,
      });
    }
    // if (label === "key takeaway" || label === 'key-takeaway') {
    //   sticky
    //     ? window.scrollTo({
    //         behavior: "smooth",
    //         top: keyTakeawayRef.current.offsetTop - offset,
    //       })
    //     : window.scrollTo({
    //         behavior: "smooth",
    //         top: keyTakeawayRef.current.offsetTop - offset + 80,
    //       });
    // } else if (label === "description") {
    //   sticky
    //     ? window.scrollTo({
    //         behavior: "smooth",
    //         top: descriptionRef.current.offsetTop - offset,
    //       })
    //     : window.scrollTo({
    //         behavior: "smooth",
    //         top: descriptionRef.current.offsetTop - offset + 80,
    //       });
    // } else if (label === "discussions" || label === 'discussion') {
    //   sticky
    //     ? window.scrollTo({
    //         behavior: "smooth",
    //         top: discussionRef.current.offsetTop - offset,
    //       })
    //     : window.scrollTo({
    //         behavior: "smooth",
    //         top: discussionRef.current.offsetTop - offset + 80,
    //       });
    // } else if (label === "cited by" || label === 'citations') {
    //   sticky
    //     ? window.scrollTo({
    //         behavior: "smooth",
    //         top: citationRef.current.offsetTop - offset,
    //       })
    //     : window.scrollTo({
    //         behavior: "smooth",
    //         top: citationRef.current.offsetTop - offset + 80,
    //       });
    // } else if (label === "Paper PDF" || label === 'full' ) {
    //   sticky
    //     ? window.scrollTo({
    //         behavior: "smooth",
    //         top: paperPdfRef.current.offsetTop - offset,
    //       })
    //     : window.scrollTo({
    //         behavior: "smooth",
    //         top: paperPdfRef.current.offsetTop - offset + 80,
    //       });
    // }
  }

  function renderTab({ key, href, label, ui }, selected, index) {
    const DYNAMIC_HREF = "/paper/[paperId]/[tabName]";

    let isSelected = false;
    let classNames = [styles.tab];
    console.log("selected", selected);
    if (label === selected || href === selected) {
      isSelected = true;
      classNames.push(styles.selected);
    }

    if (index === 2) {
      classNames.push(styles.lastTab);
    }
    // href = `/paper/${props.baseUrl}/${href}/`};
    return (
      // <Link key={key} href={DYNAMIC_HREF} as={`/paper/${props.baseUrl}/${href}/`}>
      <a href={`#${href}`} className={css(styles.tag)}>
        <div
          className={css(classNames)}
          onClick={() => scrollToPage(label)}
          key={`paper_tab_bar_${index}`}
        >
          <div className={css(styles.link)}>
            {label} {ui && ui(isSelected)}
          </div>
        </div>
      </a>
      // </Link>
    );
  }

  return (
    <div className={css(styles.container)}>
      <ComponentWrapper>
        <div className={css(styles.tabContainer)}>
          {tabs.map((tab, index) => renderTab(tab, selectedTab, index))}
        </div>
      </ComponentWrapper>
    </div>
  );
};

const Count = (props) => {
  const { amount, isSelected } = props;
  if (amount < 1) {
    return <span id="discussion_count"></span>;
  }
  return (
    <UIStyling isSelected={isSelected}>
      <span id="discussion_count" className={css(styles.count)}>
        {amount}
      </span>
    </UIStyling>
  );
};

const UIStyling = (props) => {
  const { isSelected, label } = props;
  return (
    <span
      id={"count_border"}
      className={css(styles.ui, isSelected && styles.selectedUi)}
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
    // background: paperTabColors.BACKGROUND,
    background: "#fff",
    borderBottom: "1.5px solid #F0F0F0",
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

    "@media only screen and (min-width: 768px)": {
      // marginRight: 28,
    },

    "@media only screen and (min-width: 1024px)": {
      // marginRight: 45,
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
    padding: "3px 8px",
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
  selectedUi: {
    borderColor: colors.PURPLE(1),
  },
  link: {
    textAlign: "center",
    textDecoration: "none",
    textTransform: "capitalize",
  },
  selected: {
    color: paperTabColors.SELECTED,
    borderBottom: "solid 3px",
    borderColor: paperTabColors.SELECTED,
  },
  tag: {
    color: "unset",
    textDecoration: "unset",
  },
});

export default PaperTabBar;
