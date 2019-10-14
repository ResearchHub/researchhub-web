import { useRouter } from "next/router";

// Component
import PaperUploadInfo from "~/components/Paper/PaperUploadInfo";

const Index = () => {
  const router = useRouter();
  const { paperId } = router.query;
  return <PaperUploadInfo paperId={paperId} />;
};

export default Index;
