import Link from "next/link";
import { StyleSheet, css } from "aphrodite";
import { paperTabColors } from "~/config/themes/colors";
import { paperTabFont } from "~/config/themes/fonts";

// Components
import ComponentWrapper from "./ComponentWrapper";

const PaperTabBar = (props) => {
  const selectedTab = props.selectedTab;
  const { baseUrl, threadCount } = props;

  const tabs = [
    { href: "summary", label: "summary" },
    {
      href: "discussion",
      label: "discussions",
      ui: <Count amount={threadCount} />,
    },
    { href: "full", label: "full paper" },
    { href: "citations", label: "citations" },
  ].map(formatTabs);

  return (
    <div className={css(styles.container)}>
      <ComponentWrapper>
        <div className={css(styles.tabContainer)}>
          {tabs.map((link, index) =>
            renderTabs(link, selectedTab, baseUrl, index)
          )}
        </div>
      </ComponentWrapper>
    </div>
  );
};

function formatTabs(tab) {
  tab.key = `nav-link-${tab.href}`;
  return tab;
}

function renderTabs({ key, href, label, ui }, selected, baseUrl, index) {
  const DYNAMIC_HREF = "/paper/[paperId]/[tabName]";
  let classNames = [styles.tab];

  if (href === selected) {
    classNames.push(styles.selected);
  }

  if (index === 0) {
    classNames.push(styles.firstTab);
  }

  return (
    <Link key={key} href={DYNAMIC_HREF} as={href}>
      <div className={css(classNames)}>
        <div className={css(styles.link)}>
          {label} {ui}
        </div>
      </div>
    </Link>
  );
}

const Count = (props) => {
  const { amount } = props;
  if (amount < 1) {
    return <span />;
  }
  return <span>{amount}</span>;
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
    minWidth: 200,
  },
  firstTab: {
    paddingLeft: 0,
  },
  tab: {
    color: paperTabColors.FONT,
    fontFamily: paperTabFont,
    padding: "1rem",
    marginRight: "80px",
    ":hover": {
      color: paperTabColors.HOVER_FONT,
      cursor: "pointer",
    },
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
