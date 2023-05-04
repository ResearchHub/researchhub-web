import { NextRouter } from "next/router";

export const tabs: Array<{
  label: string;
  value: string;
  isSelected?: boolean;
}> = [
  {
    label: "Paper",
    value: "",
  },
  {
    label: "Conversation",
    value: "conversation",
  },
  {
    label: "Bounties",
    value: "bounties",
  },
  {
    label: "Peer Reviews",
    value: "peer-reviews",
  },
];

export const getTabs = ({ router }: { router: NextRouter }) => {
  const { documentType, documentId, documentSlug, tabName } = router.query;
  const basePath = `/doc-v2/${documentType}/${documentId}/${documentSlug}`;

  const tabsWithSelected = tabs.map((tab) =>
    tab.value === tabName ? { ...tab, isSelected: true } : tab
  );
  const tabsWithHref = tabsWithSelected.map((tab) => ({
    ...tab,
    href: basePath + `/${tab.value}`,
  }));

  const hasSelected = Boolean(tabsWithHref.find((t) => t.isSelected));
  if (!hasSelected) {
    tabsWithHref[0].isSelected = true;
  }

  return tabsWithHref;
}
