import { useRouter } from "next/router";

import PaperTabs from "~/components/paper-tabs";
import DiscussionTab from "~/components/Paper/Tabs/DiscussionTab";
import SummaryTab from "~/components/Paper/Tabs/SummaryTab";
import PaperTab from "~/components/Paper/Tabs/PaperTab";
import { css, StyleSheet } from "aphrodite";

const Paper = () => {
  const router = useRouter();
  const { paperId, tabName } = router.query;

  function renderTabContent() {
    switch (tabName) {
      case "summary":
        return <SummaryTab paperId={paperId} />;
      case "discussion":
        return <DiscussionTab paperId={paperId} />;
      case "full":
        return <PaperTab />;
      case "citations":
        return null;
    }
  }

  return (
    <div>
      <div>Paper: {paperId}</div>
      <PaperTabs baseUrl={paperId} selectedTab={tabName} />
      <div className={css(styles.contentContainer)}>{renderTabContent()}</div>
    </div>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    width: "70%",
    padding: "30px 0px",
    margin: "auto",
    display: "flex",
    justifyContent: "center",
  },
});

export default Paper;
