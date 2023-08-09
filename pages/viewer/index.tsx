import { NextPage } from "next/types";
import DocumentViewer from "~/components/Document/DocumentViewer";
import { useRouter } from "next/router";
import { fetchDocumentByType } from "~/components/Document/lib/fetchDocumentByType";
import { useEffect, useState } from "react";
import {
  ContentInstance,
  GenericDocument,
  isPaper,
  isPost,
  parsePaper,
  parsePost,
} from "~/components/Document/lib/types";
import fetchPostFromS3 from "~/components/Document/api/fetchPostFromS3";
import { StyleSheet, css } from "aphrodite";
import DocumentPlaceholder from "~/components/Document/lib/Placeholders/DocumentPlaceholder";
import config from "~/components/Document/lib/config";

interface Props {}

const ViewerPage: NextPage<Props> = ({}) => {
  const router = useRouter();
  const [fetchedPostHtml, setFetchedPostHtml] = useState<boolean>(false);
  const [fetchedDocument, setFetchedDocument] = useState<boolean>(false);
  const [doc, setDoc] = useState<GenericDocument | null>(null);
  const [postHtml, setPostHtml] = useState<any | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const needsDocument =
      router.isReady && router.query.docId && router.query.docType;
    if (!needsDocument) return;

    const { docType, docId, citationId } = router.query;

    (async () => {
      try {
        const document = await fetchDocumentByType({
          documentType: docType,
          documentId: docId,
        });

        const parsed =
          docType === "paper" ? parsePaper(document) : parsePost(document);
        setDoc(parsed);
      } catch (error) {
        setHasError(true);
      } finally {
        setFetchedDocument(true);
      }
    })();
  }, [router.isReady]);

  useEffect(() => {
    if (!doc || router.query.docType !== "post") return;

    (async () => {
      try {
        isPost(doc);
        const postHtml = await fetchPostFromS3({ s3Url: doc.srcUrl });
        setPostHtml(postHtml);
      } catch (error) {
        setHasError(true);
      } finally {
        setFetchedPostHtml(true);
      }
    })();
  }, [doc, router.query]);

  const { docType, docId, citationId } = router.query;
  const citationInstance: ContentInstance | undefined = citationId
    ? ({ id: citationId, type: "citation" } as ContentInstance)
    : undefined;
  const documentInstance: ContentInstance | undefined = router?.query?.docId
    ? ({ id: docId, type: docType } as ContentInstance)
    : undefined;

  const pdfUrl = doc && doc.formats.find((f) => f.type === "pdf")?.url;
  const isReady =
    (docType === "post" && fetchedPostHtml) ||
    (docType == "paper" && fetchedDocument);

  return (
    <div className={css(styles.wrapper)}>
      {isReady || hasError ? (
        <DocumentViewer
          postHtml={postHtml}
          pdfUrl={pdfUrl}
          hasError={hasError}
          citationInstance={citationInstance}
          documentInstance={documentInstance}
          document={doc}
          expanded={true}
          onClose={() => null}
        />
      ) : (
        <div className={css(styles.loadingWrapper)}>
          <DocumentPlaceholder />
        </div>
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    background: "rgb(230, 230, 230, 1.0)",
  },
  loadingWrapper: {
    background: "white",
    maxWidth: config.width,
    margin: "75px auto 0 auto",
  },
});

export default ViewerPage;
