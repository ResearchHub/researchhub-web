import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import sharedGetStaticProps from "~/components/Document/lib/sharedGetStaticProps";
import SharedDocumentPage from "~/components/Document/lib/SharedDocumentPage";
import { useRouter } from "next/router";
import { TopLevelDocument } from "~/config/types/root_types";
import getDocumentFromRaw from "~/components/Document/lib/types";
import { captureEvent } from "~/config/utils/events";
import Error from "next/error";

interface Args {
  documentData?: any;
  documentType: string;
  errorCode?: number;
}

const DocumentPage: NextPage<Args> = ({
  documentData,
  documentType,
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

  let document: TopLevelDocument;
  try {
    document = getDocumentFromRaw({ raw: documentData, type: documentType });
  }
  catch (error) {
    captureEvent({ error, msg: "[Document] Could not parse", data: { documentData, documentType } });
    return <Error statusCode={500} />;
  }

  return (
    <SharedDocumentPage
      document={document}
      errorCode={errorCode}
      documentType={documentType}
    />
  );
};

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
