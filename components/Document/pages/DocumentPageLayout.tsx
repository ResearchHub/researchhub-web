import { StyleSheet, css } from "aphrodite";
import DocumentHeader from "../DocumentHeaderV2";
import config from "~/components/Document/lib/config";
import { DocumentMetadata, GenericDocument, DocumentType } from "../lib/types";
import Head from "next/head";
import { LEFT_SIDEBAR_MIN_WIDTH } from "~/components/Home/sidebar/RootLeftSidebar";
import { breakpoints } from "~/config/themes/screen";

interface Args {
  document: GenericDocument;
  errorCode?: number;
  documentType: DocumentType;
  tabName?: string;
  children?: any;
  metadata: DocumentMetadata;
}

const DocumentPageLayout = ({
  document,
  metadata,
  documentType,
  tabName,
  children,
  errorCode,
}: Args) => {
  return (
    <div
      className={css(
        styles.pageWrapper,
        tabName !== undefined && styles.pageWrapperAlternate
      )}
    >
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
        <DocumentHeader document={document} metadata={metadata} />
      </div>
      <div className={css(styles.bodyArea)}>{children}</div>
    </div>
  );
};

const styles = StyleSheet.create({
  pageWrapper: {
    height: "100%",
    background: config.background,
    paddingBottom: 50,
    [`@media (max-width: ${config.width}px)`]: {
      maxWidth: `calc(100vw - ${LEFT_SIDEBAR_MIN_WIDTH}px)`,
    },
    [`@media (max-width: ${breakpoints.xsmall.str})`]: {
      maxWidth: `100vw`,
    },
  },
  pageWrapperAlternate: {
    background: "white",
  },
  topArea: {
    background: "white",
    paddingTop: 25,
  },
  bodyArea: {
    display: "block",
    marginTop: 25,
    [`@media (max-width: ${config.width}px)`]: {
      paddingLeft: 15,
      paddingRight: 15,
      boxSizing: "border-box",
    },
  },
});

export default DocumentPageLayout;
