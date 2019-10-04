import Link from "next/link";
import { StyleSheet, css } from "aphrodite";
import { paperTabColors } from "~/config/themes/colors";
import { paperTabFont } from "~/config/themes/fonts";

// Components
import ComponentWrapper from "./ComponentWrapper";
import colors from "../config/themes/colors";

const PaperTabBar = (props) => {
  const selectedTab = props.selectedTab;
  const { threadCount } = props;

  const tabs = [
    { href: "summary", label: "summary" },
    {
      href: "discussion",
      label: "discussions",
      ui: <Count amount={threadCount} />,
    },
    { href: "full", label: "full paper" },
    // TODO: Add citations tab
    // { href: "citations", label: "citations" },
  ].map(formatTabs);

  return (
    <div className={css(styles.container)}>
      <ComponentWrapper>
        <div className={css(styles.tabContainer)}>
          {tabs.map((tab) => renderTab(tab, selectedTab))}
        </div>
      </ComponentWrapper>
    </div>
  );
};

function formatTabs(tab) {
  tab.key = `nav-link-${tab.href}`;
  return tab;
}

function renderTab({ key, href, label, ui }, selected) {
  const DYNAMIC_HREF = "/paper/[paperId]/[tabName]";
  let classNames = [styles.tab];

  if (href === selected) {
    classNames.push(styles.selected);
  }

  return (
    <Link key={key} href={DYNAMIC_HREF} as={href}>
      <div className={css(classNames)}>
        <div className={css(styles.link)}>
          {label}{" "}
          {ui && (
            <span
              id={label + "_ui"}
              className={css(styles.ui, href === selected && styles.selectedUi)}
            >
              {ui}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

const Count = (props) => {
  const { amount } = props;
  if (amount < 1) {
    return null;
  }
  return <span className={css(styles.count)}>{amount}</span>;
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    background: paperTabColors.BACKGROUND,
  },
  tabContainer: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-start",
    "@media only screen and (max-width: 767px)": {
      justifyContent: "space-between",
    },
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
      marginRight: 28,
    },

    "@media only screen and (min-width: 1024px)": {
      marginRight: 45,
    },

    "@media only screen and (min-width: 1288px)": {
      marginRight: 80,
    },
    ":hover": {
      color: paperTabColors.HOVER_FONT,
      cursor: "pointer",
    },
  },
  count: {
    padding: "3px 8px",
    borderRadius: 3,
    fontSize: 14,
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
});

export default PaperTabBar;
