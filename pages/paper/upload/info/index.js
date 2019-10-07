import React from "react";
import Link from "next/link";
import Router, { useRouter } from "next/router";

// Component
import PaperUploadInfo from "../../../../components/Paper/PaperUploadInfo";

const Index = () => {
  const router = useRouter();
  const { uploadPaperTitle } = router.query;
  return <PaperUploadInfo paperTitle={uploadPaperTitle} />;
};

export default Index;
