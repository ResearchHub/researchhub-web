import { NextRouter } from "next/router";
import { PaperIcon, QuestionIcon } from "~/config/themes/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faStar, faCircleCheck, faClockRotateLeft } from "@fortawesome/pro-solid-svg-icons";
import ResearchCoinIcon from "~/components/Icons/ResearchCoinIcon";
import { Tab } from "~/components/HorizontalTabBar";
import colors from "~/config/themes/colors";
import { DocumentMetadata, GenericDocument, isPaper, isPost } from "./types";

export const tabs: Array<Tab> = [
  {
    icon: <FontAwesomeIcon icon={faComments} />,
    label: "Conversation",
    value: "conversation",
  },
  {
    icon: <FontAwesomeIcon icon={faClockRotateLeft} />,
    label: "Changes",
    value: "changes",
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
    label: "Grants",
    value: "grants",
  },
  {
    icon: <FontAwesomeIcon icon={faStar} />,
    label: "Peer Reviews",
    value: "reviews",
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
    _tabs = _tabs.filter(
      (tab) => tab.value !== "reviews" && tab.value !== "conversation"
    );
  }
  if (isPost(document) && document.postType === "preregistration") {
    _tabs = _tabs.filter(
      (tab) =>
        tab.value !== "reviews" &&
        tab.value !== "replicability" &&
        tab.value !== "grants"
    );
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

const isResearchHubPaper = (document: GenericDocument) => {
  return isPaper(document) && document.doi?.includes("ResearchHub");
}

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
    } else if (tab.value === "changes") {
      finalTabs.push({
        ...tab,
        pillContent: isPaper(document) && document.versions.length,
      });      
    } else if (tab.value === "grants") {
      finalTabs.push({
        ...tab,
        pillContent: metadata.bounties.length || undefined,
      });
    } else if (tab.value === "reviews") {
      finalTabs.push({
        ...tab,
        pillContent: metadata.reviewSummary.count || undefined,
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
