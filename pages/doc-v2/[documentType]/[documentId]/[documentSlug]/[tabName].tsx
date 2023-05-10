import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import sharedGetStaticProps from "~/components/Document/lib/sharedGetStaticProps";
import SharedDocumentPage from "~/components/Document/lib/SharedDocumentPage";
import API from "~/config/api";
import CommentFeed from "~/components/Comment/CommentFeed";
import { useState } from "react";
import { TopLevelDocument } from "~/config/types/root_types";
import { captureEvent } from "~/config/utils/events";
import { parseComment } from "~/components/Comment/lib/types";
import getDocumentFromRaw from "~/components/Document/lib/types";
import Error from "next/error";
import { useRouter } from "next/router";

interface Args {
  documentData?: any;
  commentData?: any;
  errorCode?: number;
  documentType: string;
  tabName?: string;
}

const DocumentPage: NextPage<Args> = ({
  documentData,
  commentData,
  documentType,
  tabName,
  errorCode,
}) => {
  const router = useRouter();
  const [commentCount, setCommentCount] = useState(commentData?.count || 0);

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
  catch (error:any) {
    captureEvent({ error, msg: "[Document] Could not parse", data: { documentData, documentType } });
    return <Error statusCode={500} />;
  }

  let displayCommentsFeed = false;
  let parsedComments = [];
  if (commentData) {
    const { comments } = commentData;
    parsedComments = comments.map(c => parseComment({raw: c}));
    displayCommentsFeed = true;
  }  

  return (
    <SharedDocumentPage
      document={document}
      documentType={documentType}
      tabName={tabName}
      errorCode={errorCode}
    >
      <CommentFeed
        initialComments={parsedComments}
        document={document}
        onCommentCreate={() => {
          fetch(
            "/api/revalidate",
            API.POST_CONFIG({
              path: router.asPath,
            })
          );
          setCommentCount(commentCount + 1);
        }}
        onCommentRemove={() => {
          alert('implement me');
        }}
        totalCommentCount={commentData.count}
      />
    </SharedDocumentPage>
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
