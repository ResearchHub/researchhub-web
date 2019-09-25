import Link from "next/link";
import Router, { withRouter } from "next/router";
import { StyleSheet, css } from "aphrodite";
import { EditorState, convertFromRaw } from "draft-js";
import dynamic from "next/dynamic";

// Components
import SummaryTab from "../../../components/Paper/Tabs/SummaryTab";

// Config
import API from "../../../config/api";
import { Helpers } from "@quantfive/js-web-config";

const PaperTab = dynamic(import("../../../components/Paper/Tabs/PaperTab"), {
  ssr: false,
});

class Summary extends React.Component {
  render() {
    let { query } = this.props.router;
    return (
      <div className={css(styles.container)}>
        <SummaryTab />
        <PaperTab />
      </div>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 500,
    padding: 50,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    boxSizing: "border-box",
  },
  summaryActions: {
    width: 50,
  },
});

export default withRouter(Summary);
