import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import sharedGetStaticProps from "~/components/Document/lib/sharedGetStaticProps";
import SharedDocumentPage from "~/components/Document/lib/SharedDocumentPage";
import { useRouter } from "next/router";
import getDocumentFromRaw, {
  DocumentType,
  GenericDocument,
  isPaper,
  isPost,
} from "~/components/Document/lib/types";
import { captureEvent } from "~/config/utils/events";
import Error from "next/error";
import PDFViewer from "~/components/Document/lib/PDFViewer/PDFViewer";
import config from "~/components/Document/lib/config";
import { StyleSheet, css } from "aphrodite";
import PaperPageAbstractSection from "~/components/Paper/abstract/PaperPageAbstractSection";
import DocumentPagePlaceholder from "~/components/Document/lib/Placeholders/DocumentPagePlaceholder";

interface Args {
  documentData?: any;
  postHtml?: TrustedHTML | string;
  documentType: DocumentType;
  errorCode?: number;
}

const DocumentPage: NextPage<Args> = ({
  documentData,
  documentType,
  postHtml = "",
  errorCode,
}) => {
  const router = useRouter();
  if (router.isFallback) {
    return <DocumentPagePlaceholder />;
  }
  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  let document: GenericDocument;
  try {
    document = getDocumentFromRaw({ raw: documentData, type: documentType });
  } catch (error: any) {
    captureEvent({
      error,
      msg: "[Document] Could not parse",
      data: { documentData, documentType },
    });
    return <Error statusCode={500} />;
  }

  const pdfUrl =
    isPaper(document) && document.formats.find((f) => f.type === "pdf")?.url;
  return (
    <SharedDocumentPage
      document={document}
      errorCode={errorCode}
      documentType={documentType}
    >
      {isPaper(document) && (
        <div className={css(styles.bodyWrapper)}>
          {pdfUrl ? (
            <div className={css(styles.viewerWrapper)}>
              <PDFViewer pdfUrl={pdfUrl} />
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
      )}
      {isPost(document) && (
        <div className={css(styles.bodyWrapper)}>
          <div
            className={css(styles.body)}
            dangerouslySetInnerHTML={{ __html: postHtml }}
          />
        </div>
      )}
    </SharedDocumentPage>
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
});

export const getStaticProps: GetStaticProps = async (ctx) => {
  return sharedGetStaticProps(ctx);
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export default DocumentPage;
