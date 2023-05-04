import HorizontalTabBar from "~/components/HorizontalTabBar";
import { useRouter } from "next/router";
import Error from "next/error";
import { getTabs } from "./tabbedNavigation";
import CommentFeed from "~/components/Comment/CommentFeed";
import getDocumentFromRaw from "./types";
import { TopLevelDocument } from "~/config/types/root_types";
import { captureEvent } from "~/config/utils/events";
import { parseComment } from "~/components/Comment/lib/types";
<<<<<<< HEAD
import API from "~/config/api";
import { useState } from "react";
=======
>>>>>>> d3ba4fd24 ([Doc V3] Fetching comment data during build time)

interface Args {
  documentData?: any;
  commentData?: any;
  errorCode?: number;
  documentType: string;
}

const SharedDocumentPage = ({ documentData, commentData, documentType, errorCode }: Args) => {
<<<<<<< HEAD

  console.log('documentData', documentData)
  console.log('commentData', commentData)
  console.log('documentType', documentType)

=======
>>>>>>> d3ba4fd24 ([Doc V3] Fetching comment data during build time)
  const router = useRouter();
  const tabs = getTabs({ router });
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
  catch (error) {
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
    <div>
      <HorizontalTabBar tabs={tabs} />
      {displayCommentsFeed &&
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
      }
    </div>
  );
};

export default SharedDocumentPage;
