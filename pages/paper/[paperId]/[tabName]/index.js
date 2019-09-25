import { useRouter } from "next/router";
import PaperTabs from "../../../../components/paper-tabs";

const Paper = () => {
  const router = useRouter();
  const { paperId, tabName } = router.query;

  // TODO: Display different tab content based on tabName
  return (
    <div>
      <div>Paper: {paperId}</div>
      <PaperTabs baseUrl={paperId} selectedTab={tabName} />
      <div>Tab: {tabName}</div>
    </div>
  );
};

export default Paper;
