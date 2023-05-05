import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import sharedGetStaticProps from "~/components/Document/lib/sharedGetStaticProps";
import SharedDocumentPage from "~/components/Document/lib/SharedDocumentPage";

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
  return (
    <SharedDocumentPage
      documentData={documentData}
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
