import { NextPage } from "next";
import DocumentPageLayout from "~/components/Document/pages/DocumentPageLayout";
import { useRouter } from "next/router";
import { Post } from "~/components/Document/lib/types";
import { captureEvent } from "~/config/utils/events";
import Error from "next/error";
import config from "~/components/Document/lib/config";
import { StyleSheet, css } from "aphrodite";
import DocumentPagePlaceholder from "~/components/Document/lib/Placeholders/DocumentPagePlaceholder";
import { useEffect, useRef, useState } from "react";
import {
  useDocument,
  useDocumentMetadata,
} from "~/components/Document/lib/useHooks";
import {
  DocumentContext,
  DocumentPreferences,
} from "~/components/Document/lib/DocumentContext";
import {
  LEFT_SIDEBAR_MAX_WIDTH,
  LEFT_SIDEBAR_MIN_WIDTH,
} from "~/components/Home/sidebar/RootLeftSidebar";
import { breakpoints } from "~/config/themes/screen";
import DocumentViewer, {
  ZoomAction,
} from "~/components/Document/DocumentViewer";
import CommentFeed from "~/components/Comment/CommentFeed";
import { COMMENT_TYPES } from "~/components/Comment/lib/types";
import useCacheControl from "~/config/hooks/useCacheControl";
import colors from "~/config/themes/colors";
import EditQuestionModal from "./EditQuestionModal";

interface Args {
  documentData?: any;
  metadata?: any;
  postHtml?: TrustedHTML | string;
  errorCode?: number;
}

const DocumentPostPageType: NextPage<Args> = ({
  documentData,
  metadata,
  postHtml = "",
  errorCode,
}) => {
  const { revalidateDocument } = useCacheControl();
  const documentType = "post";
  const isQuestion = documentData?.document_type === "QUESTION";

  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [viewerWidth, setViewerWidth] = useState<number | undefined>(
    config.width
  );
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [_postHtml, setPostHtml] = useState<TrustedHTML | string>(postHtml);
  const [docPreferences, setDocPreferences] = useState<DocumentPreferences>({
    comments: "all",
  });
  const [documentMetadata, setDocumentMetadata] = useDocumentMetadata({
    rawMetadata: metadata,
    unifiedDocumentId: documentData?.unified_document?.id,
  });
  const [document, setDocument] = useDocument({
    rawDocumentData: documentData,
    documentType,
  }) as [Post | null, Function];

  useEffect(() => {
    setPostHtml(postHtml);
  }, [postHtml]);

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

  return (
    <div>
      <DocumentContext.Provider
        value={{
          metadata: documentMetadata,
          documentType,
          preferences: docPreferences,
          updateDocument: (doc) => {
            setDocument(doc);
            setPostHtml(doc.postHtml);

            setDocumentMetadata({
              ...documentMetadata,
              hubs: doc.hubs,
            });

            revalidateDocument();
          },
          updateMetadata: setDocumentMetadata,
          setPreference: ({ key, value }) =>
            setDocPreferences({ ...docPreferences, [key]: value }),
          editDocument: () => {
            // Post
            if (document.note) {
              router.push(
                `/${document.note.organization.slug}/notebook/${document.note.id}`
              );
            }
            // Question
            else {
              setIsEditing(true);
            }
          },
        }}
      >
        <EditQuestionModal
          post={document}
          isOpen={isEditing}
          handleClose={() => setIsEditing(false)}
        />
        <DocumentPageLayout
          document={document}
          errorCode={errorCode}
          metadata={documentMetadata}
          documentType={documentType}
        >
          <div className={css(styles.bodyContentWrapper)}>
            <div
              className={css(styles.bodyWrapper)}
              style={{ maxWidth: viewerWidth, margin: "0 auto" }}
            >
              <DocumentViewer
                isPost={true}
                // @ts-ignore
                postHtml={_postHtml}
                documentInstance={{
                  id: document.id,
                  type: "researchhubpost",
                }}
                document={document}
                metadata={documentMetadata}
                viewerWidth={config.width}
                allowAnnotations={!isQuestion}
                withControls={!isQuestion}
                onZoom={(zoom: ZoomAction) => {
                  if (!zoom.isExpanded) {
                    setViewerWidth(zoom.newWidth);
                  }
                }}
              />
            </div>
            <div style={{ maxWidth: viewerWidth, margin: "20px auto 0 auto" }}>
              <div className={css(styles.subheader)}>
                {isQuestion ? "Answers" : "Discussion"}
              </div>
              <CommentFeed
                document={document}
                showFilters={false}
                showSort={false}
                tabName={"conversation"}
                initialFilter={null}
                editorType={COMMENT_TYPES.DISCUSSION}
                allowBounty={false}
                allowCommentTypeSelection={false}
                onCommentCreate={(comment) => {
                  revalidateDocument();
                  if (!documentMetadata) return;
                  if (comment.bounties.length > 0) {
                    setDocumentMetadata({
                      ...documentMetadata,
                      bounties: [
                        comment.bounties[0],
                        ...documentMetadata.bounties,
                      ],
                    });
                  } else if (comment.commentType === COMMENT_TYPES.REVIEW) {
                    setDocumentMetadata({
                      ...documentMetadata,
                      reviewCount: documentMetadata.reviewCount + 1,
                    });
                  } else {
                    setDocumentMetadata({
                      ...documentMetadata,
                      discussionCount: documentMetadata.discussionCount + 1,
                    });
                  }
                }}
                onCommentUpdate={() => {
                  revalidateDocument();
                }}
                onCommentRemove={(comment) => {
                  revalidateDocument();
                }}
              />
            </div>
          </div>
        </DocumentPageLayout>
      </DocumentContext.Provider>
    </div>
  );
};

const styles = StyleSheet.create({
  bodyWrapper: {
    borderRadius: "4px",
    marginTop: 15,
    width: "100%",
    boxSizing: "border-box",
  },
  subheader: {
    marginTop: 50,
    marginBottom: 15,
    fontSize: 22,
    fontWeight: 600,
    color: colors.GREY_HEADING(),
  },
  editor: {
    padding: 45,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      padding: 15,
    },
  },
  bodyContentWrapper: {
    margin: "0 auto",
    maxWidth: `calc(100vw - ${LEFT_SIDEBAR_MAX_WIDTH}px)`,
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      maxWidth: `calc(100vw - ${LEFT_SIDEBAR_MIN_WIDTH + 40}px)`,
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      maxWidth: `calc(100vw - 30px)`,
    },
  },
  editButtonRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
    columnGap: "15px",
  },
});

export default DocumentPostPageType;
