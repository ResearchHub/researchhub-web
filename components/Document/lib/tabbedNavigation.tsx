import { NextRouter } from "next/router";
import { PaperIcon, QuestionIcon } from "~/config/themes/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faStar, faCircleCheck } from "@fortawesome/pro-solid-svg-icons";
import ResearchCoinIcon from "~/components/Icons/ResearchCoinIcon";
import { Tab } from "~/components/HorizontalTabBar";
import colors from "~/config/themes/colors";
import { DocumentMetadata, GenericDocument, isPaper, isPost } from "./types";
import predMarketUtils from "~/components/PredictionMarket/lib/util";

export const tabs: Array<Tab> = [
  {
    icon: <FontAwesomeIcon icon={faComments} />,
    label: "Conversation",
    value: "conversation",
  },
  {
    icon: (
      <ResearchCoinIcon
        version={4}
        color={colors.BLACK(0.5)}
        height={18}
        width={18}
      />
    ),
    selectedIcon: (
      <ResearchCoinIcon
        version={4}
        color={colors.NEW_BLUE(1.0)}
        height={18}
        width={18}
      />
    ),
    label: "Bounties",
    value: "bounties",
  },
  {
    icon: <FontAwesomeIcon icon={faStar} />,
    label: "Peer Reviews",
    value: "reviews",
  },
  {
    icon: <FontAwesomeIcon icon={faCircleCheck} />,
    label: "Replicability",
    value: "replicability",
  },
];

export const getTabs = ({
  router,
  document,
  metadata,
}: {
  router: NextRouter;
  document: GenericDocument;
  metadata?: DocumentMetadata;
}) => {
  const { tabName } = router.query;

  let _tabs = tabs;

  if (isPost(document) && document.postType === "question") {
    _tabs = _tabs.filter((tab) => tab.value !== "reviews" && tab.value !== "conversation");
  }
  if (!isPaper(document)) {
    // we only have replication prediction markets on papers
    _tabs = _tabs.filter((tab) => tab.value !== "replicability");
  }

  _tabs = withDocTypeTab({ tabs: _tabs, document });
  _tabs = withHref({ tabs: _tabs, router });
  _tabs = withSelected({ tabs: _tabs, tabName: tabName as string });
  if (metadata) {
    _tabs = withPillContent({ tabs: _tabs, document, metadata });
  }

  return _tabs;
};

const withDocTypeTab = ({
  tabs,
  document,
}: {
  tabs: Array<Tab>;
  document: GenericDocument;
}) => {
  const type = isPaper(document)
    ? "paper"
    : isPost(document) && document.postType === "question"
    ? "question"
    : "post";
  let docTab: Tab;

  if (type === "question") {
    docTab = {
      // @ts-ignore
      icon: <QuestionIcon height={18} width={18} />,
      label: "Question",
      value: "",
    };
  } else if (type === "post") {
    docTab = {
      // @ts-ignore
      icon: <PaperIcon height={18} width={18} />,
      label: "Post",
      value: "",
    };
  } else {
    docTab = {
      // @ts-ignore
      icon: <PaperIcon height={18} width={18} />,
      label: "Paper",
      value: "",
    };
  }

  return [docTab, ...tabs];
};

const withPillContent = ({
  tabs,
  document,
  metadata,
}: {
  tabs: Array<Tab>;
  document: GenericDocument;
  metadata: DocumentMetadata;
}) => {
  const finalTabs: Array<Tab> = [];
  for (let i = 0; i < tabs.length; i++) {
    const tab = tabs[i];

    if (tab.value === "") {
      finalTabs.push(tab);
    } else if (tab.value === "conversation") {
      finalTabs.push({
        ...tab,
        pillContent: metadata.discussionCount || undefined,
      });
    } else if (tab.value === "bounties") {
      finalTabs.push({
        ...tab,
        pillContent: metadata.bounties.length || undefined,
      });
    } else if (tab.value === "reviews") {
      finalTabs.push({
        ...tab,
        pillContent: metadata.reviewSummary.count || undefined,
      });
    } else if (tab.value === "replicability") {
      const pcnt = predMarketUtils.computeProbability(
        metadata.predictionMarket?.votes
      );
      finalTabs.push({
        ...tab,
        pillContent: pcnt !== undefined ? `${pcnt.toFixed(0)}%` : undefined,
      });
    }
  }

  return finalTabs;
};

const withSelected = ({
  tabs,
  tabName,
}: {
  tabs: Array<Tab>;
  tabName: string;
}) => {
  const tabsWithSelected = tabs.map((tab) =>
    tab.value === tabName ? { ...tab, isSelected: true } : tab
  );

  const hasSelected = Boolean(tabsWithSelected.find((t) => t.isSelected));
  if (!hasSelected) {
    tabsWithSelected[0].isSelected = true;
  }

  return tabsWithSelected;
};

const withHref = ({
  tabs,
  router,
}: {
  tabs: Array<Tab>;
  router: NextRouter;
}) => {
  const { documentId, documentSlug, tabName } = router.query;
  const documentType = router.asPath.split("/")[1];
  const basePath = `/${documentType}/${documentId}/${documentSlug}`;
  return tabs.map((t) => ({ ...t, href: `${basePath}/${t.value}` }));
};
