import Link from "next/link";
import { StyleSheet, css } from "aphrodite";
import { paperTabColors } from "~/config/themes/colors";
import { paperTabFont } from "~/config/themes/fonts";

const PaperTabBar = (props) => {
  const selectedTab = props.selectedTab;
  const { baseUrl } = props;
  return (
    <div className={css(styles.container)}>
      <div className={css(styles.tabContainer)}>
        {tabs.map((link) => renderTabs(link, selectedTab, baseUrl))}
      </div>
    </div>
  );
};

const tabs = [
  { href: "summary", label: "summary" },
  { href: "discussion", label: "discussions" },
  { href: "full", label: "full paper" },
  { href: "citations", label: "citations" },
].map(formatTabs);

function formatTabs(tab) {
  tab.key = `nav-link-${tab.href}-${tab.label}`;
  return tab;
}

function renderTabs({ key, href, label }, selected, baseUrl) {
  let classNames = [styles.tab];

  if (href === selected) {
    classNames.push(styles.selected);
  }

  return (
    <Link
      key={key}
      href={`/paper/[paperId]/[tabName]`}
      as={`/paper/${baseUrl}/${href}`}
      prefetch
    >
      <div className={css(classNames)}>
        <div className={css(styles.link)}>{label}</div>
      </div>
    </Link>
  );
}

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
    maxWidth: "70%",
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
