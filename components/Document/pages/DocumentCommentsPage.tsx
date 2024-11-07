import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import DocumentPageLayout from "~/components/Document/pages/DocumentPageLayout";
import { useContext, useEffect, useState } from "react";
import { captureEvent } from "~/config/utils/events";
import { COMMENT_TYPES, parseComment } from "~/components/Comment/lib/types";
import getDocumentFromRaw, {
  DocumentType,
  GenericDocument,
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHourglassHalf, faCheckCircle, faExclamationCircle } from "@fortawesome/free-solid-svg-icons"; // Import icons
import CommentEditor from "~/components/Comment/CommentEditor";
import { genClientId } from "~/config/utils/id";
import { fetchPeerReviewers } from "~/components/PeerReview/lib/api";
import { PeerReview } from "~/config/types/peerReview";


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

  const [peerReviewers, setPeerReviewers] = useState<PeerReview[]>([]);

  useEffect(() => {
    fetchPeerReviewers(17).then(setPeerReviewers);
  }, []);

  const [documentMetadata, setDocumentMetadata] = useDocumentMetadata({
    rawMetadata: metadata,
    unifiedDocumentId: documentData?.unified_document?.id,
  });
  const [document, setDocument] = useDocument({
    rawDocumentData: documentData,
    documentType,
  });
  const { revalidateDocument } = useCacheControl();

  const [showReviewEditor, setShowReviewEditor] = useState(false);
  const [editorType, setEditorType] = useState<COMMENT_TYPES | null>(null);

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
          {tabName === "reviews" && (
            <div className={"peer-reviews-section " + css(styles.peerReviewsSection)}>
              <h2>Peer Reviews</h2>
              <ul className={css(styles.list)}>
                {peerReviewers.map((reviewer) => (
                  <li key={reviewer.id} className={css(styles.versionCard)}>
                    <div className={css(styles.versionHeader)}>
                      <AuthorAvatar
                        size={32}
                        authorProfile={reviewer.user.authorProfile}
                      />
                      <div className={css(styles.versionInfo)}>
                        <div className={css(styles.versionLabel)}>
                          {reviewer.user.firstName} {reviewer.user.lastName}
                        </div>
                        <div className={css(styles.versionMessage)}>
                          Assigned on: {reviewer.createdDate.toLocaleDateString()}
                        </div>
                        <div className={css(styles.status)}>
                          {reviewer.status === "PENDING" && (
                            <>
                              <FontAwesomeIcon icon={faHourglassHalf} className={css(styles.pendingIcon)} />
                              <span className={css(styles.pendingText)}>Pending</span>
                            </>
                          )}
                          {reviewer.status === "APPROVED" && (
                            <>
                              <FontAwesomeIcon icon={faCheckCircle} className={css(styles.approvedIcon)} />
                              <span className={css(styles.approvedText)}>Approved</span>
                            </>
                          )}
                          {reviewer.status === "CHANGES_REQUESTED" && (
                            <>
                              <FontAwesomeIcon icon={faExclamationCircle} className={css(styles.changesRequestedIcon)} />
                              <span className={css(styles.changesRequestedText)}>Changes Requested</span>
                            </>
                          )}
                        </div>
                      </div>
                      {currentUser?.id === reviewer.user.id && (
                        <button
                          className={css(styles.switchButton)}
                          onClick={() => {
                            setEditorType(COMMENT_TYPES.PEER_REVIEW);
                            setShowReviewEditor(true);
                          }}
                        >
                          Add your Review
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              {showReviewEditor && (
                <div>
                  <button
                    className={css(styles.backButton)}
                    onClick={() => setShowReviewEditor(false)}
                  >
                    Back
                  </button>
                  <CommentEditor
                    editorId={genClientId()}
                    editorType={COMMENT_TYPES.PEER_REVIEW}
                    handleSubmit={async (props) => {
                      // Handle submit logic
                    }}
                    allowBounty={false}
                    author={currentUser?.authorProfile}
                    allowCommentTypeSelection={false}
                  />
                </div>
              )}
            </div>
          )}
          <div className={css(styles.communityReviewsSection)}>
            <h2>Community Reviews</h2>
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
  peerReviewsSection: {
    marginBottom: 20,
  },
  communityReviewsSection: {
    marginTop: 20,
  },
  list: {
    listStyleType: "none", // Remove bullet points
    padding: 0,
  },
  versionCard: {
    padding: 16,
    borderRadius: 8,
    border: "1px solid #E0E0E0",
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  versionHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
  },
  versionInfo: {
    flex: 1,
  },
  versionLabel: {
    fontWeight: 500,
    color: "#2a2a2a",
    display: "flex",
    alignItems: "center",
    marginBottom: 4,
  },
  versionMessage: {
    color: "#666",
    fontSize: 14,
    lineHeight: "1.4",
  },
  status: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  pendingIcon: {
    color: "orange",
  },
  approvedIcon: {
    color: "green",
  },
  changesRequestedIcon: {
    color: "red",
  },
  pendingText: {
    color: "orange",
  },
  approvedText: {
    color: "green",
  },
  changesRequestedText: {
    color: "red",
  },
  switchButton: {
    marginLeft: "auto",
    padding: "6px 12px",
    borderRadius: 4,
    border: `1px solid ${colors.NEW_BLUE()}`,
    backgroundColor: "white",
    color: colors.NEW_BLUE(),
    cursor: "pointer",
    fontSize: 13,
    display: "flex",
    alignItems: "center",
    gap: 8,
    ":hover": {
      backgroundColor: "#F5F9FF",
    },
    [`@media (max-width: ${breakpoints.mobile.str})`]: {
      padding: "6px",
      minWidth: 32,
      justifyContent: "center",
    },
  },
  backButton: {
    marginBottom: 10,
    padding: "6px 12px",
    borderRadius: 4,
    border: `1px solid ${colors.NEW_BLUE()}`,
    backgroundColor: "white",
    color: colors.NEW_BLUE(),
    cursor: "pointer",
    fontSize: 13,
    display: "flex",
    alignItems: "center",
    gap: 8,
    ":hover": {
      backgroundColor: "#F5F9FF",
    },
  },
});

export default DocumentCommentsPage;
