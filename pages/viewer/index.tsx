import { NextPage } from "next/types";
import { useRouter } from "next/router";
import { fetchDocumentByType } from "~/components/Document/lib/fetchDocumentByType";
import { useEffect, useState } from "react";
import {
  ContentInstance,
  GenericDocument,
  isPost,
  parsePaper,
  parsePost,
} from "~/components/Document/lib/types";
import fetchPostFromS3 from "~/components/Document/api/fetchPostFromS3";
import { StyleSheet, css } from "aphrodite";
import DocumentPlaceholder from "~/components/Document/lib/Placeholders/DocumentPlaceholder";
import config from "~/components/Document/lib/config";
import { fetchCitation } from "~/components/ReferenceManager/lib/api";
import { useOrgs } from "~/components/contexts/OrganizationContext";
import DocumentViewer from "~/components/Document/DocumentViewer";

interface Props {}

const ViewerPage: NextPage<Props> = ({}) => {
  const router = useRouter();
  const [fetchedContent, setFetchedContent] = useState<boolean>(false);
  const [doc, setDoc] = useState<GenericDocument | null>(null);
  const [citation, setCitation] = useState<any | null>(null);
  const [postHtml, setPostHtml] = useState<any | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);
  const { orgs, currentOrg, setCurrentOrg } = useOrgs();

  useEffect(() => {
    const { contentType, contentId } = router.query;

    (async () => {
      try {
        if (contentType === "citationentry") {
          const citation = await fetchCitation({ citationId: contentId });

          if (citation) {
            setCitation(citation);
          } else {
            throw new Error(`Citation ${contentId} not found`);
          }
        } else if (contentType === "post" || contentType === "paper") {
          const document = await fetchDocumentByType({
            documentType: contentType,
            documentId: contentId,
          });

          const parsed =
            contentType === "paper"
              ? parsePaper(document)
              : parsePost(document);
          setDoc(parsed);
        } else {
          throw new Error("Invalid content type");
        }
      } catch (error) {
        console.log("Error fetching content. Error: ", error);
        setHasError(true);
      } finally {
        setFetchedContent(true);
      }
    })();
  }, [router.isReady]);

  useEffect(() => {
    if (doc && router.query.docType === "post") {
      (async () => {
        try {
          isPost(doc);
          const postHtml = await fetchPostFromS3({ s3Url: doc.srcUrl });
          setPostHtml(postHtml);
        } catch (error) {
          console.log("Error fetching post. Error: ", error);
          setHasError(true);
        }
      })();
    }
  }, [doc, router.query]);

  // Citation is associated with an organization.
  // We need to ensure the user has switched to the right org so that comments can be fetched downstream in AnnotationLayer
  useEffect(() => {
    if (citation?.organization && orgs.length > 0) {
      const org = orgs.find((o) => o.id === citation.organization);
      if (org) {
        setCurrentOrg!(org);
      } else {
        throw new Error(
          `User is not a member of organization ${citation.organization}`
        );
      }
    }
  }, [citation, orgs]);

  const getPdfUrl = () => {
    if (doc) {
      return doc && doc.formats.find((f) => f.type === "pdf")?.url;
    } else if (citation) {
      return citation.attachment;
    }
  };

  const { contentType, contentId } = router.query;
  const citationInstance: ContentInstance | undefined =
    contentType === "citationentry"
      ? ({ id: contentId, type: contentType } as ContentInstance)
      : undefined;
  const documentInstance: ContentInstance | undefined =
    contentType === "paper" || contentType === "post"
      ? ({ id: contentId, type: contentType } as ContentInstance)
      : undefined;

  const pdfUrl = getPdfUrl();
  const isReady =
    fetchedContent &&
    ((doc && postHtml && contentType === "post") ||
      (citation && contentType === "citationentry") ||
      (doc && contentType == "paper"));

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
          expandedOnlyMode={true}
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
