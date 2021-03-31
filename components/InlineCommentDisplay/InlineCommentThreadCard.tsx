/* - calvinhlee: this file utilizes functionalities that are legacy, I'm suppressing some warnings in this file */
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { Helpers } from "@quantfive/js-web-config";

// Components
import { InlineComment } from "../PaperDraftInlineComment/undux/InlineCommentUnduxStore";
import { StyleSheet, css } from "aphrodite";
import colors from "../../config/themes/colors";
import ColumnContainer from "../Paper/SideColumn/ColumnContainer";
import DiscussionPostMetadata from "../DiscussionPostMetadata.js";
import InlineCommentComposer from "./InlineCommentComposer";
import React, { ReactElement } from "react";
import { MessageActions } from "../../redux/message";
import { ModalActions } from "../../redux/modals";
// Redux: TODO: calvinhlee Auth shouldn't really be dependent on the redux. Need to revist and remove.
import { emptyFunction } from "../PaperDraft/util/PaperDraftUtils";
import API from "../../config/api";
import { sendAmpEvent } from "~/config/fetch";

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
  const router = useRouter();

  /**
   * After submitting comments, handle all side effects
   */
  const submitComment = (text: String, plainText: String) => {
    showMessage({ load: true, show: true });
    let { paperId } = router.query;

    let params = {
      text: text,
      paper: paperId,
      plain_text: plainText,
      source: "inline_paper_body",
      entity_key: "",
      block_key: "",
    };

    saveCommentToBackend(params);
  };

  /**
   * Saves comments to the backend
   * @param { Object } params -- hash that contains text, paper (which is paper id), and plain_text as keys
   * @returns
   */
  const saveCommentToBackend = (params) => {
    return fetch(
      API.DISCUSSION({ paperId: params.paper, twitter: null }),
      API.POST_CONFIG(params)
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((resp) => {
        showMessage({ show: false });
        setMessage("Successfully Saved!");
        showMessage({ show: true });
        // amp events
        let payload = {
          event_type: "create_thread",
          time: +new Date(),
          user_id: auth.user ? auth.user.id && auth.user.id : null,
          insert_id: `thread_${resp.id}`,
          event_properties: {
            interaction: "Post Thread",
            paper: params.paper,
            is_removed: resp.is_removed,
          },
        };
        sendAmpEvent(payload);
      })
      .catch((err) => {
        if (err.response.status === 429) {
          showMessage({ show: false });
          return openRecaptchaPrompt(true);
        }
        showMessage({ show: false });
        setMessage("Something went wrong");
        showMessage({ show: true, error: true });
      });
  };

  return (
    <ColumnContainer overrideStyles={styles.container}>
      <DiscussionPostMetadata
        authorProfile={auth.user.author_profile} // @ts-ignore
        data={{ created_by: auth.user }}
        smaller={true}
      />
      <div className={css(styles.composerContainer)}>
        <InlineCommentComposer
          onCancel={
            emptyFunction /* close the comment editor and bring back the side menu */
          }
          onChange={emptyFunction}
          onSubmit={submitComment}
          value={""}
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
    padding: "20px 15px",
    borderLeft: `3px solid ${colors.NEW_BLUE()}`,
  },
  contentBody: {
    fontSize: 14,
    lineHeight: 2,
    maxHeight: 150,
    overflow: "hidden",
    position: "relative",
    width: "100%",
  },
  showMore: {
    overflow: "visible",
    maxHeight: "none",
  },
  blur: {
    background:
      "linear-gradient(180deg, rgba(250, 250, 250, 0) 0%, #FCFCFC 85%)",
    height: "100%",
    position: "absolute",
    zIndex: 3,
    top: 0,
    width: "100%",
  },
  buttonContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    position: "absolute",
    bottom: -10,
    right: 0,
    zIndex: 3,
  },
  button: {
    background: colors.BLUE(),
    color: "#FFF",
    padding: "0px 10px",
    fontSize: 12,
    cursor: "pointer",
    borderRadius: 3,
    ":hover": {
      background: colors.BLUE(),
    },
  },
  bottomRow: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    paddingTop: 10,
  },
  action: {
    color: colors.BLACK(0.6),
    cursor: "pointer",
    fontSize: 14,
    textDecoration: "underline",
    ":hover": {
      color: colors.BLUE(),
    },
  },
  left: {
    marginRight: 15,
  },
  existingCommentsContainer: {
    display: "flex",
    minHeight: 40,
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
