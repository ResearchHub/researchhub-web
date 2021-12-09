import Head from "~/components/Head";
import PaperUploadV2Container from "~/components/Paper/Upload/PaperUploadV2Container";
import { Fragment } from "react";

const Index = () => {
  return (
    <Fragment>
      <Head title="Upload Paper" description="Upload paper to ResearchHub" />
      <PaperUploadV2Container />
    </Fragment>
  );
};

export default Index;
