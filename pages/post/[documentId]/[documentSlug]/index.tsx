import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import sharedGetStaticProps from "~/components/Document/lib/sharedGetStaticProps";
import DocumentPageLayout from "~/components/Document/pages/DocumentPageLayout";
import { useRouter } from "next/router";
import getDocumentFromRaw, { Post } from "~/components/Document/lib/types";
import { captureEvent } from "~/config/utils/events";
import Error from "next/error";
import config from "~/components/Document/lib/config";
import { StyleSheet, css } from "aphrodite";
import DocumentPagePlaceholder from "~/components/Document/lib/Placeholders/DocumentPagePlaceholder";
import { useState } from "react";
import {
  useDocument,
  useDocumentMetadata,
} from "~/components/Document/lib/useHooks";
import { DocumentContext } from "~/components/Document/lib/DocumentContext";

interface Args {
  documentData?: any;
  metadata?: any;
  postHtml?: TrustedHTML | string;
  errorCode?: number;
}

const DocumentIndexPage: NextPage<Args> = ({
  documentData,
  metadata,
  postHtml = "",
  errorCode,
}) => {
  const documentType = "post";
  const router = useRouter();
  const [viewerWidth, setViewerWidth] = useState<number | undefined>(
    config.width
  );
  const [documentMetadata, setDocumentMetadata] = useDocumentMetadata({
    rawMetadata: metadata,
    unifiedDocumentId: documentData?.unified_document?.id,
  });
  const [document, setDocument] = useDocument({
    rawDocumentData: documentData,
    documentType,
  }) as [Post | null, Function];

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

  return (
    <DocumentContext.Provider
      value={{
        metadata: documentMetadata,
        documentType,
        updateMetadata: setDocumentMetadata,
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
        >
          <div className={css(styles.bodyWrapper)}>
            <div
              className={css(styles.body) + " rh-post"}
              dangerouslySetInnerHTML={{ __html: postHtml }}
            />
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
  body: {
    padding: 45,
  },
  bodyContentWrapper: {
    margin: "0 auto",
  },
});

export const getStaticProps: GetStaticProps = async (ctx) => {
  return sharedGetStaticProps({ ctx, documentType: "post" });
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export default DocumentIndexPage;
