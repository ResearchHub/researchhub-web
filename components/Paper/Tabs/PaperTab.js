import { useState, useEffect } from "react";

// NPM Modules
import { connect } from "react-redux";
import { withRouter } from "next/router";
import { StyleSheet, css } from "aphrodite";
import { Document, Page, pdfjs } from "react-pdf";
import { isMobile } from "react-device-detect";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// Component
import Loader from "~/components/Loader/Loader";
import ModeratorDeleteButton from "~/components/Moderator/ModeratorDeleteButton";
import ComponentWrapper from "~/components/ComponentWrapper";

// Config
import colors from "../../../config/themes/colors";

function PaperTab(props) {
  const { paperUrl } = props;
  const [loadSuccess, setLoadSuccess] = useState(false);
  const [numPages, setNumPages] = useState(0);
  const [file, setFile] = useState(paperUrl);

  useEffect(() => {
    setFile(props.paperUrl);
  }, [props.paperUrl]);

  function onLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setLoadSuccess(true);
  }

  return (
    <div className={css(styles.container)}>
      {loadSuccess && file && (
        <ComponentWrapper>
          <div className={css(styles.moderatorContainer)}>
            <ModeratorDeleteButton
              label={`Remove PDF`}
              labelStyle={styles.moderatorLabel}
              containerStyle={styles.moderatorButton}
              actionType={"pdf"}
              metaData={{ paperId: props.paperId }}
              onRemove={() => setFile(null)}
              icon={" "}
              iconStyle={styles.iconStyle}
            />
          </div>
        </ComponentWrapper>
      )}
      <Document
        className={css(!loadSuccess && styles.hidden)}
        file={file}
        onLoadSuccess={onLoadSuccess}
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            pageNumber={index + 1}
            width={
              isMobile && window.innerWidth < 1000 ? window.innerWidth : 1000
            }
            key={`page_${index + 1}`}
          />
        ))}
      </Document>
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
  moderatorContainer: {
    display: "flex",
    justifyContent: "flex-end",
  },
  moderatorLabel: {},
  moderatorButton: {
    padding: "10px 16px",
    width: "unset",
    border: `1px solid ${colors.RED()}`,
    borderRadius: 3,
    color: colors.RED(),
    transition: "all ease-in-out 0.2s",
    ":hover": {
      background: colors.RED(),
      color: "#fff",
    },
  },
  iconStyle: {
    margin: 0,
    padding: 0,
  },
  // document: {
  //   width: 1000,

  //   "@media only screen and (max-width: 780px)": {
  //     width: '100%',
  //   },
  // }
});

const mapStateToProps = (state) => ({
  paperUrl: state.paper.file,
});

export default withRouter(connect(mapStateToProps)(PaperTab));
