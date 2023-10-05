import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import sharedGetStaticProps from "~/components/Document/lib/sharedGetStaticProps";
import DocumentPageLayout from "~/components/Document/pages/DocumentPageLayout";
import { useRouter } from "next/router";
import { Paper } from "~/components/Document/lib/types";
import { captureEvent } from "~/config/utils/events";
import Error from "next/error";
import config from "~/components/Document/lib/config";
import { StyleSheet, css } from "aphrodite";
import PaperPageAbstractSection from "~/components/Paper/abstract/PaperPageAbstractSection";
import DocumentPagePlaceholder from "~/components/Document/lib/Placeholders/DocumentPagePlaceholder";
import { useRef, useState } from "react";
import {
  DocumentContext,
  DocumentPreferences,
} from "~/components/Document/lib/DocumentContext";
import UploadPDF from "~/components/Paper/Tabs/PaperTab";
import { breakpoints } from "~/config/themes/screen";
import useCacheControl from "~/config/hooks/useCacheControl";
import {
  useDocument,
  useDocumentMetadata,
} from "~/components/Document/lib/useHooks";
import {
  LEFT_SIDEBAR_MAX_WIDTH,
  LEFT_SIDEBAR_MIN_WIDTH,
} from "~/components/Home/sidebar/RootLeftSidebar";
import DocumentViewer, {
  ZoomAction,
} from "~/components/Document/DocumentViewer";

interface Args {
  documentData?: any;
  metadata?: any;
  postHtml?: TrustedHTML | string;
  errorCode?: number;
}

const DocumentIndexPage: NextPage<Args> = ({
  documentData,
  metadata,
  errorCode,
}) => {
  const documentType = "paper";
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [viewerWidth, setViewerWidth] = useState<number | undefined>(
    config.width
  );
  const [docPreferences, setDocPreferences] = useState<DocumentPreferences>({
    comments: "all",
  });
  const [documentMetadata, setDocumentMetadata] = useDocumentMetadata({
    rawMetadata: metadata,
    unifiedDocumentId: documentData?.unified_document?.id,
  });
  const [document, setDocument] = useDocument({
    rawDocumentData: documentData,
    documentType,
  }) as [Paper | null, Function];
  const { revalidateDocument } = useCacheControl();

  if (router.isFallback) {
    return <DocumentPagePlaceholder />;
  }

  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  if (!document || !documentMetadata) {
    captureEvent({
      msg: "[Document] Could not parse",
      data: { document, documentType, documentMetadata },
    });
    return <Error statusCode={500} />;
  }

  const pdfUrl = document.formats.find((f) => f.type === "pdf")?.url;
  return (
    <DocumentContext.Provider
      value={{
        metadata: documentMetadata,
        documentType,
        updateMetadata: setDocumentMetadata,
        updateDocument: setDocument,
        preferences: docPreferences,
        setPreference: ({ key, value }) =>
          setDocPreferences({ ...docPreferences, [key]: value }),
      }}
    >
      <DocumentPageLayout
        document={document}
        errorCode={errorCode}
        metadata={documentMetadata}
        documentType={documentType}
      >
        <div
          className={css(styles.bodyContentWrapper)}
          style={{ width: viewerWidth }}
          ref={wrapperRef}
        >
          <div className={css(styles.bodyWrapper)}>
            {pdfUrl ? (
              <div className={css(styles.viewerWrapper)}>
                {process.browser && (
                  <DocumentViewer
                    documentInstance={{ id: document.id, type: "paper" }}
                    document={document}
                    pdfUrl={pdfUrl}
                    viewerWidth={config.width}
                    onZoom={(zoom: ZoomAction) => {
                      if (!zoom.isExpanded) {
                        setViewerWidth(zoom.newWidth);
                      }
                    }}
                  />
                )}
              </div>
            ) : (
              <div className={css(styles.body)}>
                <PaperPageAbstractSection
                  paper={document.raw}
                  onUpdate={(updated) => {
                    setDocument({
                      ...document,
                      abstract: updated,
                      raw: {
                        ...document.raw,
                        abstract_src_markdown: updated,
                      },
                    });
                    revalidateDocument();
                  }}
                />
              </div>
            )}
          </div>

          {!pdfUrl && (
            <div className={css(styles.uploadPdfWrapper)}>
              <UploadPDF
                paper={document.raw}
                paperId={document.id}
                onUpdate={(paperFile) => {
                  setDocument({
                    ...document,
                    formats: [
                      {
                        type: "pdf",
                        url: paperFile,
                      },
                    ],
                  });
                  revalidateDocument();
                }}
              />
            </div>
          )}
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
    padding: 45,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      padding: 25,
    },
  },
  uploadPdfWrapper: {
    marginTop: 25,
    background: "white",
    padding: 45,
    border: `1px solid ${config.border}`,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      padding: 25,
    },
  },
  bodyContentWrapper: {
    margin: "0 auto",
    maxWidth: `calc(100vw - ${LEFT_SIDEBAR_MAX_WIDTH}px)`,
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      maxWidth: `calc(100vw - ${LEFT_SIDEBAR_MIN_WIDTH + 40}px)`,
    },
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      maxWidth: `calc(100vw - 30px)`,
    },
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
