import React, { Fragment } from "react";
import { useRouter } from "next/router";

// Component
import Head from "~/components/Head";
import PaperUploadInfo from "~/components/Paper/PaperUploadInfo";

const Index = () => {
  const router = useRouter();
  const { uploadPaperTitle } = router.query;
  return (
    <Fragment>
      <Head
        title={`Upload Paper - ${uploadPaperTitle}`}
        description="Upload paper to Research Hub"
      />
      <PaperUploadInfo paperTitle={uploadPaperTitle} />
    </Fragment>
  );
};

export default Index;
