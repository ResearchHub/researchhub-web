import { fetchPaper } from "~/components/Paper/lib/api";

const config = {
  revalidateTimeIfNotFound: 1,
  revalidateTimeIfError: 10,
  revalidateTimeIfFound: 600,
}

const getDocumentByType = async ({ documentType, documentId }) => {
  switch (documentType) {
    case "paper":
      return fetchPaper({ paperId: documentId });
    default:
      return null;
  }
}

export default async function sharedGetStaticProps(ctx) {
  const { documentId, documentType, documentSlug } = ctx.params!;
  let documentData;

  try {
    documentData = await getDocumentByType({ documentType, documentId });
  } catch (err) {
    console.log('error', err);
    return {
      props: {
        errorCode: 500
      },
      // If paper has an error, we want to try again immediately
      revalidate: config.revalidateTimeIfError,
    };
  }

  if (documentData) {
    // If slug is not present or does not match paper's, we want to redirect
    // DANGER ZONE: Be careful when updating this. Could result
    // in an infinite 301 loop.
    if (documentData.slug && documentData.slug === documentSlug) {
      return {
        props: {
          documentData
        },
        revalidate: config.revalidateTimeIfFound,
      }
    } else {
      return {
        redirect: {
          destination: `/${documentType}/${documentId}/${documentData.slug}`,
          permanent: true,
        },
      };
    }
  }
  else {
    return {
      props: {
        errorCode: 404,
      },
      revalidate: config.revalidateTimeIfNotFound,
    };
  }
}
