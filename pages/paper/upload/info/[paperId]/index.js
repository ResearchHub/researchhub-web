import { useRouter } from "next/router";

// Component
import Head from "~/components/Head";
import PaperUploadInfo from "~/components/Paper/PaperUploadInfo";

const Index = () => {
  const router = useRouter();
  const { paperId } = router.query;
  return (
    <Fragment>
      <Head title="Upload Paper" description="Upload paper to Research Hub" />
      <PaperUploadInfo paperId={paperId} />
    </Fragment>
  );
};

export default Index;
