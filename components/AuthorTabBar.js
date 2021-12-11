import { useRef, useState, useEffect } from "react";
// import dynamic from 'next/dynamic'
import Link from "next/link";
import { StyleSheet, css } from "aphrodite";
import ScrollMenu from "react-horizontal-scrolling-menu";

// Components
import ComponentWrapper from "./ComponentWrapper";
import Loader from "~/components/Loader/Loader";
import ReactPlaceholder from "react-placeholder/lib";
import TabBarPlaceholder from "~/components/Placeholders/TabBarPlaceholder";

// Config
import icons from "~/config/themes/icons";
import colors, { paperTabColors } from "~/config/themes/colors";

const TabBar = (props) => {
  const { dynamic_href, fetching, showTabBar, selectedTab } = props;
  const [selected, setSelected] = useState(selectedTab);
  const menuRef = useRef();
  const tabs = props.tabs
    .map((tab) => formatTabs(tab, props))
    .filter((tab) => tab && tab);

  useEffect(() => {
    menuRef.current && menuRef.current.scrollTo(selected);
    setSelected(selectedTab);
  }, [selectedTab]);

  const menu = tabs.map((tab) => {
    if (tab) {
      return (
        <Tab
          tab={tab}
          key={tab.href}
          selected={selectedTab}
          dynamicHref={dynamic_href}
          fetching={fetching}
          authorId={props.author.id}
        />
      );
    }
  });

  const onSelect = (key) => {
    setSelected(key);
  };

  return (
    <div className={css(styles.container)}>
      <ComponentWrapper overrideStyle={styles.componentWrapper}>
        <ReactPlaceholder
          ready={showTabBar}
          showLoadingAnimation
          customPlaceholder={<TabBarPlaceholder color={"#EFEFEF"} />}
        >
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
            onSelect={onSelect}
            wheel={false}
            selected={selected}
            scrollToSelected={true}
          />
        </ReactPlaceholder>
      </ComponentWrapper>
    </div>
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

function formatTabs(tab, props) {
  if (tab.href === "transactions" || tab.href === "boosts") {
    const { user, author } = props;
    if (author.user !== user.id) {
      return;
    }
  }

  tab.key = `nav-link-${tab.href}`;
  return tab;
}

const Tab = (props) => {
  const { tab, selected, dynamicHref, fetching, authorId } = props;
  const { href, label } = tab;
  let classNames = [styles.tab];
  let isSelected = false;

  if (selected) {
    isSelected = true;
    classNames.push(styles.selected);
  }

  return (
    <Link
      href={dynamicHref}
      as={`/user/${authorId}/${href}`}
      shallow={true}
      replace={true}
      scroll={false}
    >
      <div
        className={css(classNames) + ` menu-item ${isSelected ? "active" : ""}`}
      >
        <div className={css(styles.link)}>{label} </div>
      </div>
    </Link>
  );
};

const styles = StyleSheet.create({
  componentWrapper: {
    display: "flex",
    justifyContent: "center",
    boxShadow:
      "inset 25px 0px 25px -25px rgba(255,255,255,1), inset -25px 0px 25px -25px rgba(255,255,255,1)",
  },
  container: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    overflow: "hidden",
    borderBottom: "1px solid #F0F0F0",
    background: "#FFF",
  },
  tabContainer: {
    display: "flex",
    width: "105%",
    justifyContent: "flex-start",
  },
  placeholder: {
    height: 54,
    color: "#FAFAFA",
  },
  firstTab: {
    paddingLeft: 0,
  },
  tab: {
    color: "rgba(36, 31, 58, .5)",
    fontWeight: 500,
    padding: "1rem",
    ":hover": {
      color: colors.PURPLE(1),
      cursor: "pointer",
    },
    "@media only screen and (min-width: 768px)": {
      marginRight: 28,
    },
  },
  selectedUi: {
    borderColor: colors.PURPLE(1),
  },
  link: {
    textAlign: "center",
    whiteSpace: "pre",
    textDecoration: "none",
    textTransform: "capitalize",
    display: "flex",
    alignItems: "center",
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
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
  arrowContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    maxHeight: 40,
    minHeight: 40,
    height: 40,
    maxWidth: 40,
    minWidth: 40,
    width: 40,
    fontSize: 20,
    borderRadius: "50%",
    background: "#FFF",
    boxSizing: "border-box",
    color: colors.PURPLE(),
    border: "1.5px solid rgba(151, 151, 151, 0.2)",
    cursor: "pointer",
    boxShadow: "0 0 15px rgba(255, 255, 255, 0.14)",
    ":hover": {
      background: "#FAFAFA",
    },
  },
  arrowLeft: {
    paddingRight: 2,
  },
  arrowRight: {
    paddingLeft: 5,
  },
});

export default TabBar;
