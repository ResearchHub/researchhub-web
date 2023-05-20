import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import sharedGetStaticProps from "~/components/Document/lib/sharedGetStaticProps";
import SharedDocumentPage from "~/components/Document/lib/SharedDocumentPage";
import { useRouter } from "next/router";
import getDocumentFromRaw, {
  GenericDocument,
  isPaper,
  isPost,
} from "~/components/Document/lib/types";
import { captureEvent } from "~/config/utils/events";
import Error from "next/error";
import PDFViewer from "~/components/Document/PDFViewer";
import config from "~/components/Document/lib/config";
import { StyleSheet, css } from "aphrodite";

interface Args {
  documentData?: any;
  postHtml?: TrustedHTML | string;
  documentType: string;
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
    // Fixme: Show loading screen
    return <div style={{ fontSize: 48 }}>Loading...</div>;
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
            <PDFViewer pdfUrl={pdfUrl} />
          ) : (
            <div>
              <h2>Abstract</h2>
              <p>{document.abstract}</p>
            </div>
          )}
        </div>
      )}
      {isPost(document) && (
        <div
          className={css(styles.bodyWrapper)}
          dangerouslySetInnerHTML={{ __html: postHtml }}
        />
      )}
    </SharedDocumentPage>
  );
};

const styles = StyleSheet.create({
  bodyWrapper: {
    borderRadius: "4px",
    border: `1px solid ${config.border}`,
    marginTop: 15,
    minHeight: 800,
    padding: "25px",
    background: "white",
    width: "100%",
    boxSizing: "border-box",
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
