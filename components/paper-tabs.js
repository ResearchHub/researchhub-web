import Link from "next/link";
import { StyleSheet, css } from "aphrodite";

const PaperTabs = (props) => {
  const selectedTab = props.selectedTab;
  return (
    <nav>
      <ul>{tabs.map((link) => renderTabs(link, selectedTab))}</ul>
    </nav>
  );
};

const tabs = [
  { href: "summary", label: "summary" },
  { href: "discussion", label: "discussion" },
  { href: "full", label: "full paper" },
  { href: "citations", label: "citations" },
].map(formatTabs);

function formatTabs(tab) {
  tab.key = `nav-link-${tab.href}-${tab.label}`;
  return tab;
}

function renderTabs({ key, href, label }, selected) {
  let classNames = [];

  if (href === selected) {
    classNames.push(styles.selected);
  }

  return (
    <li key={key} className={css(classNames)}>
      <Link href={href}>
        <a>{label}</a>
      </Link>
    </li>
  );
}

const styles = StyleSheet.create({
  selected: {
    backgroundColor: "yellow",
  },
});

export default PaperTabs;
