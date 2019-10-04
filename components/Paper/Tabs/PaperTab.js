import { useState } from "react";

// NPM Modules
import { connect } from "react-redux";
import Router, { withRouter } from "next/router";
import { StyleSheet, css } from "aphrodite";
import { Document, Page } from "react-pdf";

// Config
import API from "../../../config/api";
import { Helpers } from "@quantfive/js-web-config";

function PaperTab(props) {
  const { paperUrl } = props;
  const [pageNumber, setPageNumber] = useState(0);
  const [numPages, setNumPages] = useState(0);
  function onLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function nextPage() {
    if (pageNumber >= numPages) {
      return;
    }
    setPageNumber(pageNumber + 1);
  }

  function prevPage() {
    if (pageNumber <= 1) {
      return;
    }
    setPageNumber(pageNumber - 1);
  }
  return (
    <div className={css(styles.container)}>
      <Document file={paperUrl} onLoadSuccess={onLoadSuccess}>
        <Page pageNumber={pageNumber} width={800} />
      </Document>
      <div className={css(styles.pageNavigator)}>
        <i
          className={
            css(styles.icon, pageNumber <= 1 && styles.disable) +
            " fas fa-caret-left"
          }
          onClick={prevPage}
        ></i>
        Page {pageNumber} of {numPages}
        <i
          className={
            css(styles.icon, pageNumber >= numPages && styles.disable) +
            " fas fa-caret-right"
          }
          onClick={nextPage}
        ></i>
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
  pageNavigator: {
    display: "flex",
    alignItems: "center",
  },
  icon: {
    marginLeft: 10,
    marginRight: 10,
    cursor: "pointer",
    fontSize: 20,
  },
  disable: {
    opacity: 0.3,
  },
});

const mapStateToProps = (state) => ({
  paperUrl: state.paper.file,
});

export default withRouter(connect(mapStateToProps)(PaperTab));
