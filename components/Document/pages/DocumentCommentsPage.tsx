import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import DocumentPageLayout from "~/components/Document/pages/DocumentPageLayout";
import { useContext, useEffect, useState } from "react";
import { captureEvent } from "~/config/utils/events";
import { COMMENT_TYPES, parseComment } from "~/components/Comment/lib/types";
import getDocumentFromRaw, {
  DocumentType,
  GenericDocument,
  isPaper,
  Post,
} from "~/components/Document/lib/types";
import Error from "next/error";
import { useRouter } from "next/router";
import CommentFeed from "~/components/Comment/CommentFeed";
import DocumentPagePlaceholder from "~/components/Document/lib/Placeholders/DocumentPagePlaceholder";
import { DocumentContext } from "~/components/Document/lib/DocumentContext";
import getCommentFilterByTab from "~/components/Document/lib/getCommentFilterByTab";
import config from "~/components/Document/lib/config";
import { StyleSheet, css } from "aphrodite";
import useCacheControl from "~/config/hooks/useCacheControl";
import { useDocument, useDocumentMetadata } from "../lib/useHooks";
import useCurrentUser from "~/config/hooks/useCurrentUser";
import AuthorAvatar from "~/components/AuthorAvatar";
import { breakpoints } from "~/config/themes/screen";
import colors from "~/config/themes/colors";
import { faHourglassHalf, faCheckCircle, faExclamationCircle } from "@fortawesome/free-solid-svg-icons"; // Import icons
import CommentEditor from "~/components/Comment/CommentEditor";
import { genClientId } from "~/config/utils/id";
import { fetchPeerReviewers } from "~/components/PeerReview/lib/api";
import { PeerReview } from "~/config/types/peerReview";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faStar, // Changed from faPenToSquare
  faComments // For Community Reviews
} from "@fortawesome/pro-regular-svg-icons";


interface Args {
  documentData?: any;
  metadata?: any;
  errorCode?: number;
  documentType: DocumentType;
  tabName: string;
}

const DocumentCommentsPage: NextPage<Args> = ({
  documentData,
  documentType,
  tabName,
  metadata,
  errorCode,
}) => {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const [viewerWidth, setViewerWidth] = useState<number | undefined>(
    config.width
  );

  const [documentMetadata, setDocumentMetadata] = useDocumentMetadata({
    rawMetadata: metadata,
    unifiedDocumentId: documentData?.unified_document?.id,
  });
  const [document, setDocument] = useDocument({
    rawDocumentData: documentData,
    documentType,
  });
  const { revalidateDocument } = useCacheControl();

  if (router.isFallback) {
    return <DocumentPagePlaceholder />;
  }
  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  if (!document || !documentMetadata) {
    captureEvent({
      msg: "[Document] Could not parse",
      data: { document, documentType, documentMetadata },
    });
    return <Error statusCode={500} />;
  }

  const isAssignedReviewer = isPaper(document) && document.peerReviews.some(
    review => review.user.id === currentUser?.id && review.status === "PENDING"
  );

  const commentCount = 0;

  return (
    <DocumentContext.Provider
      value={{
        metadata: documentMetadata,
        documentType,
        tabName,
        updateMetadata: setDocumentMetadata,
        updateDocument: setDocument,
      }}
    >
      <DocumentPageLayout
        document={document}
        documentType={documentType}
        tabName={tabName}
        errorCode={errorCode}
        metadata={documentMetadata}
      >
        <div
          className={css(styles.bodyContentWrapper)}
          style={{ maxWidth: viewerWidth }}
        >
          {tabName === "reviews" && isAssignedReviewer && (
            <div className={"peer-reviews-section " + css(styles.peerReviewEditor)}>
              <div className={css(styles.sectionHeaderWrapper)}>
                <h2 className={css(styles.sectionHeader)}>
                  <FontAwesomeIcon 
                    icon={faStar} 
                    className={css(styles.headerIcon)} 
                  />
                  Peer Reviews
                </h2>
                <p className={css(styles.sectionSubtext)}>
                  Editorially curated peer reviews from our network of experts
                </p>
              </div>
              <CommentEditor
                editorId={genClientId()}
                commentType={COMMENT_TYPES.PEER_REVIEW}
                handleSubmit={async (props) => {
                  // Handle submit logic
                  await revalidateDocument();
                }}
                allowBounty={false}
                author={currentUser?.authorProfile}
                allowCommentTypeSelection={false}
              />
            </div>
          )}
          <div className={css(styles.communityReviewsSection)}>
            <div className={css(styles.sectionHeaderWrapper)}>
              <h2 className={css(styles.sectionHeader)}>
                <FontAwesomeIcon 
                  icon={faComments} 
                  className={css(styles.headerIcon)} 
                />
                Community Reviews
              </h2>
              <p className={css(styles.sectionSubtext)}>
                Reviews completed by members of our research community
              </p>
            </div>
            <CommentFeed
              document={document}
              showFilters={false}
              initialFilter={getCommentFilterByTab(tabName)}
              editorType={COMMENT_TYPES.REVIEW}
              allowBounty={false}
              allowCommentTypeSelection={false}
              onCommentCreate={(comment) => {
                revalidateDocument();
                if (!documentMetadata) return;
                if (comment.commentType === COMMENT_TYPES.REVIEW) {
                  setDocumentMetadata({
                    ...documentMetadata,
                    reviewCount: documentMetadata.reviewCount + 1,
                  });
                }
              }}
              onCommentUpdate={() => {
                revalidateDocument();
              }}
              onCommentRemove={(comment) => {
                revalidateDocument();
              }}
              totalCommentCount={commentCount}
            />
          </div>
        </div>
      </DocumentPageLayout>
    </DocumentContext.Provider>
  );
};

const styles = StyleSheet.create({
  bodyContentWrapper: {
    margin: "0 auto",
  },
  peerReviewEditor: {
    marginBottom: 32,
  },
  communityReviewsSection: {
    marginTop: 20,
  },
  sectionHeaderWrapper: {
    marginBottom: 16,
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 20,
    fontWeight: 500,
    color: colors.BLACK(0.8),
    marginBottom: 4,
  },
  headerIcon: {
    fontSize: 18,
    color: colors.BLACK(0.6),
  },
  sectionSubtext: {
    fontSize: 14,
    color: colors.BLACK(0.5),
    marginLeft: 26,
  },
});

export default DocumentCommentsPage;
