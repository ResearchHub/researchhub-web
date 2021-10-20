import { Component, Fragment } from "react";
import { StyleSheet } from "aphrodite";

// Component
import Head from "~/components/Head";

// Dynamic modules
import dynamic from "next/dynamic";
const UploadPaperModal = dynamic(() =>
  import("~/components/Modals/UploadPaperModal")
);

class Index extends Component {
  render() {
    return (
      <Fragment>
        <Head
          title="Upload a Paper to ResearchHub"
          description="Upload a paper to ResearchHub"
        />
        <UploadPaperModal />
      </Fragment>
    );
  }
}

var styles = StyleSheet.create({});

export default Index;
