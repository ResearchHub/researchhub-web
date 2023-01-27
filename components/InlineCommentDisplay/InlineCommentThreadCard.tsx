/* - calvinhlee: this file utilizes functionalities that are legacy, I'm suppressing some warnings in this file */
// @ts-ignore
import { connect } from "react-redux";
import { useRouter } from "next/router";
import ReactPlaceholder from "react-placeholder/lib";
// Config
import { inlineThreadFetchTarget } from "./api/InlineThreadFetch";
import InlineCommentUnduxStore, {
  cleanupStoreAndCloseDisplay,
  InlineComment,
} from "../PaperDraftInlineComment/undux/InlineCommentUnduxStore";
// Components
import colors from "../../config/themes/colors";
import ColumnContainer from "../Paper/SideColumn/ColumnContainer";
import { css, StyleSheet } from "aphrodite";
import DiscussionPostMetadata from "../DiscussionPostMetadata.js";
import InlineCommentComposer from "./InlineCommentComposer";
import { ReactElement, useEffect, useState } from "react";
import {
  getScrollToTargetElFnc,
  getTargetInlineDraftEntityEl,
} from "./util/InlineCommentThreadUtil";
import { INLINE_COMMENT_DISCUSSION_URI_SOUCE } from "./api/InlineCommentAPIConstants";
import { MessageActions } from "../../redux/message";
import { ModalActions } from "../../redux/modals";
import { saveThreadToBackend } from "./api/InlineThreadCreate";
import {
  removeSavedInlineComment,
  updateInlineThreadIdInEntity,
} from "../PaperDraftInlineComment/util/PaperDraftInlineCommentUtil";
import DiscussionEntry from "../Threads/DiscussionEntry";
import PaperDraftUnduxStore, {
  revertBackToSavedState,
} from "../PaperDraft/undux/PaperDraftUnduxStore";
import { silentEmptyFnc } from "../../config/utils/nullchecks";
import { ID } from "../../config/types/root_types";

type Props = {
  auth: any /* redux */;
  showMessage: any /* redux */;
  setMessage: any /* redux function to set a message */;
  openRecaptchaPrompt: any /* redux function to open recaptcha */;
  shouldShowContextTitle?: boolean;
  unduxInlineComment: InlineComment;
};

