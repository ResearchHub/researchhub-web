import { useQuill } from "./hooks/useQuill";
import CommentEditorToolbar from "./CommentEditorToolbar";
import { css, StyleSheet } from "aphrodite";
import { useEffect, useRef, useState } from "react";
import Button from "../Form/Button";
import CreateBountyBtn from "../Bounty/CreateBountyBtn";
import {
  insertReviewCategory,
  focusEditor,
  forceShowPlaceholder,
  hasQuillContent,
  filterOps,
} from "./lib/quill";
import { AuthorProfile, ID, parseUser } from "~/config/types/root_types";
import CommentAvatars from "./CommentAvatars";
import CommentTypeSelector from "./CommentTypeSelector";
import { COMMENT_TYPES, PositionAnchor } from "./lib/types";
import useQuillContent from "./hooks/useQuillContent";
import colors from "./lib/colors";
import { commentTypes } from "./lib/options";
import { useEffectHandleClick } from "~/config/utils/clickEvent";
import { MessageActions } from "~/redux/message";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faTimes,
  faPlus,
} from "@fortawesome/pro-light-svg-icons";
import IconButton from "../Icons/IconButton";
import CommentReviewCategorySelector from "./CommentReviewCategorySelector";
import useEffectForCommentTypeChange from "./hooks/useEffectForCommentTypeChange";
import config from "./lib/config";
import { ClipLoader } from "react-spinners";
import { RootState } from "~/redux";
import { isEmpty as isInputEmpty } from "~/config/utils/nullchecks";
import ResearchCoinIcon from "../Icons/ResearchCoinIcon";
import Bounty from "~/config/types/bounty";
import { ModalActions } from "~/redux/modals";
import globalColors from "~/config/themes/colors";
import CommentEditorPlaceholder from "./CommentEditorPlaceholder";
import { breakpoints } from "~/config/themes/screen";

const { setMessage, showMessage } = MessageActions;

type CommentEditorArgs = {
  editorId: string;
  handleSubmit: Function;
  commentId?: ID;
  placeholder?: string;
  content?: object;
  allowBounty?: boolean;
  commentType?: COMMENT_TYPES;
  author?: AuthorProfile | null;
  previewModeAsDefault?: boolean;
  allowCommentTypeSelection?: boolean;
  handleClose?: Function;
  focusOnMount?: boolean;
  editorStyleOverride?: any;
};

