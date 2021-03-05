import { useState, useEffect, useRef } from "react";
import { StyleSheet, css } from "aphrodite";
import { useStore } from "react-redux";
import ScrollMenu from "react-horizontal-scrolling-menu";

// Components
import ComponentWrapper from "./ComponentWrapper";
import Loader from "~/components/Loader/Loader";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import icons from "~/config/themes/icons";
import colors, { paperTabColors } from "~/config/themes/colors";
import { paperTabFont } from "~/config/themes/fonts";

const VIEW_TIMER = 3000; // 3 seconds

const PaperTabBar = (props) => {
  const { activeTab, setActiveTab, paperDraftExists } = props;
  const [tabs, setTabs] = useState(getPaperTabs());
  const menuRef = useRef();

  useEffect(() => {
    setTabs(getPaperTabs());
  }, [paperDraftExists]);

  // useEffect(() => {
  //   menuRef.current && menuRef.current.scrollTo(selected);
  // }, [activeTab])

  function getPaperTabs() {
    const paperTabs = [
      { href: "main", label: "main" },
      { href: "abstract", label: "abstract" },
      { href: "discussions", label: "discussions" },
      { href: "paper pdf", label: "Paper PDF" },
    ];

    if (paperDraftExists) {
      paperTabs.splice(2, 0, { href: "paper", label: "paper" });
    }

    return paperTabs;
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

  function renderPreregistrationTag() {
    if (props.paper && props.paper.paper_type === "PRE_REGISTRATION") {
      return (
        <div className={css(styles.preRegContainer)}>
          <img
            src="/static/icons/wip.png"
            className={css(styles.preRegIcon)}
            alt="Preregistration Icon"
          />
          Funding Request
        </div>
      );
    }
    return null;
  }

  const onClick = (key) => {
    if (typeof key !== "string") return;
    const [href, i] = key.split("-");

    const index = Number(i);

    setActiveTab(index);
    setTimeout(() => {
      activeTab !== index && setActiveTab(index);
    }, 20);
    // menuRef.current && menuRef.current.scrollTo(key);
  };

  function renderTab(tab, index) {
    const { key, href, label, ui } = tab;
    let isSelected = false;
    const classNames = [styles.tab];

    if (index === activeTab || index === activeTab) {
      isSelected = true;
      classNames.push(styles.selected);
    }

    return (
      <a href={`#${href}`} className={css(styles.tag)} key={`${href}-${index}`}>
        <div className={css(classNames)} onClick={onClick}>
          {label} {ui && ui(isSelected)}
        </div>
      </a>
    );
  }

  const menu = tabs.map(renderTab);

  return (
    <div className={css(styles.container)}>
      <ScrollMenu
        ref={menuRef}
        data={menu}
        arrowLeft={
          <NavigationArrow icon={icons.chevronLeft} direction={"left"} />
        }
        arrowRight={
          <NavigationArrow icon={icons.chevronRight} direction={"right"} />
        }
        menuStyle={styles.tabContainer}
        itemStyle={{ border: "none", highlight: "none", outline: "none" }}
        hideSingleArrow={true}
        onSelect={onClick}
        selected={activeTab}
        // scrollToSelected={true}
        alignCenter={true}
      />
      {/* {renderPreregistrationTag()} */}
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

export const NavigationArrow = ({ icon, direction, customStyles }) => {
  const classNames = [styles.arrowContainer];

  if (direction === "left") {
    classNames.push(styles.arrowLeft);
  } else {
    classNames.push(styles.arrowRight);
  }

  if (customStyles) {
    classNames.push(customStyles);
  }

  return <div className={css(classNames)}>{icon}</div>;
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-start",
    background: "#fff",
    borderBottom: "1.5px solid #F0F0F0",
    borderTop: "1.5px solid #F0F0F0",
    boxSizing: "border-box",
    padding: "0 20px 0 5px",
  },
  tabContainer: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-start",
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
    fontSize: 16,
    fontWeight: 500,
    "@media only screen and (max-width: 767px)": {
      padding: 16,
      fontSize: 14,
    },

    "@media only screen and (min-width: 1288px)": {
      marginRight: 0,
    },
    ":active": {
      color: colors.PURPLE(),
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
  //
  arrowContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 18,
    width: 20,
    maxWidth: 20,
    minWidth: 20,
    boxSizing: "border-box",
    color: colors.PURPLE(),
    cursor: "pointer",
  },
  arrowLeft: {
    paddingRight: 2,
  },
  arrowRight: {
    paddingLeft: 5,
  },
});

export default PaperTabBar;
