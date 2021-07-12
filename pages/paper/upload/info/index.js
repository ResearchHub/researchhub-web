import { useRouter } from "next/router";
import Head from "~/components/Head";
import killswitch from "~/config/killswitch/killswitch.ts";
import PaperUploadInfo from "~/components/Paper/PaperUploadInfo";
import PaperUploadV2Container from "~/components/Paper/Upload/PaperUploadV2Container";
import React, { Fragment } from "react";

export default function Index() {
  const router = useRouter();
  const { uploadPaperTitle, type } = router.query;
  const shouldRenderV2 = killswitch("paperUploadV2");
  return (
    <Fragment>
      <Head title={`Upload Paper`} description="Upload paper to ResearchHub" />
      {shouldRenderV2 ? (
        <PaperUploadV2Container />
      ) : (
        // type removed in V2. There's only "regular" paper upload type
        <PaperUploadInfo paperTitle={uploadPaperTitle} type={type} />
      )}
    </Fragment>
  );
}
