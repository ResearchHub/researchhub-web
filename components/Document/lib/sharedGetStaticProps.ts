import { fetchCommentsAPI } from "~/components/Comment/lib/api";
import { getDocumentByType } from "./getDocumentByType";

const config = {
  revalidateTimeIfNotFound: 1,
  revalidateTimeIfError: 10,
  revalidateTimeIfFound: 600,
};

const getCommentFilterByTab = async ({ tabName }) => {
  switch (tabName) {
    case "bounties":
      return "BOUNTY";
    case "peer-reviews":
      return "REVIEW";
    case "conversation":
    default:
      return null;
  }
};

export default async function sharedGetStaticProps(ctx) {
  const { documentId, documentType, documentSlug, tabName } = ctx.params!;
  const shouldFetchComments = tabName !== undefined;
  let documentData: any | null = null;
  let commentData: any | null = null;

  try {
    documentData = await getDocumentByType({ documentType, documentId });
  } catch (err) {
    console.log("error", err);
    return {
      props: {
        errorCode: 500,
        documentType,
        commentData,
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
      if (shouldFetchComments) {
        const filter = await getCommentFilterByTab({ tabName });
        commentData = await fetchCommentsAPI({
          documentId,
          documentType,
          filter,
        });
      }

      return {
        props: {
          documentData,
          commentData,
          documentType,
        },
        revalidate: config.revalidateTimeIfFound,
      };
    }
  } else {
    return {
      props: {
        errorCode: 404,
        documentType,
        commentData,
      },
      revalidate: config.revalidateTimeIfNotFound,
    };
  }
}
