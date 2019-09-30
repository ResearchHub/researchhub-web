import Link from "next/link";
import { StyleSheet, css } from "aphrodite";
import { paperTabColors } from "~/config/themes/colors";
import { paperTabFont } from "~/config/themes/fonts";

// Components
import ComponentWrapper from "./ComponentWrapper";

const PaperTabBar = (props) => {
  const selectedTab = props.selectedTab;
  const { baseUrl } = props;

  const tabs = [
    { href: "summary", label: "summary" },
    { href: "discussion", label: "discussions", ui: <Count amount={0} /> },
    { href: "full", label: "full paper" },
    { href: "citations", label: "citations" },
  ].map(formatTabs);

  return (
    <div className={css(styles.container)}>
      <ComponentWrapper>
        <div className={css(styles.tabContainer)}>
          {tabs.map((link) => renderTabs(link, selectedTab, baseUrl))}
        </div>
      </ComponentWrapper>
    </div>
  );
};

function formatTabs(tab) {
  tab.key = `nav-link-${tab.href}`;
  return tab;
}

function renderTabs({ key, href, label, ui }, selected, baseUrl) {
  const DYNAMIC_HREF = "/paper/[paperId]/[tabName]";
  let classNames = [styles.tab];

  if (href === selected) {
    classNames.push(styles.selected);
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
