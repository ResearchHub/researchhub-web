import { Fragment } from "react";
import Head from "~/components/Head";
import PaperUploadWizardContainer from "~/components/Paper/UploadWizard/PaperUploadWizardContainer";

export default function Index() {
  return (
    <Fragment>
      <Head title="Upload Paper" description="Upload paper to ResearchHub" />
      <PaperUploadWizardContainer />
    </Fragment>
  );
}
