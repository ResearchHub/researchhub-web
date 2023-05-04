import HorizontalTabBar from "~/components/HorizontalTabBar";
import { useRouter } from "next/router";
import Error from "next/error";
import { getTabs } from "./tabbedNavigation";
import CommentFeed from "~/components/Comment/CommentFeed";
import getDocumentFromRaw from "./types";
import { TopLevelDocument } from "~/config/types/root_types";
import { captureEvent } from "~/config/utils/events";
import { parseComment } from "~/components/Comment/lib/types";

interface Args {
  documentData?: any;
  commentData?: any;
  errorCode?: number;
  documentType: string;
}

const SharedDocumentPage = ({ documentData, commentData, documentType, errorCode }: Args) => {
  const router = useRouter();
  const tabs = getTabs({ router });

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
            alert('implement me');
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
