import React, { Fragment } from "react";
import { useRouter } from "next/router";

// Component
import Head from "~/components/Head";
import PaperUploadInfo from "~/components/Paper/PaperUploadInfo";

const Index = () => {
  const router = useRouter();
  const { uploadPaperTitle, type } = router.query;
  return (
    <Fragment>
      <Head title={`Upload Paper`} description="Upload paper to ResearchHub" />
      <PaperUploadInfo paperTitle={uploadPaperTitle} type={type} />
    </Fragment>
  );
};

export default Index;
