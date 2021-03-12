import React, { useState, Fragment } from "react";
import { StyleSheet, css } from "aphrodite";

// Component
import ColumnContainer from "~/components/Paper/SideColumn/ColumnContainer";
import InlineComment from "./InlineComment";
import InlineTextEditor from "./InlineTextEditor";

// Config
import colors from "~/config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

const InlineCommentContainer = (props) => {
  return (
    <ColumnContainer overrideStyles={styles.container}>
      <InlineTextEditor />
      <InlineComment />
    </ColumnContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: "20px 15px",
    borderLeft: `3px solid ${colors.NEW_BLUE()}`,
  },
});

export default InlineCommentContainer;
