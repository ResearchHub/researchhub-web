import { useState } from "react";
import Router, { withRouter } from "next/router";
import { StyleSheet, css } from "aphrodite";
import { Document, Page } from "react-pdf";

// Config
import API from "../../../config/api";
import { Helpers } from "@quantfive/js-web-config";

function PaperTab(props) {
  const [pageNumber, setPageNumber] = useState(0);
  const [numPages, setNumPages] = useState(0);

  function onLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  return (
    <div className={css(styles.container)}>
      <Document
        file={"http://startupwoman.org/files/pdf-sample(1).pdf"}
        onLoadSuccess={onLoadSuccess}
      >
        <Page pageNumber={pageNumber} width={800} />
      </Document>
      <div>
        Page {pageNumber} of {numPages}
      </div>
    </div>
  );
}

var styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
  },
});

export default withRouter(PaperTab);
