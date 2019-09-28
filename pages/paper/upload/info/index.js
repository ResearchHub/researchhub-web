import React from "react";
import { useRouter } from "next/router";

// Component
import PaperUploadInfo from "../../../../components/Paper/PaperUploadInfo";

const Info = () => {
  const router = useRouter();
  const { uploadedPaper } = router.query;
  return <PaperUploadInfo uploadedPaper={uploadedPaper} />;
};

export default Info;
