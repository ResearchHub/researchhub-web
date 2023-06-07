import { fetchCommentsAPI } from "~/components/Comment/lib/api";
import { getDocumentByType } from "./getDocumentByType";
import isEmpty from "lodash/isEmpty";
import fetchPostFromS3 from "../api/fetchPostFromS3";
import getCommentFilterByTab from "./getCommentFilterByTab";
import {
  DocumentType,
} from "~/components/Document/lib/types";
import fetchDocumentMetadata from "../api/fetchDocumentMetadata";

const config = {
  revalidateTimeIfNotFound: 1,
  revalidateTimeIfError: 10,
  revalidateTimeIfFound: 600,
};

interface Props {
  ctx: any;
  documentType: DocumentType;
}

export default async function sharedGetStaticProps({ ctx, documentType }: Props) {

  const { documentId, documentSlug } = ctx.params!;
  const tabName = ctx.params?.tabName || null;
  const shouldFetchComments = !isEmpty(tabName);
  let documentData: any | null = null;
  let commentData: any | null = null;
  let postHtml: any | null = null;
  let metadata: any | null = null;

  try {
    documentData = await getDocumentByType({ documentType, documentId });
    metadata = await fetchDocumentMetadata({
      unifiedDocId: documentData.unified_document.id,
    });

    console.log("metadata", metadata.documents[0].purchases)

  } catch (err) {
    console.log("Error getting document", err);
    return {
      props: {
        errorCode: 500,
        documentType,
        commentData,
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
          console.log("Failed to fetch post html from S3", error);
          return {
            props: {
              errorCode: 404,
              documentType,
              commentData,
              postHtml,
              tabName,
              metadata,
            },
            revalidate: config.revalidateTimeIfNotFound,
          };
        }
      }

      if (shouldFetchComments) {
        const filter = getCommentFilterByTab(tabName);
        commentData = await fetchCommentsAPI({
          documentId,
          documentType: (documentType === "post" ? "researchhub_post" : documentType),
          filter,
        });
      }

      return {
        props: {
          documentData,
          commentData,
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
        commentData,
        tabName,
        metadata,
      },
      revalidate: config.revalidateTimeIfNotFound,
    };
  }
}
