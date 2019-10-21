import { Fragment } from "react";
import Link from "next/link";
import Router, { withRouter } from "next/router";
import { StyleSheet, css } from "aphrodite";
import { EditorState, convertFromRaw } from "draft-js";
import dynamic from "next/dynamic";
import { Value } from "slate";

// Components
import ComponentWrapper from "~/components/ComponentWrapper";
import TextEditor from "~/components/TextEditor";

// Config
import API from "../../../config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "../../../config/themes/colors";

class AuthoredPapersTab extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { paper } = this.props;
    return (
      <ComponentWrapper>
        <div className={css(styles.container)}></div>
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

export default withRouter(AuthoredPapersTab);
