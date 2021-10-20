import Head from "~/components/Head";
import PaperUploadV2Container from "~/components/Paper/Upload/PaperUploadV2Container";
import { Fragment } from "react";

const Index = () => {
  return (
    <Fragment>
      <Head
        title="Editing a Paper on ResearchHub"
        description="Editing a paper on ResearchHub"
      />
      <PaperUploadV2Container />
    </Fragment>
  );
};

export default Index;
