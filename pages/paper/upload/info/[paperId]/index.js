import { Fragment } from "react";
import { useRouter } from "next/router";
import Head from "~/components/Head";
import killswitch from "~/config/killswitch/killswitch.ts";
import PaperUploadInfo from "~/components/Paper/PaperUploadInfo";
import PaperUploadV2Container from "~/components/Paper/Upload/PaperUploadV2Container";

const Index = () => {
  const router = useRouter();
  const { paperId } = router.query;
  const shouldRenderV2 = killswitch("paperUploadV2");
  return (
    <Fragment>
      <Head title="Upload Paper" description="Upload paper to ResearchHub" />
      {shouldRenderV2 ? (
        <PaperUploadV2Container />
      ) : (
        <PaperUploadInfo paperId={paperId} />
      )}
    </Fragment>
  );
};

export default Index;
