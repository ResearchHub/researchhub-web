/* - calvinhlee: this file utilizes functionalities that are legacy, I'm suppressing some warnings in this file */
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { inlineCommentFetchTarget } from "./api/InlineCommentFetch";
import InlineCommentUnduxStore, {
  ID,
  InlineComment,
  updateInlineComment,
} from "../PaperDraftInlineComment/undux/InlineCommentUnduxStore";
// Components
import { StyleSheet, css } from "aphrodite";
import colors from "../../config/themes/colors";
import ColumnContainer from "../Paper/SideColumn/ColumnContainer";
import DiscussionPostMetadata from "../DiscussionPostMetadata.js";
import InlineCommentComposer from "./InlineCommentComposer";
import React, {
  ReactElement,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import { MessageActions } from "../../redux/message";
import { ModalActions } from "../../redux/modals";
import { saveCommentToBackend } from "./api/InlineCommentCreate";
import { updateInlineThreadIdInEntity } from "../PaperDraftInlineComment/util/PaperDraftInlineCommentUtil";

type Props = {
  auth: any /* redux */;
  cleanupStoreAndCloseDisplay: () => void;
  showMessage: any /* redux */;
  setMessage: any /* redux function to set a message */;
  openRecaptchaPrompt: any /* redux function to open recaptcha */;
  unduxInlineComment: InlineComment;
};

function InlineCommentThreadCard({
  auth,
  cleanupStoreAndCloseDisplay,
  showMessage,
  setMessage,
  openRecaptchaPrompt,
  unduxInlineComment,
  unduxInlineComment: { commentThreadID },
}: Props): ReactElement<"div"> {
  // TODO: calvinhlee REFACTOR
  const inlineCommentStore = InlineCommentUnduxStore.useStore();
  const paperID = inlineCommentStore.get("paperID");
  const [isCommentReadOnly, setIsCommentReadOnly] = useState<boolean>(
    commentThreadID != null
  );
  const [fetchedCommentData, setFecthedCommentData] = useState<any>(null);
  const router = useRouter();
  const { entityKey, blockKey } = unduxInlineComment;

  useEffect((): void => {
    setIsCommentReadOnly(commentThreadID != null);
  }, [commentThreadID]);

  useEffect((): void => {
    if (
      fetchedCommentData == null &&
      commentThreadID != null &&
      paperID != null
    ) {
      console.warn("FETCHINGGGGG");
      inlineCommentFetchTarget({
        paperId: paperID,
        targetId: commentThreadID,
        onSuccess: (result: any): void => {
          setFecthedCommentData(result);
          setIsCommentReadOnly(true);
        },
      });
    }
  }, [commentThreadID, fetchedCommentData, paperID]);

  const onSubmitComment = (text: String, plainText: String): void => {
    /* this will trigger separate background action to save paper see PaperDraftSilentSave */
    showMessage({ load: true, show: true });
    let { paperId } = router.query;
    saveCommentToBackend({
      auth,
      onSuccess: ({ threadID }: { threadID: ID }): void => {
        /* TODO: calvinhlee REFACTOR below */
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
          inlineCommentStore,
          commentThreadID: threadID,
        });
        inlineCommentStore.set("displayableInlineComments")([
          updatedInlineComment,
        ]);
        inlineCommentStore.set("shouldSavePaper")(true);
      },
      openRecaptchaPrompt,
      params: {
        text: text,
        paper: paperId,
        plain_text: plainText,
        source: "inline_paper_body",
        entity_key: entityKey,
        block_key: blockKey,
      },
      setMessage,
      showMessage,
    });
  };

  const scrollWindowToHighlight = (event: SyntheticEvent) => {
    event.stopPropagation();
    if (isCommentReadOnly) {
      const { entityKey } = unduxInlineComment;
      const entityEl = document.getElementById(
        `inline-comment-${commentThreadID}`
      );
      if (entityEl != null) {
        entityEl.scrollIntoView({
          behavior: "auto",
          block: "center",
          inline: "center",
        });
      }
    }
  };
  console.warn("commentThreadID: ", commentThreadID);
  console.warn("fetchedCommentData: ", fetchedCommentData);
  return (
    <div
      className={css(isCommentReadOnly ? styles.cursurPointer : null)}
      onClick={scrollWindowToHighlight}
      role="none"
    >
      <ColumnContainer overrideStyles={styles.container}>
        <DiscussionPostMetadata
          authorProfile={auth.user.author_profile} // @ts-ignore
          data={{ created_by: auth.user }}
          username={
            auth.user.author_profile.first_name +
            " " +
            auth.user.author_profile.last_name
          }
          noTimeStamp={true}
          smaller={true}
        />
        <div className={css(styles.composerContainer)}>
          <InlineCommentComposer
            isReadOnly={isCommentReadOnly}
            onCancel={cleanupStoreAndCloseDisplay}
            onSubmit={onSubmitComment}
            passedValue={
              fetchedCommentData != null ? fetchedCommentData.plain_text : null
            }
          />
        </div>
      </ColumnContainer>
    </div>
  );
}

const styles = StyleSheet.create({
  title: {
    display: "flex",
    alignItems: "center",
    background: "#fff",
    boxSizing: "border-box",
    height: 40,
    fontWeight: 500,
    paddingLeft: 20,
    fontSize: 12,
    letterSpacing: 1.2,
    color: colors.BLACK(0.6),
    textTransform: "uppercase",
  },
  composerContainer: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingTop: 5,
  },
  container: {
    marginTop: 20,
    width: 350,
    padding: "20px 15px",
    borderLeft: `3px solid ${colors.NEW_BLUE()}`,
  },
  cursurPointer: {
    cursor: "pointer",
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
