import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import sharedGetStaticProps from "~/components/Document/lib/sharedGetStaticProps";
import DocumentPageLayout from "~/components/Document/pages/DocumentPageLayout";
import { useRouter } from "next/router";
import getDocumentFromRaw, {
  Paper,
} from "~/components/Document/lib/types";
import { captureEvent } from "~/config/utils/events";
import Error from "next/error";
import PDFViewer from "~/components/Document/lib/PDFViewer/PDFViewer";
import config from "~/components/Document/lib/config";
import { StyleSheet, css } from "aphrodite";
import PaperPageAbstractSection from "~/components/Paper/abstract/PaperPageAbstractSection";
import DocumentPagePlaceholder from "~/components/Document/lib/Placeholders/DocumentPagePlaceholder";
import { useState } from "react";
import useDocumentMetadata from "~/components/Document/lib/useDocumentMetadata";
import { DocumentContext } from "~/components/Document/lib/DocumentContext";

interface Args {
  documentData?: any;
  postHtml?: TrustedHTML | string;
  errorCode?: number;
}

const DocumentIndexPage: NextPage<Args> = ({
  documentData,
  errorCode,
}) => {
  const documentType = "paper";
  const router = useRouter();
  const [viewerWidth, setViewerWidth] = useState<number | undefined>(config.maxWidth);
  const [metadata, updateMetadata] = useDocumentMetadata({ id: documentData?.unified_document?.id });

  if (router.isFallback) {
    return <DocumentPagePlaceholder />;
  }
  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  let document: Paper;
  try {
    document = getDocumentFromRaw({ raw: documentData, type: documentType }) as Paper;
  } catch (error: any) {
    captureEvent({
      error,
      msg: "[Document] Could not parse",
      data: { documentData, documentType },
    });
    return <Error statusCode={500} />;
  }

  const pdfUrl = document.formats.find((f) => f.type === "pdf")?.url;

  return (
    <DocumentContext.Provider value={{ metadata, documentType, updateMetadata }}>
      <DocumentPageLayout
        document={document}
        errorCode={errorCode}
        metadata={metadata}
        documentType={documentType}
      >
        <div className={css(styles.bodyContentWrapper)} style={{ width: viewerWidth }}>
          <div className={css(styles.bodyWrapper)}>
            {pdfUrl ? (
              <div className={css(styles.viewerWrapper)}>
                <PDFViewer pdfUrl={pdfUrl} onZoomIn={(zoom) => setViewerWidth(zoom.newWidth)} onZoomOut={(zoom) => setViewerWidth(zoom.newWidth)} />
              </div>
            ) : (
              <div className={css(styles.body)}>
                {document.abstract ? (
                  <>
                    <h2>Abstract</h2>
                    <p dangerouslySetInnerHTML={{ __html: document.abstract }} />
                  </>
                ) : (
                  <PaperPageAbstractSection paper={document.raw} />
                )}
              </div>
            )}
          </div>
        </div>
      </DocumentPageLayout>
    </DocumentContext.Provider>
  );
};

const styles = StyleSheet.create({
  bodyWrapper: {
    borderRadius: "4px",
    border: `1px solid ${config.border}`,
    marginTop: 15,
    background: "white",
    width: "100%",
    boxSizing: "border-box",
  },
  viewerWrapper: {
    minHeight: 500,
  },
  body: {
    padding: 25,
    minHeight: 200,
  },
  bodyContentWrapper: {
    margin: "0 auto",
  },  
});

export const getStaticProps: GetStaticProps = async (ctx) => {
  return sharedGetStaticProps({ ctx, documentType: "paper" });
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export default DocumentIndexPage;
