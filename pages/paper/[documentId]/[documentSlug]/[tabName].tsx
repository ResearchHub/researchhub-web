import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import DocumentCommentsPage from "~/components/Document/pages/DocumentCommentsPage";
import sharedGetStaticProps from "~/components/Document/lib/sharedGetStaticProps";
import DocumentChangesPage from "~/components/Document/pages/DocumentChangesPage";

interface Args {
  documentData?: any;
  commentData?: any;
  errorCode?: number;
  tabName: string;
  metadata?: any;
}

const TabPage: NextPage<Args> = ({
  documentData,
  tabName,
  errorCode,
  metadata,
}) => {

  if (tabName === "changes") {
    return (
      <DocumentChangesPage
        documentData={documentData}
        documentType="paper"
        tabName={tabName}
        metadata={metadata}
        errorCode={errorCode}
      />
    );
  }
  else {
    return (
      <DocumentCommentsPage
        documentData={documentData}
        documentType="paper"
        metadata={metadata}
        tabName={tabName}
        errorCode={errorCode}
      />
    );
  }

};

export const getStaticProps: GetStaticProps = async (ctx) => {
  return sharedGetStaticProps({ ctx, documentType: "paper" });
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export default TabPage;