const CommentEditor = ({
  editorId,
  commentId,
  placeholder = "Add a comment about this paper...",
  handleSubmit,
  content = {},
  allowBounty = false,
  commentType,
  author,
  previewModeAsDefault = false,
  allowCommentTypeSelection = false,
  focusOnMount = false,
  handleClose,
  editorStyleOverride,
}: CommentEditorArgs) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const editorRef = useRef<any>(null);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const [isPreviewMode, setIsPreviewMode] =
    useState<boolean>(previewModeAsDefault);
  const isPreviewModeRef = useRef(previewModeAsDefault);
  const dispatch = useDispatch();
  const [interimBounty, setInterimBounty] = useState<Bounty | null>(null);
  const currentUser = useSelector((state: RootState) =>
    isInputEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );
  const auth = useSelector((state: RootState) => state.auth);
  const [_commentType, _setCommentType] = useState<COMMENT_TYPES>(
    commentType || commentTypes.find((t) => t.isDefault)!.value
  );

  const { quill, quillRef, isReady } = useQuill({
    options: {
      placeholder,
    },
    editorId,
  });
  const {
    content: _content,
    dangerouslySetContent,
  }: { content: any; dangerouslySetContent: Function } = useQuillContent({
    quill,
    content,
    notifyOnContentChangeRate: 300, // ms
  });

  useEffectForCommentTypeChange({
    quill,
    quillRef,
    isReady,
    commentType: _commentType,
  });

  if (previewModeAsDefault) {
    useEffectHandleClick({
      ref: editorRef,
      onInsideClick: () => {
        setIsPreviewMode(false);
        isPreviewModeRef.current = false;
        quill && !quill.hasFocus() && quill.focus();
      },
    });
  }

  useEffect(() => {
    if (isReady) {
      const _isEmpty = !hasQuillContent({ quill });
      setIsEmpty(_isEmpty);
      if (_isEmpty) {
        forceShowPlaceholder({
          quillRef,
          placeholderText: placeholder,
        });
      }
    }
  }, [_content, isReady]);

  useEffect(() => {
    if (isReady && focusOnMount) {
      focusEditor({ quill });
    }
  }, [isReady]);

  useEffect(() => {
    // Remove module event listeners when editor is unmounted
    return () => {
      const mentionsModule = quill?.getModule("mentions");
      if (mentionsModule) {
        mentionsModule.destroy();
      }
    };
  }, []);

  const _handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (quill!.getLength() <= config.comment.minLength) {
        dispatch(
          setMessage(
            `Comment must be greater than ${config.comment.minLength} characters long.`
          )
        );
        // @ts-ignore
        dispatch(showMessage({ show: true, error: true }));
        return false;
      }

      const mentions = filterOps({
        quillOps: _content.ops,
        opName: "user",
      }).map((op: any) => op.insert.user.userId);

      await handleSubmit({
        content: _content,
        mentions,
        ...(commentId && { id: commentId }),
        ...(!commentId && { commentType: _commentType }),
        ...(interimBounty && { bountyAmount: interimBounty.amount }),
      });

      dangerouslySetContent({});
      _setCommentType(commentTypes.find((t) => t.isDefault)!.value);
      setInterimBounty(null);
      if (previewModeAsDefault) {
        setIsPreviewMode(true);
        isPreviewModeRef.current = true;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoggedIn = auth.authChecked && auth.isLoggedIn;
  return (
    <div>
      <div className={css(isReady && styles.hidden)}>
        <CommentEditorPlaceholder />
      </div>
      <div
        ref={editorRef}
        className={`${css(
          styles.commentEditor,
          editorStyleOverride,
          !isReady && styles.hidden
        )} CommentEditor`}
        onClick={() => {
          if (!isLoggedIn) {
            dispatch(
              ModalActions.openLoginModal(true, "Please Sign in to continue.")
            );
          }
        }}
      >
        <div>
          {handleClose && (
            <IconButton overrideStyle={styles.closeBtn} onClick={handleClose}>
              <FontAwesomeIcon icon={faTimes} />
            </IconButton>
          )}

          {allowBounty && (
            <>
              {interimBounty ? (
                <div
                  className={css(styles.bountyPreview)}
                  onClick={() => setInterimBounty(null)}
                >
                  <ResearchCoinIcon height={18} width={18} />
                  <span>{interimBounty.formattedAmount} RSC Bounty</span>
                  <FontAwesomeIcon
                    style={{ color: colors.gray }}
                    icon={faTimes}
                  />
                </div>
              ) : (
                <div className={css(styles.bountyBtnWrapper)}>
                  <CreateBountyBtn
                    onBountyAdd={(bounty) => {
                      setInterimBounty(bounty);
                    }}
                    withPreview={true}
                  >
                    <div>
                      <Button
                        fullWidth
                        size="small"
                        customButtonStyle={styles.addBountyBtn}
                      >
                        <FontAwesomeIcon
                          icon={faPlus}
                          style={{ marginRight: 4 }}
                        />
                        Add Bounty
                      </Button>
                    </div>
                  </CreateBountyBtn>
                  <div className={css(styles.bountyInfo)}>
                    <FontAwesomeIcon
                      className={css(styles.bountyInfoIcon)}
                      icon={faExclamationCircle}
                    />
                    <span className={css(styles.largeBountyText)}>
                      Offer award amount in ResearchCoin
                    </span>
                    <span className={css(styles.smallBountyText)}>
                      Offer ResearchCoin
                    </span>
                  </div>
                </div>
              )}
            </>
          )}

          {author && !allowBounty && (
            <div
              className={css(styles.authorRow, isPreviewMode && styles.hidden)}
            >
              <div className={css(styles.nameRow)}>
                {currentUser && (
                  <CommentAvatars
                    size={25}
                    withTooltip={false}
                    people={[currentUser]}
                  />
                )}
                <div>
                  {author.firstName} {author.lastName}
                </div>
              </div>
              {allowCommentTypeSelection && (
                <span style={{ marginTop: -5 }}>
                  <CommentTypeSelector
                    handleSelect={_setCommentType}
                    selectedType={_commentType}
                  />
                </span>
              )}
            </div>
          )}
          <div className={css(styles.editor)}>
            <div ref={quillRef} />
            {_commentType === COMMENT_TYPES.REVIEW && (
              <div className={css(styles.reviewCategoryContainer)}>
                <CommentReviewCategorySelector
                  handleSelect={(category) => {
                    insertReviewCategory({ category, quill, quillRef });
                  }}
                />
              </div>
            )}
            <div
              className={css(
                styles.toolbarContainer,
                isPreviewMode && styles.hidden
              )}
            >
              <CommentEditorToolbar editorId={editorId} />
            </div>
          </div>
        </div>
        <div className={css(styles.actions)}>
          <div style={{ width: 70 }}>
            <Button
              fullWidth
              label={
                isSubmitting ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      minHeight: "28px",
                    }}
                  >
                    <ClipLoader
                      sizeUnit={"px"}
                      size={18}
                      color={"#fff"}
                      loading={true}
                    />
                  </div>
                ) : (
                  <>{`Post`}</>
                )
              }
              hideRipples={true}
              onClick={() => _handleSubmit()}
              disabled={
                isSubmitting || isEmpty || (allowBounty && !interimBounty)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  commentEditor: {
    display: "flex",
    padding: "15px",
    boxShadow: "0px 0px 15px rgba(36, 31, 58, 0.2)",
    backgroundColor: "white",
    borderRadius: 4,
    flex: "none",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row-reverse",
  },
  toolbarContainer: {
    position: "relative",
    borderBottom: `1px solid ${colors.border}`,
    marginBottom: 15,
  },
  editor: {},
  hidden: { display: "none" },
  authorRow: {
    display: "flex",
    alignItems: "center",
    columnGap: "7px",
    marginBottom: 10,
  },
  nameRow: {
    display: "flex",
    columnGap: "7px",
    fontSize: 15,
    alignItems: "center",
  },
  closeBtn: {
    position: "absolute",
    right: 15,
    top: 15,
    fontSize: 18,
  },
  reviewCategoryContainer: {
    marginTop: 15,
  },
  bountyPreview: {
    marginBottom: 15,
    alignItems: "center",
    display: "inline-flex",
    cursor: "pointer",
    columnGap: "10px",
    background: colors.bounty.background,
    padding: "12px 15px",
    borderRadius: "4px",
    fontSize: 14,
    lineHeight: "10px",
    color: colors.bounty.text,
    fontWeight: 500,
  },
  bountyBtnWrapper: {
    marginBottom: 15,
    background: colors.bounty.background,
    display: "inline-flex",
    alignItems: "center",
    columnGap: "10px",
    padding: "7px 20px 7px 7px",
    borderRadius: "4px",
  },
  bountyInfo: {
    fontSize: 14,
    color: globalColors.BLACK_TEXT(1.0),
  },
  bountyInfoIcon: {
    marginRight: 5,
    fontSize: 16,
  },
  addBountyBtn: {
    background: colors.bounty.contributeBtn,
    border: "none",
  },
  largeBountyText: {
    display: "inline-block",
    [`@media (max-width: ${breakpoints.xsmall.str})`]: {
      display: "none",
    },
  },
  smallBountyText: {
    display: "none",
    [`@media (max-width: ${breakpoints.xsmall.str})`]: {
      display: "inline-block",
    },
  },
});

export default CommentEditor;
