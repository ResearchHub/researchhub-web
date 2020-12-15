import { Fragment } from "react";
import { StyleSheet } from "aphrodite";

// Component
import Head from "~/components/Head";
import UploadPaperModal from "~/components/Modals/UploadPaperModal";

class Index extends React.Component {
  render() {
    return (
      <Fragment>
        <Head title="Upload Paper" description="Upload paper to ResearchHub" />
        <UploadPaperModal />
      </Fragment>
    );
  }
}

var styles = StyleSheet.create({});

export default Index;
