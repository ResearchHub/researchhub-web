/* - calvinhlee: this file utilizes functionalities that are legacy, I'm suppressing some warnings in this file */
import { connect } from "react-redux";
import { useRouter } from "next/router";

// Components
import { InlineComment } from "../PaperDraftInlineComment/undux/InlineCommentUnduxStore";
import { StyleSheet, css } from "aphrodite";
import colors from "../../config/themes/colors";
import ColumnContainer from "../Paper/SideColumn/ColumnContainer";
import DiscussionPostMetadata from "../DiscussionPostMetadata.js";
import InlineCommentComposer from "./InlineCommentComposer";
import React, { ReactElement, useState } from "react";
import { MessageActions } from "../../redux/message";
import { ModalActions } from "../../redux/modals";
// Redux: TODO: calvinhlee Auth shouldn't really be dependent on the redux. Need to revist and remove.
import { emptyFunction } from "../PaperDraft/util/PaperDraftUtils";
import { saveCommentToBackend } from "./api/InlineCommentCreateAPI";

type Props = {
  auth: any /* redux */;
  inlineComment: InlineComment;
  showMessage: any /* redux */;
  setMessage: any /* redux function to set a message */;
  openRecaptchaPrompt: any /* redux function to open recaptcha */;
};

function InlineCommentThreadCard({
  auth,
  showMessage,
  setMessage,
  openRecaptchaPrompt,
}: Props): ReactElement<"div"> {
  const [isCommentReadOnly, setIsCommentReadOnly] = useState<boolean>(false);
  const router = useRouter();
  const onSubmitComment = (text: String, plainText: String): void => {
    showMessage({ load: true, show: true });
    let { paperId } = router.query;
    saveCommentToBackend({
      auth,
      onSuccess: () => setIsCommentReadOnly(true),
      openRecaptchaPrompt,
      params: {
        text: text,
        paper: paperId,
        plain_text: plainText,
        source: "inline_paper_body",
        entity_key: "",
        block_key: "",
      },
      setMessage,
      showMessage,
    });
  };

  return (
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
          onCancel={
            emptyFunction /* close the comment editor and bring back the side menu */
          }
          onChange={emptyFunction}
          onSubmit={onSubmitComment}
        />
      </div>
    </ColumnContainer>
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
