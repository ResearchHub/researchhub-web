import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import DocumentCommentsPage from "~/components/Document/pages/DocumentCommentsPage";
import sharedGetStaticProps from "~/components/Document/lib/sharedGetStaticProps";

interface Args {
  documentData?: any;
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
  return (
    <DocumentCommentsPage
      documentData={documentData}
      documentType="post"
      tabName={tabName}
      metadata={metadata}
      errorCode={errorCode}
    />
  );
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  return sharedGetStaticProps({ ctx, documentType: "post" });
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      //   {
      //   params: {
      //     documentType: 'post',
      //     documentId: '1276082',
      //     documentSlug: 'boundary-vector-cells-in-the-goldfish-central-telencephalon-encode-spatial-information',
      //     tabName: 'conversation',
      //   },
      // },
    ],
    fallback: true,
  };
};

export default TabPage;
