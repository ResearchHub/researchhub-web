import { useRouter } from "next/router";

import PaperTabs from "~/components/paper-tabs";
import SummaryTab from "~/components/Paper/Tabs/SummaryTab";
import PaperTab from "~/components/Paper/Tabs/PaperTab";
const Paper = () => {
  const router = useRouter();
  const { paperId, tabName } = router.query;

  function renderTab() {
    switch (tabName) {
      case "summary":
        return <SummaryTab paperId={paperId} />;
      case "discussion":
        return null;
      case "full":
        return <PaperTab />;
      case "citations":
        return null;
    }
  }

  // TODO: Display different tab content based on tabName
  return (
    <div>
      <div>Paper: {paperId}</div>
      <PaperTabs baseUrl={paperId} selectedTab={tabName} />
      {renderTab()}
    </div>
  );
};

export default Paper;
