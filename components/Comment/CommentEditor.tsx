import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import MarkdownPlugin from '@lexical/markdown';
// import { TablePlugin } from '@lexical/table';
// import { MentionsPlugin } from './plugins/MentionsPlugin';
import { ToolbarPlugin } from './plugins/ToolbarPlugin';
import { css, StyleSheet } from "aphrodite";
import { useEffect, useRef, useState } from "react";
import Button from "../Form/Button";
import CreateBountyBtn from "../Bounty/CreateBountyBtn";
import { AuthorProfile, ID, parseUser } from "~/config/types/root_types";
import CommentAvatars from "./CommentAvatars";
import CommentTypeSelector from "./CommentTypeSelector";
import { COMMENT_TYPES, CommentPrivacyFilter } from "./lib/types";
import { useEffectHandleClick } from "~/config/utils/clickEvent";
import { MessageActions } from "~/redux/message";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faTimes,
  faPlus,
  faHourglassHalf,
  faCheckCircle,
  faRotateExclamation,
  faAngleDown,
} from "@fortawesome/pro-solid-svg-icons";
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
import { breakpoints } from "~/config/themes/screen";
import CommentPrivacySelector from "./CommentPrivacySelector";
import GenericMenu, { MenuOption } from "../shared/GenericMenu";
import colors from './lib/colors';
import { commentTypes } from './lib/options';
import { ListNode, ListItemNode } from '@lexical/list';
import { LinkNode } from '@lexical/link';


const { setMessage, showMessage } = MessageActions;

type CommentEditorArgs = {
  editorId: string;
  handleSubmit: Function;
  handleCancel?: Function;
  commentId?: ID;
  placeholder?: string;
  content?: object;
  allowBounty?: boolean;
  commentType?: COMMENT_TYPES;
  author?: AuthorProfile | null;
  minimalMode?: boolean;
  allowCommentTypeSelection?: boolean;
  allowPrivacySelection?: boolean;
  defaultPrivacyFilter?: CommentPrivacyFilter;
  handleClose?: Function;
  focusOnMount?: boolean;
  editorStyleOverride?: any;
  onChange?: Function;
  displayCurrentUser?: boolean;
  showAuthorLine?: boolean;
};

