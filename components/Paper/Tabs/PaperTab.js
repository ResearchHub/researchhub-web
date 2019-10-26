import { useState } from "react";

// NPM Modules
import { connect } from "react-redux";
import { withRouter } from "next/router";
import { StyleSheet, css } from "aphrodite";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// Component
import Loader from "~/components/Loader/Loader";

function PaperTab(props) {
  const { paperUrl } = props;
  const [loadSuccess, setLoadSuccess] = useState(false);
  const [numPages, setNumPages] = useState(0);
  function onLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setLoadSuccess(true);
  }

  console.log(paperUrl);

  return (
    <div className={css(styles.container)}>
      <Document
        className={css(!loadSuccess && styles.hidden)}
        file={paperUrl}
        onLoadSuccess={onLoadSuccess}
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page pageNumber={index + 1} width={1000} key={`page_${index + 1}`} />
        ))}
      </Document>
      <Loader loading={!loadSuccess} />
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
  hidden: {
    opacity: 0,
  },
});

const mapStateToProps = (state) => ({
  paperUrl: state.paper.file,
});

export default withRouter(connect(mapStateToProps)(PaperTab));
