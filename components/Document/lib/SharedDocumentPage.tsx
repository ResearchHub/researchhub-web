import { StyleSheet, css } from "aphrodite";
import DocumentHeader from "../DocumentHeaderV2";
import config from "~/components/Document/lib/config";
import { DocumentMetadata, GenericDocument, DocumentType } from "./types";
import Head from "next/head";
import fetchDocumentMetadata from "../api/fetchDocumentMetadata";
import { useEffect, useState } from "react";
import { DocumentContext } from "./documentContext";
import { LEFT_SIDEBAR_MIN_WIDTH } from "~/components/Home/sidebar/RootLeftSidebar";
import { breakpoints } from "~/config/themes/screen";

interface Args {
  document: GenericDocument;
  errorCode?: number;
  documentType: DocumentType;
  tabName?: string;
  children?: any;
}

const SharedDocumentPage = ({
  document,
  documentType,
  tabName,
  children,
  errorCode,
}: Args) => {
  const [metadata, setMetadata] = useState<DocumentMetadata | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchMetadata = async () => {
      const metadata = await fetchDocumentMetadata({
        unifiedDocId: document.unifiedDocument.id,
      });
      setMetadata(metadata);
    };
    fetchMetadata();
  }, [document.id]);

  return (
    <div className={css(styles.pageWrapper)}>
      <DocumentContext.Provider value={{ metadata, documentType, tabName }}>
        <Head>
          {/*
            Need to disable pinch zoom for the entire page because it interferes with PDF.js zoom.
            If we enable pinch zoom, then every element including the pdf is going to change scale as user zooms in/out.
          */}
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
        </Head>
        <div className={css(styles.topArea)}>
          <DocumentHeader document={document} />
        </div>
        <div className={css(styles.bodyArea)}>
          <div className={css(styles.bodyContentWrapper)}>{children}</div>
        </div>
      </DocumentContext.Provider>
    </div>
  );
};

const styles = StyleSheet.create({
  pageWrapper: {
    height: "100%",
    background: config.background,

    [`@media (max-width: ${config.maxWidth}px)`]: {
      maxWidth: `calc(100vw - ${LEFT_SIDEBAR_MIN_WIDTH})`,
    },
    [`@media (max-width: ${breakpoints.xsmall.str})`]: {
      maxWidth: `100vw`,
    },
  },
  topArea: {
    background: "white",
    paddingTop: 25,
  },
  bodyArea: {
    display: "block",
    marginTop: 25,
    [`@media (max-width: ${config.maxWidth}px)`]: {
      paddingLeft: 15,
      paddingRight: 15,
      boxSizing: "border-box",
    },
  },
  bodyContentWrapper: {
    maxWidth: config.maxWidth,
    margin: "0 auto",
  },
});

export default SharedDocumentPage;
