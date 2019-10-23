import { Fragment } from "react";
import Link from "next/link";
import Router, { withRouter } from "next/router";
import { StyleSheet, css } from "aphrodite";
import { EditorState, convertFromRaw } from "draft-js";
import dynamic from "next/dynamic";
import { Value } from "slate";
import { connect, useDispatch, useStore } from "react-redux";

// Components
import ComponentWrapper from "~/components/ComponentWrapper";
import PaperEntryCard from "~/components/Hubs/PaperEntryCard";

// Config
import API from "../../../config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "../../../config/themes/colors";

class AuthoredPapersTab extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { author } = this.props;
    let papers = author.authoredPapers.papers.map((paper, index) => {
      return (
        <div className={css(styles.paperContainer)}>
          <PaperEntryCard paper={paper} index={index} />
        </div>
      );
    });
    return (
      <ComponentWrapper>
        <div className={css(styles.container)}>{papers}</div>
      </ComponentWrapper>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    boxSizing: "border-box",
  },
});

const mapStateToProps = (state) => ({
  author: state.author,
});

export default connect(mapStateToProps)(AuthoredPapersTab);
