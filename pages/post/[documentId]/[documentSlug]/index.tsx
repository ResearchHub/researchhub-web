import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import sharedGetStaticProps from "~/components/Document/lib/sharedGetStaticProps";
import DocumentPostPageType from "~/components/Document/lib/DocumentPostPageType";

interface Args {
  documentData?: any;
  metadata?: any;
  postHtml?: TrustedHTML | string;
  errorCode?: number;
}

const DocumentIndexPage: NextPage<Args> = ({
  documentData,
  metadata,
  postHtml = "",
  errorCode,
}) => {
  return (
    <DocumentPostPageType
      documentData={documentData}
      metadata={metadata}
      postHtml={postHtml}
      errorCode={errorCode}
    />
  )
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  return sharedGetStaticProps({ ctx, documentType: "post" });
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export default DocumentIndexPage;
