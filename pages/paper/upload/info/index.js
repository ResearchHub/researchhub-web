import Head from "~/components/Head";
import PaperUploadInfo from "~/components/Paper/PaperUploadInfo";
import React, { Fragment } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { useRequireLogin } from "../../../../config/utils";

function Index({ auth }) {
  const router = useRouter();
  useRequireLogin(auth, router, "/all");

  const { uploadPaperTitle, type } = router.query;
  return (
    <Fragment>
      <Head title={`Upload Paper`} description="Upload paper to ResearchHub" />
      <PaperUploadInfo paperTitle={uploadPaperTitle} type={type} />
    </Fragment>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Index);
