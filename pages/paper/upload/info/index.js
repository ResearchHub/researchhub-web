import React, { Fragment, useEffect } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";

// Component
import Head from "~/components/Head";
import PaperUploadInfo from "~/components/Paper/PaperUploadInfo";

import NewPostModal from "~/components/Modals/NewPostModal";

// Redux
import { ModalActions } from "~/redux/modals";
import ComponentWrapper from "../../../../components/ComponentWrapper";

const Index = (props) => {
  const router = useRouter();
  const { uploadPaperTitle, type } = router.query;

  // useEffect(() => {
  //   props.openNewPostModal(true);
  // }, []);

  return (
    <Fragment>
      <Head title={`Upload Paper`} description="Upload paper to ResearchHub" />
      <NewPostModal />
      <PaperUploadInfo paperTitle={uploadPaperTitle} type={type} />
    </Fragment>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  openNewPostModal: ModalActions.openNewPostModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);

// export default Index;