function InlineCommentThreadCard({
  auth,
  showMessage,
  setMessage,
  openRecaptchaPrompt: _openRecaptchaPrompt,
  shouldShowContextTitle = true,
  unduxInlineComment,
  unduxInlineComment: {
    blockKey,
    commentThreadID,
    entityKey,
    highlightedText: unduxHighlightedText,
  },
}: Props): ReactElement<"div"> {
  const doesCommentIdExist = commentThreadID !== null;
  const inlineCommentStore = InlineCommentUnduxStore.useStore();
  const paperDraftStore = PaperDraftUnduxStore.useStore();
  const paperID = inlineCommentStore.get("paperID");

  const [isThreadReadOnly, setIsThreadReadOnly] =
    useState<boolean>(doesCommentIdExist);
  const [fetchedThreadData, setFecthedThreadData] = useState<any>({
    created_by: { author_profile: {} },
  });
  const [isReadyForFetch, setIsReadyForFetch] = useState<boolean>(true);
  const [isCommentDataFetched, setIsCommentDataFetched] =
    useState<boolean>(false);
  const router = useRouter();
  const fetchedCommentData = fetchedThreadData.comments || [];

  useEffect((): void => {
    setIsThreadReadOnly(doesCommentIdExist);
  }, [commentThreadID]);

  useEffect((): void => {
    if (
      !isCommentDataFetched &&
      doesCommentIdExist &&
      isReadyForFetch &&
      paperID !== null
    ) {
      setIsReadyForFetch(false);
      inlineThreadFetchTarget({
        paperId: paperID,
        targetId: commentThreadID,
        onSuccess: (result: any): void => {
          setFecthedThreadData(result);
          setIsCommentDataFetched(true);
          setIsReadyForFetch(true);
          setIsThreadReadOnly(true);
        },
        onError: (_): void => {
          setIsCommentDataFetched(false);
        },
      });
    }
  }, [commentThreadID, fetchedThreadData, isCommentDataFetched, paperID]);

  const onSubmitThread = (text: String, plainText: String): void => {
    showMessage({ load: true, show: true });
    let { paperId } = router.query;
    saveThreadToBackend({
      auth,
      onSuccess: ({ threadID }: { threadID: ID }): void => {
        const updatedInlineComment = {
          ...unduxInlineComment,
          commentThreadID: threadID,
        };
        updateInlineThreadIdInEntity({
          entityKey,
          paperDraftStore,
          commentThreadID: threadID,
        });
        inlineCommentStore.set("displayableInlineComments")([
          updatedInlineComment,
        ]);
      },
      params: {
        text: text,
        paper: paperId,
        plain_text: plainText,
        source: INLINE_COMMENT_DISCUSSION_URI_SOUCE,
        entity_key: entityKey,
        block_key: blockKey,
        context_title: unduxHighlightedText,
      },
      setMessage,
      showMessage,
    });
  };

  const animateAndScrollToTarget = getScrollToTargetElFnc({
    onSuccess: silentEmptyFnc,
    targetElement: getTargetInlineDraftEntityEl({
      commentThreadID,
      entityKey,
    }),
  });

  const onRemoveSuccess = ({
    commentID: _commentID,
    paperID: _paperID,
    replyID: _replyID,
    threadID,
  }: {
    commentID: ID;
    paperID: ID;
    replyID: ID;
    threadID: ID;
  }) => {
    if (
      /* currently, only threads are highlighted as context title */
      threadID != null
    ) {
      /* removes entity given entity-selection & silently saves the paper in the background */
      removeSavedInlineComment({ commentThreadID: threadID, paperDraftStore });
    }
  };

  return (
    <div
      className={css([styles.inlineCommentThreadCard])}
      onClick={animateAndScrollToTarget}
      role="none"
    >
      <ColumnContainer overrideStyles={styles.container}>
        <ReactPlaceholder
          ready={
            doesCommentIdExist ? isCommentDataFetched && isReadyForFetch : true
          }
          showLoadingAnimation
          type={"media"}
          rows={3}
        >
          {isThreadReadOnly ? (
            <DiscussionEntry
              data={fetchedThreadData}
              discussionCount={fetchedCommentData.length}
              hoverEvents
              mediaOnly
              noVoteLine
              onRemoveSuccess={onRemoveSuccess}
              shouldShowContextTitle={shouldShowContextTitle}
            />
          ) : (
            <div>
              <DiscussionPostMetadata
                authorProfile={auth.user.author_profile} // @ts-ignore
                data={{
                  created_by: auth.user,
                }}
                noTimeStamp
                smaller
                username={
                  auth?.user?.author_profile.first_name +
                  " " +
                  auth?.user?.author_profile.last_name
                }
              />
              <div className={css(styles.threadComposerContainer)}>
                <InlineCommentComposer
                  isReadOnly={false}
                  onCancel={(): void => {
                    cleanupStoreAndCloseDisplay({ inlineCommentStore });
                    revertBackToSavedState({ paperDraftStore });
                  }}
                  onSubmit={onSubmitThread}
                  textData={fetchedCommentData ? fetchedCommentData.text : null}
                />
              </div>
            </div>
          )}
        </ReactPlaceholder>
      </ColumnContainer>
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    borderLeft: `3px solid ${colors.NEW_BLUE()}`,
    width: "100%",
    padding: "20px 15px",
    minHeight: 100,
    "@media only screen and (max-width: 1024px)": {
      marginTop: 0,
    },
  },
  cursurPointer: {
    cursor: "pointer",
  },
  inlineCommentThreadCard: {
    cursor: "pointer",
    overflow: "auto",
  },
  responseSectionWarp: {},
  threadComposerContainer: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingTop: 4,
  },
  threadResponseComposerContainer: {},
  textWrap: {
    margin: "4px 0 8px",
    borderRadius: 8,
  },
  left: {
    alignItems: "center",
    width: 48,
    display: "table-cell",
    height: "100%",
    verticalAlign: "top",
    "@media only screen and (max-width: 415px)": {
      width: 35,
    },
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: "100%",
  },
  voteContainer: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  voteWidget: {
    margin: 0,
    "@media only screen and (max-width: 415px)": {
      width: 35,
    },
  },
});

const mapStateToProps = ({ auth }: any) => ({
  auth,
});

const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
  openRecaptchaPrompt: ModalActions.openRecaptchaPrompt,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InlineCommentThreadCard);
