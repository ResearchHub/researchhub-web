import React, { Fragment, useEffect } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";

// Component
import Head from "~/components/Head";
import PaperUploadInfo from "~/components/Paper/PaperUploadInfo";
import AskQuestionForm from "~/components/Paper/AskQuestionForm";

// Redux
import { ModalActions } from "~/redux/modals";

function Index(props) {
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

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  openNewPostModal: ModalActions.openNewPostModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);
