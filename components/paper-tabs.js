import Link from "next/link";
import { StyleSheet, css } from "aphrodite";
import { tabBarColors } from "~/config/themes/colors";

const PaperTabs = (props) => {
  const selectedTab = props.selectedTab;
  return (
    <div className={css(styles.container)}>
      <div className={css(styles.tabContainer)}>
        {tabs.map((link) => renderTabs(link, selectedTab))}
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

function renderTabs({ key, href, label }, selected) {
  let classNames = [styles.tab];

  if (href === selected) {
    classNames.push(styles.selected);
  }

  return (
    <div key={key} className={css(classNames)}>
      <Link href={href}>
        <div className={css(styles.link)}>{label}</div>
      </Link>
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    background: tabBarColors.BACKGROUND,
  },
  tabContainer: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-start",
    minWidth: 200,
    maxWidth: "70%",
  },
  tab: {
    color: tabBarColors.TEXT,
    padding: "1rem",
    marginRight: "80px",
  },
  link: {
    textAlign: "center",
    textDecoration: "none",
    textTransform: "capitalize",
  },
  selected: {
    color: tabBarColors.SELECTED,
    borderBottom: "solid 3px",
    borderColor: tabBarColors.SELECTED,
  },
});

export default PaperTabs;
