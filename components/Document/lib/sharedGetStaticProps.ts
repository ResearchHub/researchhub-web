import { fetchDocumentByType } from "./fetchDocumentByType";
import fetchPostFromS3 from "../api/fetchPostFromS3";
import { DocumentType } from "~/components/Document/lib/types";
import fetchDocumentMetadata from "../api/fetchDocumentMetadata";
import { captureException } from "@sentry/browser";

const config = {
  revalidateTimeIfNotFound: 1,
  revalidateTimeIfError: 10,
  revalidateTimeIfFound: 600,
};

interface Props {
  ctx: any;
  documentType: DocumentType;
}

export default async function sharedGetStaticProps({
  ctx,
  documentType,
}: Props) {
  const { documentId, documentSlug } = ctx.params!;
  const tabName = ctx.params?.tabName || null;
  let documentData: any | null = null;
  let postHtml: any | null = null;
  let metadata: any | null = null;

  try {
    documentData = await fetchDocumentByType({ documentType, documentId });
    metadata = await fetchDocumentMetadata({
      unifiedDocId: documentData.unified_document.id,
    });
  } catch (err: any) {
    captureException(err);
    return {
      props: {
        errorCode: err?.response?.status || 500,
        documentType,
        postHtml,
        tabName,
        metadata,
      },
      // If paper has an error, we want to try again immediately
      revalidate: config.revalidateTimeIfError,
    };
  }

  if (documentData) {
    // If slug is not present or does not match paper's, we want to redirect
    // DANGER ZONE: Be careful when updating this. Could result
    // in an infinite 301 loop.
    const shouldRedirect =
      !documentData.slug || documentData.slug !== documentSlug;

    if (shouldRedirect) {
      return {
        redirect: {
          destination: `/${documentType}/${documentId}/${documentData.slug}`,
          permanent: true,
        },
      };
    } else {
      if (documentType === "post") {
        try {
          postHtml = await fetchPostFromS3({ s3Url: documentData.post_src });
        } catch (error) {
          captureException(error);
          console.log("Failed to fetch post html from S3", error);
          return {
            props: {
              errorCode: 404,
              documentType,
              postHtml,
              tabName,
              metadata,
            },
            revalidate: config.revalidateTimeIfNotFound,
          };
        }
      }

      documentData["postHtml"] = postHtml;

      return {
        props: {
          documentData,
          documentType,
          postHtml,
          tabName,
          metadata,
        },
        revalidate: config.revalidateTimeIfFound,
      };
    }
  } else {
    return {
      props: {
        errorCode: 404,
        documentType,
        postHtml,
        tabName,
        metadata,
      },
      revalidate: config.revalidateTimeIfNotFound,
    };
  }
}
