import { fetchCommentsAPI } from "~/components/Comment/lib/api";
import { fetchPaper } from "~/components/Paper/lib/api";

const config = {
  revalidateTimeIfNotFound: 1,
  revalidateTimeIfError: 10,
  revalidateTimeIfFound: 600,
};

const getDocumentByType = async ({ documentType, documentId }) => {
  switch (documentType) {
    case "paper":
      return fetchPaper({ paperId: documentId });
    default:
      throw new Error(`Invalid document type. Type was ${documentType}`);
  }
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
}

export default async function sharedGetStaticProps(ctx) {
  const { documentId, documentType, documentSlug, tabName } = ctx.params!;
  const shouldFetchComments = tabName !== undefined
  let documentData;
  let commentData;

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
    const shouldRedirect = !documentData.slug || documentData.slug !== documentSlug;
    if (shouldRedirect) {
      return {
        redirect: {
          destination: `/${documentType}/${documentId}/${documentData.slug}`,
          permanent: true,
        },
      };
    } else {
      if (shouldFetchComments) {
        const filter =  await getCommentFilterByTab({ tabName })
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
