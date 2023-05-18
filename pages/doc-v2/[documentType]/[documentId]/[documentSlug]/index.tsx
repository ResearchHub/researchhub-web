import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import sharedGetStaticProps from "~/components/Document/lib/sharedGetStaticProps";
import SharedDocumentPage from "~/components/Document/lib/SharedDocumentPage";
import { useRouter } from "next/router";
import getDocumentFromRaw, {
  GenericDocument,
} from "~/components/Document/lib/types";
import { captureEvent } from "~/config/utils/events";
import Error from "next/error";
import PDFViewer from "~/components/Document/PDFViewer";

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

  return (
    <SharedDocumentPage
      document={document}
      errorCode={errorCode}
      documentType={documentType}
    >
      <PDFViewer pdfUrl="https://researchhub-paper-dev1.s3.amazonaws.com/uploads/papers/2021/08/25/2020.11.16.385385v1.pdf?AWSAccessKeyId=AKIA3RZN3OVNNBYLSFM3&Signature=MV7YhVlcApr5Vj%2FoZem%2FHKiP%2B%2BE%3D&Expires=1684956823" />
    </SharedDocumentPage>
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
