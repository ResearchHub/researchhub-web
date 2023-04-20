import { useQuill } from "./hooks/useQuill";
import CommentEditorToolbar from "./CommentEditorToolbar";
import { css, StyleSheet } from "aphrodite";
import { useEffect, useRef, useState } from "react";
import Button from "../Form/Button";
import CreateBountyBtn from "../Bounty/CreateBountyBtn";
import {
  QuillFormats,
  buildQuillModules,
  insertReviewCategory,
  focusEditor,
  forceShowPlaceholder,
  hasQuillContent,
} from "./lib/quill";
import { AuthorProfile, ID, parseUser } from "~/config/types/root_types";
import CommentAvatars from "./CommentAvatars";
import CommentTypeSelector from "./CommentTypeSelector";
import { COMMENT_TYPES } from "./lib/types";
import useQuillContent from "./hooks/useQuillContent";
import colors from "./lib/colors";
import { commentTypes } from "./lib/options";
import { useEffectHandleClick } from "~/config/utils/clickEvent";
import { MessageActions } from "~/redux/message";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
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
import api from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

const { setMessage, showMessage } = MessageActions;

type CommentEditorArgs = {
  editorId: string;
  commentId?: ID;
  placeholder?: string;
  handleSubmit: Function;
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
  placeholder = "Add a comment or start a bounty",
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

  const getFileUrl = ({ fileString, type }) => {
    const payload = {
      content_type: type.split("/")[1],
      content: fileString,
    };
    return fetch(api.SAVE_IMAGE, api.POST_CONFIG(payload))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        return res;
      });
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const imageHandler = (obj) => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async function () {
      // showLoader(true);
      const file = input.files[0];
      const fileString = await toBase64(file);
      const type = file.type;
      const fileUrl = await getFileUrl({ fileString, type });
      if (quill) {
        const range = quill.getSelection();

        // this part the image is inserted
        // by 'image' option below, you just have to put src(link) of img here.
        quill.insertEmbed(range.index, "image", fileUrl);
      }
      // showLoader(false);
    };
  };

  const { quill, quillRef, isReady } = useQuill({
    modules: buildQuillModules({
      editorId,
      handleSubmit: () => handleSubmit({ content: _content }),
    }),
    formats: QuillFormats,
    placeholder,
  });
  const { content: _content, dangerouslySetContent } = useQuillContent({
    quill,
    content,
    notifyOnContentChangeRate: 300, // ms
  });

  useEffect(() => {
    if (quill) {
      // Add custom handler for Image Upload
      quill.getModule("toolbar").addHandler("image", imageHandler);
    }
  }, [quill]);

  useEffectForCommentTypeChange({
    quill,
    quillRef,
    isReady,
    commentType: _commentType,
  });

  if (previewModeAsDefault) {
    useEffectHandleClick({
      el: editorRef.current,
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

      await handleSubmit({
        content: _content,
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
console.log('_content', _content)
  const isLoggedIn = auth.authChecked && auth.isLoggedIn;
  return (
    <div
      ref={editorRef}
      className={`${css(
        styles.commentEditor,
        editorStyleOverride
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
        {author && (
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
            disabled={isSubmitting || isEmpty}
          />
        </div>
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
              // @ts-ignore
              <CreateBountyBtn
                onBountyAdd={(bounty) => {
                  setInterimBounty(bounty);
                }}
                withPreview={true}
              />
            )}
          </>
        )}
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
    alignItems: "center",
    display: "flex",
    cursor: "pointer",
    columnGap: "10px",
    background: colors.bounty.background,
    padding: "6px 12px",
    borderRadius: "4px",
    fontSize: 14,
    lineHeight: "10px",
    color: colors.bounty.text,
    fontWeight: 500,
  },
});

export default CommentEditor;
