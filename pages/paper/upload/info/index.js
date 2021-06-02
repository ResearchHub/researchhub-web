import React, { Fragment, useEffect } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";

// Component
import Head from "~/components/Head";
import PaperUploadInfo from "~/components/Paper/PaperUploadInfo";
import AskQuestionForm from "~/components/Paper/AskQuestionForm";

export default function Index() {
  const router = useRouter();
  const { uploadPaperTitle, type } = router.query;

  return (
    <Fragment>
      <Head title={`Upload Paper`} description="Upload paper to ResearchHub" />
      {/* <PaperUploadInfo paperTitle={uploadPaperTitle} type={type} /> */}
      <AskQuestionForm />
    </Fragment>
  );
}
