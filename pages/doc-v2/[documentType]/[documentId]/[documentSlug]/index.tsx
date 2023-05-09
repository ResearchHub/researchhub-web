import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import sharedGetStaticProps from "~/components/Document/lib/sharedGetStaticProps";
import SharedDocumentPage from "~/components/Document/lib/SharedDocumentPage";

interface Args {
  documentData?: any;
  errorCode?: number;
}

const DocumentPage: NextPage<Args> = ({ documentData, errorCode }) => {
  return (
    <SharedDocumentPage documentData={documentData} errorCode={errorCode} />
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
