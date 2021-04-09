/* - calvinhlee: this file utilizes functionalities that are legacy, I'm suppressing some warnings in this file */
// @ts-ignore
import { connect } from "react-redux";
import { useRouter } from "next/router";
import ReactPlaceholder from "react-placeholder/lib";
// Config
import { inlineThreadFetchTarget } from "./api/InlineThreadFetch";
import InlineCommentUnduxStore, {
  cleanupStoreAndCloseDisplay,
  getSavedInlineCommentsGivenBlockKey,
  ID,
  InlineComment,
  updateInlineComment,
} from "../PaperDraftInlineComment/undux/InlineCommentUnduxStore";
// Components
import colors from "../../config/themes/colors";
import ColumnContainer from "../Paper/SideColumn/ColumnContainer";
import { css, StyleSheet } from "aphrodite";
import DiscussionPostMetadata from "../DiscussionPostMetadata.js";
import InlineCommentComposer from "./InlineCommentComposer";
import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { EditorState } from "draft-js";
import {
  getScrollToTargetElFnc,
  getTargetInlineDraftEntityEl,
} from "./util/InlineCommentThreadUtil";
import { INLINE_COMMENT_DISCUSSION_URI_SOUCE } from "./api/InlineCommentAPIConstants";
import { MessageActions } from "../../redux/message";
import { ModalActions } from "../../redux/modals";
import { saveThreadToBackend } from "./api/InlineThreadCreate";
import { updateInlineThreadIdInEntity } from "../PaperDraftInlineComment/util/PaperDraftInlineCommentUtil";
import DiscussionEntry from "../Threads/DiscussionEntry";
import InlineCommentContextTitle from "./InlineCommentContextTitle";
import PaperDraftUnduxStore from "../PaperDraft/undux/PaperDraftUnduxStore";

type Props = {
  auth: any /* redux */;
  showMessage: any /* redux */;
  setMessage: any /* redux function to set a message */;
  openRecaptchaPrompt: any /* redux function to open recaptcha */;
  unduxInlineComment: InlineComment;
};

