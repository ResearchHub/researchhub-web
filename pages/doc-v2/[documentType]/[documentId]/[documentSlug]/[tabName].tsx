import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import sharedGetStaticProps from "~/components/Document/lib/sharedGetStaticProps";
import SharedDocumentPage from "~/components/Document/lib/SharedDocumentPage";

interface Args {
  documentData?: any;
  commentData?: any;
  errorCode?: number;
  documentType: string;
}

const DocumentPage: NextPage<Args> = ({
  documentData,
  commentData,
  documentType,
  errorCode,
}) => {
  return (
    <SharedDocumentPage
      documentData={documentData}
      commentData={commentData}
      documentType={documentType}
      errorCode={errorCode}
    />
  );
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  return sharedGetStaticProps(ctx);
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      //   {
      //   params: {
      //     documentType: 'paper',
      //     documentId: '1276082',
      //     documentSlug: 'boundary-vector-cells-in-the-goldfish-central-telencephalon-encode-spatial-information',
      //     tabName: 'conversation',
      //   },
      // },
    ],
    fallback: true,
  };
};

export default DocumentPage;
