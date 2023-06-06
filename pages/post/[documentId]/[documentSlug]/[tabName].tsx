import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import DocumentCommentsPage from "~/components/Document/pages/DocumentCommentsPage";
import sharedGetStaticProps from "~/components/Document/lib/sharedGetStaticProps";

interface Args {
  documentData?: any;
  commentData?: any;
  errorCode?: number;
  tabName: string;
}

const TabPage: NextPage<Args> = ({
  documentData,
  commentData,
  tabName,
  errorCode,
}) => {
  return (
    <DocumentCommentsPage
      documentData={documentData}
      documentType="post"
      tabName={tabName}
      commentData={commentData}
      errorCode={errorCode}
    />
  )
}


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