function InlineCommentThreadCard({
  auth,
  showMessage,
  setMessage,
  openRecaptchaPrompt: _openRecaptchaPrompt,
  unduxInlineComment,
  unduxInlineComment: {
    blockKey,
    commentThreadID,
    entityKey,
    highlightedText: unduxHighlightedText,
  },
}: Props): ReactElement<"div"> {
  const isCommentSaved = commentThreadID !== null;
  const inlineCommentStore = InlineCommentUnduxStore.useStore();
  const paperDraftStore = PaperDraftUnduxStore.useStore();
  const paperID = inlineCommentStore.get("paperID");
  const animatedEntityKey = inlineCommentStore.get("animatedTextCommentID");
  const animatedTextCommentID = inlineCommentStore.get("animatedTextCommentID");
  const isActiveCommentCard = useMemo(
    (): boolean =>
      animatedTextCommentID === commentThreadID ||
      animatedEntityKey === entityKey,
    [animatedTextCommentID, commentThreadID, isCommentSaved]
  );

  const [isThreadReadOnly, setIsThreadReadOnly] = useState<boolean>(
    isCommentSaved
  );
  const [fetchedThreadData, setFecthedThreadData] = useState<any>({
    created_by: { author_profile: {} },
  });
  const [isCommentDataFetched, setIsCommentDataFetched] = useState<boolean>(
    false
  );
  const [revealReply, setRevealReply] = useState<boolean>(false);
  const [shouldRefetch, setShouldRefetch] = useState<boolean>(false);
  const router = useRouter();
  const fetchedCommentData = fetchedThreadData.comments || [];

  useEffect((): void => {
    setIsThreadReadOnly(isCommentSaved);
  }, [commentThreadID]);

  useEffect((): void => {
    if (
      shouldRefetch ||
      (!isCommentDataFetched && isCommentSaved && paperID !== null)
    ) {
      inlineThreadFetchTarget({
        paperId: paperID,
        targetId: commentThreadID,
        onSuccess: (result: any): void => {
          setFecthedThreadData(result);
          setIsCommentDataFetched(true);
          setIsThreadReadOnly(true);
          setShouldRefetch(false);
        },
        onError: (_): void => {
          setIsCommentDataFetched(true);
        },
      });
    }
  }, [commentThreadID, fetchedThreadData, paperID, shouldRefetch]);

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
        updateInlineComment({
          store: inlineCommentStore,
          updatedInlineComment,
        });
        /* this will also trigger paper to save in the background */
        updateInlineThreadIdInEntity({
          entityKey,
          paperDraftStore,
          commentThreadID: threadID,
        });
        inlineCommentStore.set("animatedTextCommentID")(threadID);
        inlineCommentStore.set("displayableInlineComments")(
          getSavedInlineCommentsGivenBlockKey({
            blockKey,
            editorState:
              paperDraftStore.get("editorState") || EditorState.createEmpty(),
          })
        );
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

  // const animateAndScrollToTarget = getScrollToTargetElFnc({
  //   onSuccess: (): void => {
  //     inlineCommentStore.set("animatedEntityKey")(entityKey);
  //     inlineCommentStore.set("animatedTextCommentID")(commentThreadID);
  //   },
  //   targetElement: getTargetInlineDraftEntityEl({
  //     commentThreadID,
  //     entityKey,
  //   }),
  // });

  const formattedHighlightTxt =
    unduxHighlightedText != null
      ? unduxHighlightedText
      : fetchedThreadData.context_title || "";

  return (
    <div
      className={css([
        styles.inlineCommentThreadCard,
        isActiveCommentCard ? styles.activeCard : styles.inactiveCard,
      ])}
      role="none"
    >
      <ColumnContainer overrideStyles={styles.container}>
        <ReactPlaceholder
          ready={isCommentSaved ? isCommentDataFetched : true}
          showLoadingAnimation
          type={"media"}
          rows={3}
        >
          {isThreadReadOnly ? (
            <DiscussionEntry
              data={
                isThreadReadOnly ? fetchedThreadData : { created_by: auth.user }
              }
              hoverEvents={true}
              noVoteLine={true}
              discussionCount={fetchedCommentData.length}
            />
          ) : (
            <div>
              <DiscussionPostMetadata
                authorProfile={auth.user.author_profile} // @ts-ignore
                data={{
                  created_by: auth.user,
                }}
                username={
                  auth.user.author_profile.first_name +
                  " " +
                  auth.user.author_profile.last_name
                }
                noTimeStamp={true}
                smaller={true}
              />
              {formattedHighlightTxt ? (
                <div className={css(styles.textWrap)}>
                  <InlineCommentContextTitle
                    commentThreadID={commentThreadID}
                    entityKey={entityKey}
                    onScrollSuccess={(): void => {
                      inlineCommentStore.set("animatedEntityKey")(entityKey);
                      inlineCommentStore.set("animatedTextCommentID")(
                        commentThreadID
                      );
                    }}
                    title={formattedHighlightTxt}
                  />
                </div>
              ) : null}
              <div className={css(styles.threadComposerContainer)}>
                <InlineCommentComposer
                  isReadOnly={false}
                  onCancel={() =>
                    cleanupStoreAndCloseDisplay({ inlineCommentStore })
                  }
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

const activeCardBump = {
  "0%": {
    transform: "translateX(0)",
  },
  "100%": {
    transform: "translateX(-12px)",
  },
};

const styles = StyleSheet.create({
  activeCard: {
    // animationDuration: ".5s",
    // animationFillMode: "forwards",
    // animationName: [activeCardBump],
  },
  inactiveCard: {
    display: "none",
  },
  container: {
    borderLeft: `3px solid ${colors.NEW_BLUE()}`,
    marginTop: 20,
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
  inlineCommentThreadCard: { cursor: "pointer" },
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
    backgroundColor: "#FFF",
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
