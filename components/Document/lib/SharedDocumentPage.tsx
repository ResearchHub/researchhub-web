import { StyleSheet, css } from "aphrodite";
import DocumentHeader from "../DocumentHeaderV2";
import config from "~/components/Document/lib/config";
import { GenericDocument } from "./types";
import Head from 'next/head'

interface Args {
  document: GenericDocument;
  errorCode?: number;
  documentType: string;
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
  return (
    <div className={css(styles.pageWrapper)}>
      <Head>
        {/*
          Need to disable pinch zoom for the entire page because it interferes with PDF.js zoom.
          If we enable pinch zoom, then every element including the pdf is going to change scale as user zooms in/out.
        */}
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <div className={css(styles.topArea)}>
        <DocumentHeader document={document} />
      </div>
      <div className={css(styles.bodyArea)}>
        <div className={css(styles.bodyContentWrapper)}>{children}</div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  pageWrapper: {
    height: "100%",
    background: config.background,
  },
  topArea: {
    background: "white",
    paddingTop: 25,
  },
  bodyArea: {
    display: "block",
    marginTop: 25,
  },
  bodyContentWrapper: {
    maxWidth: config.maxWidth,
    margin: "0 auto",
  },
});

export default SharedDocumentPage;
