import React from "react";
import Link from "next/link";
import Router, { useRouter } from "next/router";

// Component
import PaperUploadInfo from "../../../../components/Paper/PaperUploadInfo";

class Index extends React.Component {
  render() {
    return <PaperUploadInfo />;
  }
}

export default Index;
