import Head from "~/components/Head";
import PaperUploadInfo from "~/components/Paper/PaperUploadInfo";
import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";

function Index({ isLoggedIn }) {
  const router = useRouter();
  const { uploadPaperTitle, type } = router.query;

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/all");
    }
  }, [isLoggedIn, router.pathname]);

  if (isLoggedIn) {
    return (
      <Fragment>
        <Head
          title={`Upload Paper`}
          description="Upload paper to ResearchHub"
        />
        <PaperUploadInfo paperTitle={uploadPaperTitle} type={type} />
      </Fragment>
    );
  } else {
    return null;
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
});

export default connect(mapStateToProps)(Index);