const CommentEditor = ({
  editorId,
  commentId,
  placeholder,
  handleSubmit,
  handleCancel,
  content = {},
  allowBounty = false,
  commentType,
  author,
  minimalMode = false,
  allowCommentTypeSelection = false,
  allowPrivacySelection = false,
  defaultPrivacyFilter = "PUBLIC",
  focusOnMount = false,
  handleClose,
  editorStyleOverride,
  onChange,
  showAuthorLine = true,
  displayCurrentUser = true,
}: CommentEditorArgs) => {
  const [editor, setEditor] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const [isMinimalMode, setIsMinimalMode] = useState<boolean>(minimalMode);
  const isMinimalModeRef = useRef(minimalMode);
  const dispatch = useDispatch();
  const [interimBounty, setInterimBounty] = useState<Bounty | null>(null);
  const currentUser = useSelector((state: RootState) =>
    isInputEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );
  const [selectedPrivacyFilter, setSelectedPrivacyFilter] =
    useState<CommentPrivacyFilter>(defaultPrivacyFilter);
  const auth = useSelector((state: RootState) => state.auth);
  const [_commentType, _setCommentType] = useState<COMMENT_TYPES>(
    commentType || commentTypes.find((t) => t.isDefault)!.value
  );
  const [reviewStatus, setReviewStatus] = useState<string | null>(null);

  const reviewStatusOptions: MenuOption[] = [
    {
      value: "APPROVED",
      label: "Approve",
      html: (
        <div className={css(styles.menuOptionContent)}>
          <FontAwesomeIcon 
            icon={faCheckCircle} 
            className={css(styles.menuOptionIcon, styles.approveIcon)} 
          />
          <div>
            <strong>Approve</strong>
            <div className={css(styles.menuOptionDescription)}>
              Manuscript is approved for publication
            </div>
          </div>
        </div>
      ),
      icon: <FontAwesomeIcon 
        icon={faCheckCircle} 
        className={css(styles.triggerStatusIcon, styles.approveIcon)} 
      />,
    },
    {
      value: "CHANGES_REQUESTED",
      label: "Request changes",
      html: (
        <div className={css(styles.menuOptionContent)}>
          <FontAwesomeIcon 
            icon={faRotateExclamation} 
            className={css(styles.menuOptionIcon, styles.requestChangesIcon)} 
          />
          <div>
            <strong>Request changes</strong>
            <div className={css(styles.menuOptionDescription)}>
              Changes must be addressed and reviewed again before publication
            </div>
          </div>
        </div>
      ),
      icon: <FontAwesomeIcon 
        icon={faRotateExclamation} 
        className={css(styles.triggerStatusIcon, styles.requestChangesIcon)} 
      />,
    },
  ];

  const initialConfig = {
    namespace: editorId,
    theme: {
      paragraph: 'editor-paragraph',
      text: {
        bold: 'editor-text-bold',
        italic: 'editor-text-italic',
        underline: 'editor-text-underline',
      },
    },
    onError: (error: Error) => {
      console.error(error);
    },
    nodes: [
      ListNode,
      ListItemNode,
      LinkNode
    ],
  };

  // useEffectForCommentTypeChange({
  //   quill: editor,
  //   quillRef: editorRef,
  //   isReady: editor !== null,
  //   commentType: _commentType,
  //   editorId,
  // });

  // useEffectHandleClick({
  //   ref: editorRef,
  //   onInsideClick: handleEditorClick,
  //   onOutsideClick: () => {
  //     if (minimalMode) {
  //       setIsMinimalMode(true);
  //     }
  //   },
  // });

  // useEffect(() => {
  //   if (editor && focusOnMount) {
  //     editor.focus();
  //   }
  // }, [editor]);

  const _handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    setIsSubmitting(true);
    try {
      const editorState = editor.getEditorState();
      const jsonContent = editorState.toJSON();
      
      const content = convertLexicalToDesiredFormat(jsonContent);
      
      if (content.length <= config.comment.minLength) {
        dispatch(
          setMessage(
            `Comment must be greater than ${config.comment.minLength} characters long.`
          )
        );
        dispatch(showMessage({ show: true, error: true }));
        return false;
      }

      const mentions = extractMentionsFromLexical(jsonContent);

      await handleSubmit({
        content,
        privacy: selectedPrivacyFilter,
        mentions,
        ...(commentId && { id: commentId }),
        ...(!commentId && { commentType: _commentType }),
        ...(interimBounty && {
          bountyAmount: interimBounty.amount,
          bountyType: interimBounty.bountyType,
          targetHubs: interimBounty.targetHubs,
        }),
        ...(commentType === COMMENT_TYPES.PEER_REVIEW && { reviewStatus }),
      });

      // editor.update(() => {
      //   $getRoot().clear();
      // });
      
      setInterimBounty(null);
      if (minimalMode) {
        setIsMinimalMode(true);
        isMinimalModeRef.current = true;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // useEffect(() => {
  //   const _handleKeyDown = (event) => {
  //     if (!(editor && editor !== null)) return;
  //     if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
  //       event.preventDefault();
  //       event.stopPropagation();
  //       _handleSubmit(event);
  //     }
  //   };

  //   if (editorRef.current) {
  //     editorRef.current.addEventListener("keydown", _handleKeyDown);
  //   }

  //   return () => {
  //     if (editorRef.current) {
  //       editorRef.current.removeEventListener("keydown", _handleKeyDown);
  //     }
  //   };
  // }, [editor, editorRef]);

  const isLoggedIn = auth.authChecked && auth.isLoggedIn;
  return (
    <div>
      <div
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

          {allowBounty && (
            <>
              {interimBounty ? (
                <div
                  className={css(styles.bountyPreview)}
                  onClick={() => setInterimBounty(null)}
                >
                  <ResearchCoinIcon height={18} width={18} />
                  <span>{interimBounty.formattedAmount} RSC Grant</span>
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
                        Add Grant
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
                      <sup style={{ fontSize: 9 }}>TM</sup>
                    </span>
                    <span className={css(styles.smallBountyText)}>
                      Offer ResearchCoin
                    </span>
                  </div>
                </div>
              )}
            </>
          )}

          <div className={css(styles.mainActionsWrapper)}>
            {displayCurrentUser && author && showAuthorLine && (
              <div
                className={css(
                  styles.authorRow,
                  isMinimalMode && styles.hidden
                )}
              >
                <div className={css(styles.nameRow)}>
                  {currentUser && (
                    <CommentAvatars
                      size={25}
                      withTooltip={false}
                      people={[currentUser]}
                      wrapperStyle={styles.avatarsWrapper}
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
            {allowPrivacySelection && (
              <div className={css(styles.privacySelectorWrapper)}>
                <CommentPrivacySelector
                  onSelect={setSelectedPrivacyFilter}
                  selected={selectedPrivacyFilter}
                />
              </div>
            )}
          </div>

          <LexicalComposer initialConfig={initialConfig}>
            <div className={css(styles.editorContainer)}>
              <ToolbarPlugin />
              <RichTextPlugin
                contentEditable={<ContentEditable className={css(styles.contentEditable)} />}
                placeholder={
                  <div className={css(styles.placeholder)}>
                    {placeholder || "Add a comment about this paper..."}
                  </div>
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
              <HistoryPlugin />
              <AutoFocusPlugin />
              <ListPlugin />
              <LinkPlugin />
            </div>
          </LexicalComposer>
        </div>
        {!isMinimalMode && (
          <div className={css(styles.actions)}>
            {commentType === COMMENT_TYPES.PEER_REVIEW ? (
              <div className={css(styles.reviewActions)}>
                <GenericMenu
                  id="review-status-menu"
                  options={reviewStatusOptions}
                  onSelect={(option) => setReviewStatus(option.value)}
                  selected={reviewStatus}
                  menuStyleOverride={styles.menuStyleOverride}
                >
                  <button className={css(styles.versionTrigger)}>
                    {!reviewStatus ? (
                      <>
                        Select status
                        <FontAwesomeIcon 
                          icon={faAngleDown} 
                          className={css(styles.dropdownIcon)}
                        />
                      </>
                    ) : (
                      <>
                        {reviewStatusOptions.find(option => option.value === reviewStatus)?.icon}
                        {reviewStatusOptions.find(option => option.value === reviewStatus)?.label}
                        <FontAwesomeIcon 
                          icon={faAngleDown}
                          className={css(styles.dropdownIcon)} 
                        />
                      </>
                    )}
                  </button>
                </GenericMenu>
                <div className={css(styles.postButtonWrapper)}>
                  <Button
                    fullWidth
                    size="small"
                    label={isSubmitting ? (
                      <div className={css(styles.loadingWrapper)}>
                        <ClipLoader sizeUnit={"px"} size={18} color={"#fff"} loading={true} />
                      </div>
                    ) : "Post"}
                    hideRipples={true}
                    onClick={(event) => _handleSubmit(event)}
                    disabled={isSubmitting || isEmpty || !reviewStatus}
                  />
                </div>
              </div>
            ) : (
              <div className={css(styles.postButtonWrapper)}>
                <Button
                  fullWidth
                  size="small"
                  label={isSubmitting ? (
                    <div className={css(styles.loadingWrapper)}>
                      <ClipLoader sizeUnit={"px"} size={18} color={"#fff"} loading={true} />
                    </div>
                  ) : "Post"}
                  hideRipples={true}
                  onClick={(event) => _handleSubmit(event)}
                  disabled={isSubmitting || isEmpty}
                />
              </div>
            )}
            {handleCancel && (
              <div style={{ marginLeft: 15 }}>
                <Button
                  fullWidth
                  size="small"
                  variant="text"
                  label={`Cancel`}
                  hideRipples={true}
                  onClick={() => handleCancel()}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  privacySelectorWrapper: {
    marginBottom: 10,
  },
  avatarsWrapper: {
    marginTop: 0,
  },
  mainActionsWrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  commentEditor: {
    display: "flex",
    padding: "15px",
    backgroundColor: "white",
    borderRadius: 4,
    flex: "none",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
    border: `1px solid ${colors.border}`,
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  reviewActions: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  postButtonWrapper: {
    width: 70,
  },
  loadingWrapper: {
    display: "flex",
    alignItems: "center",
    minHeight: "28px",
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
  versionTrigger: {
    display: "flex",
    gap: 8,
    color: globalColors.BLACK(0.8),
    borderRadius: 4,
    border: `1px solid ${globalColors.GREY(0.4)}`,
    fontSize: 14,
    padding: "6px 12px",
    height: 38,
    alignItems: "center",
    cursor: "pointer",
    background: "white",
    minWidth: 130,
    fontWeight: 500,
    transition: "all 0.2s ease",
    ":hover": {
      borderColor: globalColors.GREY(0.6),
      background: globalColors.GREY(0.05),
    },
  },
  dropdownIcon: {
    fontSize: 12,
    color: globalColors.BLACK(0.6),
  },
  menuStyleOverride: {
    width: 300,
    marginTop: 4,
  },
  menuOptionContent: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    padding: "8px 4px",
  },
  menuOptionDescription: {
    fontSize: 13,
    color: globalColors.BLACK(0.6),
    marginTop: 2,
  },
  menuOptionIcon: {
    fontSize: 20,
    width: 20,
    height: 20,
  },
  triggerStatusIcon: {
    fontSize: 16,
    width: 16,
    height: 16,
  },
  approveIcon: {
    color: globalColors.NEW_GREEN(),
  },
  requestChangesIcon: {
    color: globalColors.RED(),
  },
  contentEditable: {
    minHeight: '150px',
    padding: '15px',
    position: 'relative',
    outline: 'none',
  },
  placeholder: {
    position: 'absolute',
    top: '15px',
    left: '15px',
    color: colors.gray,
    pointerEvents: 'none',
    userSelect: 'none',
  },
  editorContainer: {
    position: 'relative',
    background: '#fff',
    border: `1px solid ${colors.border}`,
    borderRadius: 4,
    marginBottom: 15,
  },
});

export default CommentEditor;
