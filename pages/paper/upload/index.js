import Link from "next/link";
import Router from "next/router";
import { StyleSheet, css } from "aphrodite";

// Component
import UploadPaperModal from "../../../components/modal/UploadPaperModal";

class Index extends React.Component {
  render() {
    return <UploadPaperModal />;
  }
}

var styles = StyleSheet.create({});

export default Index;
