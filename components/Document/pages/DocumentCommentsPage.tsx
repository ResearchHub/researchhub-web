import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import DocumentPageLayout from "~/components/Document/pages/DocumentPageLayout";
import { useContext, useState } from "react";
import { captureEvent } from "~/config/utils/events";
import { COMMENT_TYPES, parseComment } from "~/components/Comment/lib/types";
import getDocumentFromRaw, {
  DocumentType,
  GenericDocument,
} from "~/components/Document/lib/types";
import Error from "next/error";
import { useRouter } from "next/router";
import CommentFeed from "~/components/Comment/CommentFeed";
import DocumentPagePlaceholder from "~/components/Document/lib/Placeholders/DocumentPagePlaceholder";
import { DocumentContext } from "~/components/Document/lib/DocumentContext";
import useDocumentMetadata from "~/components/Document/lib/useDocumentMetadata";
import getCommentFilterByTab from "~/components/Document/lib/getCommentFilterByTab";
import config from "~/components/Document/lib/config";
import { StyleSheet, css } from "aphrodite";
import useCacheControl from "~/config/hooks/useCacheControl";


const getEditorTypeFromTabName = (tabName: string):COMMENT_TYPES => {
  switch(tabName) {
    case 'reviews':
      return COMMENT_TYPES.REVIEW;
    case 'bounties':
    case 'conversation':
    default:
      return COMMENT_TYPES.DISCUSSION;
  }
}

interface Args {
  documentData?: any;
  commentData?: any;
  errorCode?: number;
  documentType: DocumentType;
  tabName: string;
}

const DocumentCommentsPage: NextPage<Args> = ({
  documentData,
  commentData,
  documentType,
  tabName,
  errorCode,
}) => {
  const router = useRouter();
  const [metadata, updateMetadata] = useDocumentMetadata({ id: documentData?.unified_document?.id });
  const [viewerWidth, setViewerWidth] = useState<number | undefined>(config.maxWidth);
  const [revalidatePage] = useCacheControl();

  if (router.isFallback) {
    return <DocumentPagePlaceholder />;
  }
  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  let document: GenericDocument;
  try {
    document = getDocumentFromRaw({ raw: documentData, type: documentType });
  } catch (error: any) {
    captureEvent({
      error,
      msg: "[Document] Could not parse",
      data: { documentData, documentType },
    });
    return <Error statusCode={500} />;
  }


  let displayCommentsFeed = false;
  let parsedComments = [];
  let commentCount = 0;
  if (commentData) {
    const { comments, count } = commentData;
    commentCount = count;
    parsedComments = comments.map((c) => parseComment({ raw: c }));
    displayCommentsFeed = true;
  }

  return (
    <DocumentContext.Provider value={{ metadata, documentType, tabName, updateMetadata }}>
      <DocumentPageLayout
        document={document}
        documentType={documentType}
        tabName={tabName}
        errorCode={errorCode}
        metadata={metadata}
      >
        <div className={css(styles.bodyContentWrapper)} style={{ width: viewerWidth }}>
          <CommentFeed
            initialComments={parsedComments}
            document={document}
            showFilters={false}
            initialFilter={getCommentFilterByTab(tabName)}
            editorType={getEditorTypeFromTabName(tabName)}
            allowBounty={tabName === "bounties"}
            allowCommentTypeSelection={false}
            // The primary reason for these callbacks is to "optimistically" update the metadata on the page and refresh the cache.
            // Not every use case is taken into account since many scenarios are uncommon. For those, a page refresh will be required.
            onCommentCreate={(comment) => {
              revalidatePage();

              if (!metadata) return;
              if (comment.bounties.length > 0) {
                updateMetadata({
                  ...metadata,
                  bounties: [comment.bounties[0], ...metadata.bounties],
                });
              }
              else if (comment.commentType === COMMENT_TYPES.REVIEW) {
                updateMetadata({
                  ...metadata,
                  reviewCount: metadata.reviewCount + 1,
                });
              }
              else {
                updateMetadata({
                  ...metadata,
                  discussionCount: metadata.discussionCount + 1,
                });
              }

            }}
            onCommentUpdate={() => {
              revalidatePage();
            }}
            onCommentRemove={(comment) => {
              revalidatePage();
            }}
            totalCommentCount={commentCount}
          />
        </div>
      </DocumentPageLayout>
    </DocumentContext.Provider>
  );
};

const styles = StyleSheet.create({
  bodyContentWrapper: {
    margin: "0 auto",
  },  
});

export default DocumentCommentsPage;