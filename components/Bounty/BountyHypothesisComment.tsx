import { css, StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";
import { useState } from "react";
import { useRouter } from "next/router";
import { breakpoints } from "~/config/themes/screen";
import BaseModal from "../Modals/BaseModal";
import TextEditor from "../TextEditor";
import { POST_TYPES } from "../TextEditor/config/postTypes";
import api from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { sendAmpEvent } from "~/config/fetch";
import { connect } from "react-redux";
import { ModalActions } from "~/redux/modals";
import { MessageActions } from "~/redux/message";
import Button from "../Form/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ALink from "../ALink";

type Params = {
  postId: number;
  unifiedDocumentId: number;
  auth: any;
  postSlug: string;
  postName: string;
  setMessage: (message) => void;
  showMessage: ({ show, error }) => void;
  openRecaptchaPrompt: (boolean) => void;
};

const BountyHypothesisComment = ({
  postId,
  postSlug,
  postName,
  unifiedDocumentId,
  openRecaptchaPrompt,
  setMessage,
  showMessage,
  auth,
}: Params) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [commentAddSuccess, setCommentAddSuccess] = useState(false);
  const router = useRouter();

  const hypothesisLink =
    process.env.REACT_APP_ENV === "production"
      ? `https://www.researchhub.com/hypothesis/${router.query.documentId}/${router.query.title}`
      : process.env.REACT_APP_ENV === "staging"
      ? `https://staging-web.researchhub.com/hypothesis/${router.query.documentId}/${router.query.title}`
      : `http://localhost:3000/hypothesis/${router.query.documentId}/${router.query.title}`;

  const saveComment = async ({ content, plainText, discussionType }) => {
    setIsFetching(true);

    const documentId = postId;
    const param = {
      text: content,
      post: documentId,
      plain_text: plainText,
    };

    param["discussion_post_type"] = POST_TYPES.DISCUSSION;
    const config = api.POST_CONFIG(param);
    showMessage({ show: true, error: false, load: true });

    return fetch(
      api.DISCUSSION({
        documentId,
        documentType: discussionType.toLocaleLowerCase(),
        twitter: null,
      }),
      config
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((resp) => {
        setIsFetching(false);
        showMessage({ show: false, error: false });
        setMessage("");
        showMessage({ show: true, error: false });
        setCommentAddSuccess(true);

        // amp events
        const payload = {
          event_type: "create_thread",
          time: +new Date(),
          user_id: auth.user ? auth.user.id && auth.user.id : null,
          insert_id: `thread_${resp.id}`,
          event_properties: {
            interaction: "Post Thread",
            paper: documentId,
            is_removed: resp.is_removed,
          },
        };

        sendAmpEvent(payload);
      })
      .catch((err) => {
        setIsFetching(false);
        if (err?.response?.status === 429) {
          showMessage({ show: false, error: false });
          return openRecaptchaPrompt(true);
        }
        setMessage("Something went wrong");
        showMessage({ show: true, error: true });
      });
  };

  return (
    <>
      <BaseModal
        isOpen={modalOpen}
        closeModal={() => {
          setModalOpen(false);
        }}
        title={
          commentAddSuccess ? "Bounty Reply Success!" : "Answer the Bounty"
        }
      >
        <div className={css(styles.editor)}>
          {commentAddSuccess ? (
            <div className={css(styles.successScreen)}>
              <div style={{ marginBottom: 16 }}>
                You've successfully replied to the bounty.
              </div>
              <Button
                isLink={{ href: `/post/${postId}/${postSlug}` }}
                label={"View your Comment"}
                customButtonStyle={[styles.viewCommentButton]}
              />
            </div>
          ) : (
            <>
              <div className={css(styles.subtext)}>
                Your Meta-Study was created in response to the bounty:{" "}
                <ALink
                  theme={"solidPrimary"}
                  href={`/post/${postId}/${postSlug}`}
                >
                  {postName}
                </ALink>
                <br />
                <br />
                Post a comment and link your Meta-Study to that bounty below!
              </div>
              <TextEditor
                canEdit
                commentEditor
                commentEditorStyles={styles.commentEditorStyles}
                placeholder={
                  "Post the link to your Meta-Study to answer the bounty."
                }
                initialValue={{
                  ops: [
                    {
                      insert: hypothesisLink,
                      attributes: {
                        link: hypothesisLink,
                      },
                    },
                    {
                      insert: "\n",
                    },
                  ],
                }}
                // focusEditor={focus}
                // initialValue={discussion.question}
                // onCancel={cancel}
                // showBountyBtn={showBountyBtn}
                onSubmit={saveComment}
                // readOnly={false}
                // loading={submitInProgress}
                // uid={textEditorKey}
                // isTopLevelComment={true}
                // documentType={documentType}
              ></TextEditor>
            </>
          )}
        </div>
      </BaseModal>
      <div className={css(styles.bountyAlert)}>
        <div className={css(styles.wrapper)}>
          <FontAwesomeIcon
            icon={["far", "file-lines"]}
            style={{ fontSize: 20, marginRight: 16 }}
          />
          Answer the Bounty by posting your Meta-Study as a comment.
        </div>
        <div className={css(styles.actions)}>
          <div
            className={css(styles.action)}
            onClick={() => {
              setModalOpen(!modalOpen);
            }}
          >
            Answer the Bounty
          </div>
        </div>
      </div>
    </>
  );
};

const styles = StyleSheet.create({
  actions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 16,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      marginTop: 15,
    },
  },
  avatars: {
    display: "flex",
    marginRight: 20,
  },
  facePileOverride: {
    flexWrap: "unset",
  },
  action: {
    background: colors.NEW_BLUE(),
    cursor: "pointer",
    borderRadius: "4px",
    padding: "0 25px",
    color: "white",
    display: "flex",
    alignItems: "center",
    height: 40,
    border: `1px solid ${colors.NEW_BLUE()}`,
    whiteSpace: "nowrap",
    ":hover": {
      opacity: 0.8,
    },
  },
  contribute: {
    alignItems: "center",
    display: "flex",
    color: colors.NEW_BLUE(),
    border: `1px solid ${colors.NEW_BLUE()}`,
    fontWeight: 500,
    background: "unset",
    marginRight: 10,
    // paddingLeft: 0,
  },
  share: {
    color: colors.NEW_BLUE(),
    fontSize: 20,
    marginRight: 15,
    marginLeft: 15,
  },
  closeBounty: {
    background: "white",
    color: colors.NEW_BLUE(),
    border: `1px solid ${colors.NEW_BLUE()}`,
  },
  subtext: {
    color: colors.BLACK(0.6),
    marginBottom: 16,
  },
  bountyAlert: {
    userSelect: "none",
    background: "rgba(242, 251, 243, 0.3)",
    borderRadius: "4px",
    padding: "15px 25px",
    alignItems: "center",
    color: colors.MEDIUM_GREY2(),
    fontSize: 16,
    border: `1px solid ${colors.NEW_GREEN()}`,
    lineHeight: "22px",
    display: "flex",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      flexDirection: "column",
    },
  },
  wrapper: {
    display: "flex",
    marginRight: "auto",
    alignItems: "center",
  },
  strong: {
    fontWeight: 500,
    color: colors.BLACK(),
  },
  alertIcon: {},
  rscIcon: {
    verticalAlign: "text-top",
    marginLeft: 5,
  },
  divider: {
    marginLeft: 7,
    marginRight: 7,
  },
  popover: {
    background: "#fff",
    padding: 16,
    borderRadius: 4,
    marginTop: 8,
    boxShadow: "0 5px 10px 0 #ddd",
  },
  groupLanguage: {
    // color: colors.NEW_BLUE(),
    // color: colors.BLACK(),
    fontWeight: 500,
    textDecoration: "underline",
    cursor: "pointer",
  },
  expireTime: {},
  submitText: {},
  commentEditorStyles: {
    "@media only screen and (min-width: 767px)": {
      minWidth: 600,
    },
  },
  successScreen: {
    textAlign: "center",
    "@media only screen and (min-width: 767px)": {
      minWidth: 600,
    },
  },
  editor: {
    marginTop: 24,
    maxHeight: "80vh",
    overflow: "auto",
  },
  viewCommentButton: {
    width: "fit-content",
    padding: "0px 16px",
    margin: "0 auto",
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {
  openRecaptchaPrompt: ModalActions.openRecaptchaPrompt,
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BountyHypothesisComment);
