import Head from "~/components/Head";
import PaperUploadV2Container from "~/components/Paper/Upload/PaperUploadV2Container";
import { Fragment } from "react";

export default function Index() {
  return (
    <Fragment>
      <Head
        title="Upload a Paper to ResearchHub"
        description="Upload a paper to ResearchHub"
      />
      <PaperUploadV2Container />
    </Fragment>
  );
}
