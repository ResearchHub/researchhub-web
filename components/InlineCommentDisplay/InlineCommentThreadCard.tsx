/* - calvinhlee: this file utilizes functionalities that are legacy, I'm suppressing some warnings in this file */
// @ts-ignore
import { connect } from "react-redux";
import { useRouter } from "next/router";
import ReactPlaceholder from "react-placeholder/lib";
// Config
import { inlineCommentFetchTarget } from "./api/InlineCommentFetch";
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
import React, {
  ReactElement,
  SyntheticEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { EditorState } from "draft-js";
import { INLINE_COMMENT_DISCUSSION_URI_SOUCE } from "./api/InlineCommentAPIConstants";
import { MessageActions } from "../../redux/message";
import { ModalActions } from "../../redux/modals";
import { saveCommentToBackend } from "./api/InlineCommentCreate";
import { updateInlineThreadIdInEntity } from "../PaperDraftInlineComment/util/PaperDraftInlineCommentUtil";
import InlineCommentContextTitle from "./InlineCommentContextTitle";
import PaperDraftUnduxStore from "../PaperDraft/undux/PaperDraftUnduxStore";
import CommentEntry from "../Threads/CommentEntry";

type Props = {
  auth: any /* redux */;
  showMessage: any /* redux */;
  setMessage: any /* redux function to set a message */;
  openRecaptchaPrompt: any /* redux function to open recaptcha */;
  unduxInlineComment: InlineComment;
};

function isElemntWithinViewPort(element: HTMLElement): boolean {
  var rect = element.getBoundingClientRect();
  const result =
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= document.documentElement.clientHeight;
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= document.documentElement.clientHeight
  );
}

function emptyFunction(): void {}

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

  const [isCommentReadOnly, setIsCommentReadOnly] = useState<boolean>(
    isCommentSaved
  );
  const [fetchedThreadData, setFecthedThreadData] = useState<any>({
    created_by: { author_profile: {} },
  });
  const [isThreadDataFetched, setIsThreadDataFetched] = useState<boolean>(
    false
  );
  const router = useRouter();

  useEffect((): void => {
    setIsCommentReadOnly(isCommentSaved);
  }, [commentThreadID]);

  useEffect((): void => {
    if (!isThreadDataFetched && isCommentSaved && paperID !== null) {
      inlineCommentFetchTarget({
        paperId: paperID,
        targetId: commentThreadID,
        onSuccess: (result: any): void => {
          setFecthedThreadData(result);
          setIsCommentReadOnly(true);
          setIsThreadDataFetched(true);
        },
        onError: (_): void => {
          setIsThreadDataFetched(true);
        },
      });
    }
  }, [commentThreadID, fetchedThreadData, paperID]);

  const onSubmitComment = (text: String, plainText: String): void => {
    showMessage({ load: true, show: true });
    let { paperId } = router.query;
    saveCommentToBackend({
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
        updateInlineThreadIdInEntity({
          entityKey,
          paperDraftStore,
          commentThreadID: threadID,
        });
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

  const animateAndScrollToTarget = (event: SyntheticEvent) => {
    event.stopPropagation();
    let entityEl = document.getElementById(`inline-comment-${commentThreadID}`);
    if (entityEl == null) {
      entityEl = document.getElementById(`inline-comment-${entityKey}`);
    }
    inlineCommentStore.set("animatedEntityKey")(entityKey);
    inlineCommentStore.set("animatedTextCommentID")(commentThreadID);
    if (entityEl != null && !isElemntWithinViewPort(entityEl)) {
      entityEl.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  };

  const commentEntries = fetchedThreadData.comments.map((comment) => {
    // let { data, hostname, path, discussionCount, paper } = props;
    const { id: commentID } = comment;
    <CommentEntry
      data={data}
      hostname={hostname}
      path={path}
      key={`inline-thread-card-comment-${commentID}`}
      comment={comment}
      paper={paper}
      // index={comment.id}
      mobileView={false}
      // discussionCount={discussionCount}
      setCount={emptyFunction}
    />;
  });
  const formattedHighlightTxt =
    unduxHighlightedText != null
      ? unduxHighlightedText
      : fetchedThreadData.context_title || "";

  return (
    <div
      className={css([
        styles.inlineCommentThreadCard,
        isActiveCommentCard ? styles.activeCard : null,
      ])}
      onClick={animateAndScrollToTarget}
      role="none"
    >
      <ColumnContainer overrideStyles={styles.container}>
        <ReactPlaceholder
          ready={isCommentSaved ? isThreadDataFetched : true}
          showLoadingAnimation
          type={"media"}
          rows={3}
        >
          <DiscussionPostMetadata
            authorProfile={
              isCommentSaved
                ? fetchedThreadData.created_by.author_profile
                : auth.user.author_profile
            } // @ts-ignore
            data={{
              created_by: isCommentSaved
                ? fetchedThreadData.created_by
                : auth.user,
            }}
            username={
              isCommentSaved
                ? fetchedThreadData.created_by.author_profile.first_name +
                  " " +
                  fetchedThreadData.created_by.author_profile.last_name
                : auth.user.author_profile.first_name +
                  " " +
                  auth.user.author_profile.last_name
            }
            noTimeStamp={true}
            smaller={true}
          />
          <div className={css(styles.textWrap)}>
            <InlineCommentContextTitle title={formattedHighlightTxt} />
          </div>
          <div className={css(styles.composerContainer)}>
            <InlineCommentComposer
              isReadOnly={isCommentReadOnly}
              onCancel={(): void =>
                cleanupStoreAndCloseDisplay({ inlineCommentStore })
              }
              onSubmit={onSubmitComment}
              textData={fetchedThreadData ? fetchedThreadData.text : null}
            />
          </div>
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
  inlineCommentThreadCard: { cursor: "pointer", marginLeft: 12 },
  activeCard: {
    animationDuration: ".5s",
    animationFillMode: "forwards",
    animationName: [activeCardBump],
  },
  composerContainer: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    marginBottom: 8,
    paddingTop: 4,
  },
  container: {
    marginTop: 20,
    width: 350,
    padding: "20px 15px",
    minHeight: 100,
    borderLeft: `3px solid ${colors.NEW_BLUE()}`,
  },
  cursurPointer: {
    cursor: "pointer",
  },
  textWrap: {
    margin: "4px 0 8px",
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
