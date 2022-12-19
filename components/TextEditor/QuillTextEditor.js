// NPM
import ReactDOMServer from "react-dom/server";
import {
  createRef,
  Fragment,
  Component,
  useRef,
  useState,
  useEffect,
} from "react";
import { css, StyleSheet } from "aphrodite";
import { connect } from "react-redux";
import numeral from "numeral";

// Component
import FormButton from "~/components/Form/Button";
import Loader from "~/components/Loader/Loader";

import { MessageActions } from "~/redux/message";
import { ModalActions } from "~/redux/modals";
import ReviewCategorySelector from "~/components/TextEditor/ReviewCategorySelector";

// Config
import colors from "~/config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import faIcons from "~/config/themes/icons";
import QuillPeerReviewRatingBlock from "~/components/TextEditor/lib/QuillPeerReviewRatingBlock";
import PostTypeSelector from "~/components/TextEditor/PostTypeSelector";
import reviewCategories from "~/components/TextEditor/config/reviewCategories";
import { POST_TYPES } from "./config/postTypes";
import trimQuillEditorContents from "./util/trimQuillEditorContents";
import hasQuillContent from "./util/hasQuillContent";
import isQuillEmpty from "./util/isQuillEmpty";
import { breakpoints } from "~/config/themes/screen";
import CreateBountyBtn from "../Bounty/CreateBountyBtn";
import icons from "~/config/themes/icons";
import { getCurrentUserLegacy } from "~/config/utils/user";
import ReactQuill from "react-quill";
import MagicUrl from "quill-magic-url";

const modules = {
  magicUrl: true,
  keyboard: {
    bindings: {
      commandEnter: {
        key: 13,
        shortKey: true,
        metaKey: true,
        handler: this.onSubmit,
      },
    },
  },
  toolbar: {
    magicUrl: true,
    container: "#" + this.props.uid,
    handlers: {
      image: this.imageHandler,
    },
  },
};

// FIXME: utils
const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const formatRange = (range) => {
  return range ? [range.index, range.index + range.length].join(",") : "none";
};

const formatURL = (url) => {
  let http = "http://";
  let https = "https://";
  if (!url) {
    return;
  }
  if (url.startsWith(http)) {
    return url;
  }

  if (!url.startsWith(https)) {
    url = https + url;
  }
  return url;
};

const getFileUrl = ({ fileString, type }) => {
  let payload = {
    content_type: type.split("/")[1],
    content: fileString,
  };
  return fetch(API.SAVE_IMAGE, API.POST_CONFIG(payload))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      if (err.response.status === 429) {
        this.props.openRecaptchaPrompt(true);
      }
    });
};

const EditorButtons = ({
  selectedPostTypeStruct,
  hideButton,
  loading,
  submitDisabled,
  editing,
  onCancel,
  interimBounty,
  onInterimBountyChange,
  showBountyBtn,
  currentUser,
  bounty,
  onBountyChange,
  onSubmit,
  quill,
}) => {
  const isRequestMode = selectedPostTypeStruct?.group === "request";
  const isAnswerType = selectedPostTypeStruct?.value === POST_TYPES.ANSWER;

  const label = isRequestMode
    ? "Request"
    : isAnswerType
    ? "Post Answer"
    : "Post";

  const handleInterimBounty = (value) => {
    onInterimBountyChange(value);
  };

  const handleBounty = (value) => {
    onBountyChange(value);
  };

  const renderDisabledButton = () => {
    return (
      <FormButton
        onClick={null}
        hideRipples
        disabled={submitDisabled}
        label={<Loader loading={true} color={"#FFF"} size={20} />}
        customButtonStyle={[
          toolbarStyles.postButtonStyle,
          isRequestMode && toolbarStyles.requestButton,
          isAnswerType && toolbarStyles.answerButton,
        ]}
        customLabelStyle={toolbarStyles.postButtonLabel}
      />
    );
  };

  const renderCancelButton = () => {
    return (
      <div onClick={onCancel} className={css(toolbarStyles.cancelButton)}>
        Cancel
      </div>
    );
  };

  const renderInterimBounty = () => {
    return (
      <button
        className={css(styles.bountyAdded)}
        onClick={() => {
          handleInterimBountyChange(null);
        }}
      >
        <img
          className={css(styles.RSCIcon)}
          src="/static/icons/coin-filled.png"
          alt="Pot of Gold"
        />
        <span className={css(styles.bountyText)}>
          {numeral(this.state.interimBounty.amount).format("0,0.[0000000000]")}{" "}
          <span className={css(styles.mobile)}>RSC </span>
          <span className={css(styles.desktop)}>ResearchCoin </span>
          Bounty Added{" "}
        </span>
        <span className={css(styles.closeBounty)}>{icons.times}</span>
      </button>
    );
  };

  const renderAlternativeBounty = () => {
    if (showBountyBtn) {
      return (
        <CreateBountyBtn
          onBountyAdd={(bounty) => {
            handleInterimBountyChange(bounty);
          }}
          withPreview={true}
          bountyText={quill.getText()}
          currentUser={currentUser}
          bounty={bounty}
          onBountyCancelled={() => {
            handleBountyChange(null);
          }}
        />
      );
    } else {
      return (
        <FormButton
          onClick={onSubmit}
          label={editing ? "Save changes" : label}
          disabled={submitDisabled}
          customButtonStyle={[
            toolbarStyles.postButtonStyle,
            isRequestMode && toolbarStyles.requestButton,
            isAnswerType && toolbarStyles.answerButton,
          ]}
          customLabelStyle={toolbarStyles.postButtonLabel}
        />
      );
    }
  };

  return (
    <div className={css(styles.postButtonContainer)}>
      {!hideButton && loading && renderDisabledButton()}
      {!hideButton && !loading && editing && renderCancelButton()}
      <div className={css(styles.bountyBtnContainer)}>
        {!hideButton && !loading && interimBounty && renderInterimBounty()}
        {!hideButton && !loading && !interimBounty && renderAlternativeBounty()}
      </div>
    </div>
  );
};

const EditorToolbar = ({
  uid,
  showFullEditor,
  onShowFullEditorChange,
  faIcons,
}) => {
  let showEditorClassName = `show-full-editor ${
    showFullEditor ? "ql-active" : ""
  }`;
  let qlClassName = `ql-full-editor ${
    showFullEditor && "ql-full-editor-visible"
  }`;

  const handleShowEditor = () => {
    // Propogate change up
    onShowFullEditorChange(!showFullEditor);
  };

  return (
    <div id={uid} className="ql-toolbar">
      <span className="ql-formats">
        <button className="ql-blockquote"></button>
        <button className="ql-link" />
        <button className="ql-image" />
        <button className="ql-video"></button>
        <button
          id="show-editor"
          className={showEditorClassName}
          onClick={handleShowEditor}
        >
          {faIcons.fontCase}
          <span className="ql-up">{faIcons.chevronUp}</span>
        </button>
      </span>

      <div className={qlClassName}>
        <span className="ql-formats">
          <button className="ql-bold" />
          <button className="ql-italic" />
          <button className="ql-underline" />
          <button className="ql-strike"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-list" value="ordered" />
          <button className="ql-list" value="bullet" />
          <button className="ql-indent" value="-1" />
          <button className="ql-indent" value="+1" />
        </span>
        <span className="ql-formats">
          <button className="ql-code-block"></button>
          <button className="ql-clean"></button>
        </span>
      </div>
    </div>
  );
};

const Editor = ({
  value,
  selectedPostTypeStruct,
  isAcceptedAnswer,
  isBounty,
  readOnly,
  uid,
  commentStyles,
  editing,
  documentType,
  containerStyles,
  placeholder,
  setBounty,
  bounty,
  currentUser,
  showBountyBtn,
  loading,
  hideButton,
  submit,
  cancel,
  hasHeader,
  handleFocus,
  onChange,
  openRecaptchaPrompt,
  showMessage,
  focusEditor,
}) => {
  // Create a reference to this component
  const reactQuillRef = useRef(0);

  const [theme, setTheme] = useState("snow");
  const [handlerAdded, setHandlerAdded] = useState(false);
  const [editorValue, setEditorValue] = useState(value ? value : { ops: [] });
  const [editValue, setEditValue] = useState(value ? value : { ops: [] });
  const [quill, setQuill] = useState();
  const [plainText, setPlainText] = useState("");
  const [events, setEvents] = useState([]);
  const [showFullEditor, setShowFullEditor] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [currentSelectedPostType, setCurrentSelectPostType] = useState(
    selectedPostTypeStruct
  );
  const [interimBounty, setInterimBounty] = useState();
  const [isFocus, setIsFocus] = useState(false);
  const [isEditing, setIsEditing] = useState(editing);

  useEffect(() => {
    if (reactQuillRef.current === null) return;
    if (typeof reactQuillRef.current.getEditor !== "function") return;
    if (quill !== null) return;

    // Set the state value for Quill to the editor obtained from
    // the constant ref we have for the ReactQuill component
    setQuill(reactQuillRef.current.getEditor());
    // FIXME: quill here?
  }, [quill, reactQuillRef]);

  // Run only once
  useEffect(() => {
    ReactQuill.register(QuillPeerReviewRatingBlock);
    ReactQuill.register("modules/magicUrl", MagicUrl);
    const icons = ReactQuill.import("ui/icons");
    icons.video = ReactDOMServer.renderToString(faIcons.video);

    const Link = ReactQuill.import("formats/link");
    Link.sanitize = function customSanitizeLinkInput(linkValueInput) {
      const formatURL = (url) => {
        let http = "http://";
        let https = "https://";
        if (!url) {
          return;
        }
        if (url.startsWith(http)) {
          return url;
        }

        if (!url.startsWith(https)) {
          url = https + url;
        }
        return url;
      };

      let val = formatURL(linkValueInput);
      return builtInFunc.call(this, val); // retain the built-in logic
    };

    setHandlerAdded(true);
  }, []);

  // Calls the parent to show a message based on input value
  const showLoader = (isLoading) => {
    // TODO: cannot pass state
    showMessage({ load: isLoading, state: isLoading });
  };

  // Triggers the editor to focus
  const triggerFocusEditor = () => {
    if (quill && !readOnly) {
      quill.focus();
      // Place the cursor at the end of the text
      const range = quill.getLength();
      quill.setSelection(range + 1);

      setIsFocus(true);
    }
  };

  const handleImage = () => {
    // Create an invisible input element
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async function () {
      showLoader(true);

      const file = input.files[0];
      const fileString = await toBase64(file);
      const type = file.type;
      const fileUrl = await getFileUrl({ fileString, type });
      const range = quill.getSelection();

      // this part the image is inserted
      // by 'image' option below, you just have to put src(link) of img here.
      quill.insertEmbed(range.index, "image", fileUrl);
      showLoader(false);
    };
    // TODO: bind this
  };

  const forcePlaceholderToShow = ({ placeholderText }) => {
    if (placeholderText) {
      quill.root.setAttribute("data-placeholder", placeholderText);
    }

    quill.root.classList.add("ql-blank");
  };

  const onEditorChangeSelection = (range, source) => {
    if (selection !== range) {
      setSelection(range);
      const formattedRange = formatRange(selection);
      const changeEvent = `[${source}] selection-change(${formattedRange} -> ${range})`;
      setEvents([changeEvent]);
    }
  };

  const onEditorFocus = (range, source, editor) => {
    const formattedRange = formatRange(range);
    const changeEvent = `[${source}] focus(${formattedRange})`;

    setEvents([changeEvent]);

    if (!readOnly) {
      setIsFocus(true);
    }

    if (handleFocus) {
      handleFocus(true);
    }
  };

  const insertReviewCategory = ({ category, index }) => {
    let range = quill.getSelection(true);
    let insertAtIndex = index ?? range.index;
    if (insertAtIndex === 0 && category.value !== "overall") {
      insertAtIndex++;
    }

    quill.insertEmbed(
      insertAtIndex,
      "peer-review-rating",
      {
        rating: 3,
        category: category.value,
      },
      this.state.Quill.sources.SILENT
    );
  };

  const handlePostTypeSelect = (selectedType) => {
    const currentType = currentSelectedPostType;

    if (currentType.value === selectedType.value) {
      return;
    }

    const isPeerReview =
      selectedType.value === POST_TYPES.REVIEW &&
      currentType.value !== selectedType.value;

    if (isPeerReview) {
      quill.root.classList.add("peer-review");

      const trimmedContents = trimQuillEditorContents({
        contents: quill.getContents(),
      });

      quill.setContents(trimmedContents);

      insertReviewCategory({
        category: reviewCategories.overall,
        index: 0,
      });

      const hasContent = hasQuillContent({ quillRef: this.quillRef });

      if (!hasContent) {
        forcePlaceholderToShow({
          placeholderText: selectedType.placeholder,
        });
      }
    } else {
      quill.root.classList.remove("peer-review");
      const editorWithoutPeerReviewBlocks = quill
        .getContents([])
        .ops.filter((op) => !op.insert["peer-review-rating"]);
      quill.setContents(editorWithoutPeerReviewBlocks);

      const trimmedContents = trimQuillEditorContents({
        contents: this.quillRef.getContents(),
      });

      quill.setContents(trimmedContents);

      const hasContent = hasQuillContent({ quillRef: this.quillRef });
      if (!hasContent) {
        forcePlaceholderToShow({
          placeholderText: selectedType.placeholder,
        });
      }
    }

    setCurrentSelectPostType(selectedType);
    triggerFocusEditor();
  };

  const handleShowFullEditorChange = (changeValue) => {
    setShowFullEditor(changeValue);
  };

  const onEditorBlur = (previousRange, source) => {
    const formatedRange = formatRange(previousRange);
    const changeEvent = `[${source}] blur(${formattedRange})`;

    setEvents([changeEvent]);
    setIsFocus(false);

    if (handleFocus) {
      handleFocus(true);
    }
  };

  const clearEditorContent = () => {
    if (hasHeader) {
      // Set the quill editor to the original props value content
      // with the header
      quill.setContents(value);
    }

    quill.setContents([]);
  };

  // Converts an HTML value to a QuillJS
  // delta value
  const convertHtmlToDelta = (value) => {
    if (typeof value === "string") {
      return quill.clipboard.convert(value);
    } else {
      return value;
    }
  };

  const onCancel = (event) => {
    const isConfirmed = confirm("Your changes will be removed");
    if (!isConfirmed) {
      return false;
    }

    event?.preventDefault();
    event?.stopPropagation();

    if (editing) {
      let content = convertHtmlToDelta(editorValue);

      quill.setContents(content);
      quill.blur();
    }

    setIsFocus(false);

    // Trigger cancel if set
    if (cancel) {
      cancel();
    }
  };

  const onSubmit = () => {
    const editor = reactQuillRef.current.getEditor();
    const content = editor.getContents();
    const plainText = editor.getText();

    setEditorValue(content);
    setEditValue(content);
    setPlainText(plainText);

    submit({
      interimBounty: interimBounty,
      content,
      plainText,
      callback: clearEditorContent,
      discussionType: setCurrentSelectPostType.value,
    });
  };

  const onEditorChange = (value, delta, source, editor) => {
    const editorContents = editor.getContents();
    const editorWithoutPeerReviewBlocks = editorContents.ops.filter(
      (op) => !op.insert["peer-review-rating"]
    );

    const lastDelta =
      editorWithoutPeerReviewBlocks[editorWithoutPeerReviewBlocks.length - 1];

    const editorHasTrivialText =
      editorWithoutPeerReviewBlocks.length === 1 &&
      lastDelta.insert === "\n" &&
      !lastDelta.attributes;

    if (editorHasTrivialText) {
      forcePlaceholderToShow({
        placeholderText: this.state.selectedPostTypeStruct.placeholder,
      });
    }

    if (isQuillEmpty(editorContents)) {
      setSubmitDisabled(true);
    } else {
      setSubmitDisabled(false);
    }

    if (editing) {
      setEditValue(editorContents);
      onChange(editorContents);
      return;
    }

    setEditorValue(editorContents);
    setEditValue(editorContents);

    const changeEvent = `[${source}] text-change`;
    setEvents([changeEvent]);
    setPlainText(editor.getText());
    onChange(editorContents);
  };

  // Runs every time
  useEffect(() => {
    // Focus the editor if we can it is not read only
    if (!isFocus && focusEditor) {
      // If quill is setup and this is not read only block
      triggerFocusEditor();
    }
  });

  useEffect(() => {
    // Expecting quill refs

    if (isEditing && !isFocused) {
      // Focus the editor
      triggerFocusEditor();
    }

    // TODO: how to handle value change
    if (value) {
      setEditValue(value);
      setEditorValue(value);
    }
  }, [editing, value]);

  // Renders the read only variant of the editor
  const renderReadOnly = () => {
    const modules = {
      toolbar: false,
    };

    const editorValue = trimQuillEditorContents({
      contents: editorValue,
    });

    return (
      <div
        key={uid}
        className={css(
          styles.readOnly,
          this.props.isAcceptedAnswer && styles.isAcceptedAnswer,
          this.props.isBounty && styles.isBounty
        )}
      >
        <ReactQuill
          ref={reactQuillRef}
          readOnly={true}
          defaultValue={editorValue}
          modules={modules}
          placeholder={currentSelectedPostType.placeholder}
        />
      </div>
    );
  };

  const handleInterimBountyChange = (change) => {
    setInterimBounty(change);
  };

  const handleBountyChange = (change) => {
    setBounty(change);
  };

  const renderEditable = () => {
    return (
      <div
        className={css(
          styles.editor,
          containerStyles,
          isFocus && styles.focus,
          isFocus &&
            selectedPostTypeStruct.group === "request" &&
            styles.focusRequestType,
          isFocus &&
            selectedPostTypeStruct.value === POST_TYPES.ANSWER &&
            styles.focusAnswerType
        )}
        key={uid}
      >
        <div className={css(styles.commentEditor, commentEditorStyles)}>
          {isTopLevelComment && (
            <div className={css(styles.postTypeContainer)}>
              <PostTypeSelector
                selectedType={selectedPostTypeStruct}
                documentType={documentType}
                handleSelect={(selectedType) =>
                  handlePostTypeSelect(selectedType)
                }
              />
            </div>
          )}

          <ReactQuill
            ref={reactQuillRef}
            theme={theme}
            readOnly={readOnly}
            onChange={onEditorChange}
            onChangeSelection={onEditorChangeSelection}
            onFocus={onEditorFocus}
            onBlur={onEditorBlur}
            defaultValue={editing ? editValue : value}
            modules={modules}
            formats={Editor.formats}
            className={css(styles.editSection, commentStyles && commentStyles)}
            placeholder={
              placeholder ? placeholder : selectedPostTypeStruct.placeholder
            }
          />
          {selectedPostTypeStruct.value === POST_TYPES.REVIEW && (
            <div className={css(styles.reviewCategoryContainer)}>
              <ReviewCategorySelector
                handleSelect={(category) => {
                  insertReviewCategory({ category });
                }}
              />
            </div>
          )}
          <div className={css(styles.toolbarContainer)}>
            <EditorToolbar
              uid={uid}
              showFullEditor={showFullEditor}
              onShowFullEditorChange={handleShowFullEditorChange}
              faIcons={faIcons}
            />
          </div>

          <div className={css(styles.footerContainer)}>
            {!readOnly && (
              <EditorButtons
                selectedPostTypeStruct={selectedPostTypeStruct}
                hideButton={hideButton}
                loading={loading}
                submitDisabled={submitDisabled}
                editing={editing}
                onCancel={onCancel}
                interimBounty={interimBounty}
                onInterimBountyChange={handleInterimBountyChange}
                showBountyBtn={showBountyBtn}
                currentUser={currentUser}
                bounty={bounty}
                onBountyChange={handleBountyChange}
                onSubmit={onSubmit}
                quill={quill}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  return <div>{readOnly ? renderReadOnly() : renderEditable()}</div>;
};

Editor.formats = [
  "image",
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "video",
  "clean",
  "background",
  "code-block",
  "direction",
  "peer-review-rating",
];

const styles = StyleSheet.create({
  reviewCategoryContainer: {
    paddingTop: 15,
    paddingBottom: 15,
  },
  RSCIcon: {
    height: 20,
    marginRight: 4,
  },
  readOnly: {
    background: "white",
    padding: "12px 15px",
    borderRadius: "4px",
    border: `1px solid ${colors.LIGHT_GREY()}`,
    boxSizing: "border-box",
  },
  isAcceptedAnswer: {
    border: `1px solid ${colors.NEW_GREEN()}`,
  },
  isBounty: {
    border: `1px solid ${colors.ORANGE()}`,
  },
  footerContainer: {
    display: "flex",
    borderTop: `1px solid ${colors.GREY_BORDER}`,
    alignItems: "center",
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      flexWrap: "wrap",
    },
  },
  desktop: {
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      display: "none",
    },
  },
  mobile: {
    [`@media only screen and (min-width: ${breakpoints.tablet.str})`]: {
      display: "none",
    },
  },
  postButtonContainer: {
    padding: 12,
    paddingRight: 0,
    paddingBottom: 0,
    display: "flex",
    width: "100%",
    alignItems: "center",
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      marginLeft: "unset",
      paddingLeft: 0,
      width: "100%",
      justifyContent: "space-between",
    },
  },
  postTypeContainer: {
    marginBottom: 25,
  },
  fullEditor: {
    display: "none",
  },
  bountyBtnContainer: {
    marginRight: "auto",
  },
  showFullEditor: {
    display: "block",
  },
  editor: {
    width: "100%",
    position: "relative",
    border: `1px solid ${colors.GREY_LINE()}`,
    padding: "15px",
    borderRadius: "4px",
    background: "white",
    boxSizing: "border-box",
  },
  bountyAdded: {
    background: colors.GREY(0.2),
    border: 0,
    minHeight: 30,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 4,
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    paddingTop: 5,
    paddingBottom: 5,
  },
  closeBounty: {
    color: "grey",
  },
  bountyText: {
    marginRight: 8,
    fontSize: 15,
  },
  editable: {},
  focus: {
    border: `1px solid ${colors.NEW_BLUE()}`,
  },
  focusRequestType: {
    border: `1px solid ${colors.PURPLE_LIGHT()}`,
  },
  focusAnswerType: {
    border: `1px solid ${colors.NEW_GREEN()}`,
  },
  editSection: {
    minHeight: 75,
  },
  comment: {
    whiteSpace: "pre-wrap",
    padding: 16,
    "@media only screen and (max-width: 767px)": {
      paddingLeft: 0,
    },
  },
  button: {
    width: 180,
    height: 55,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    borderRadius: 8,
    fontSize: 16,
    outline: "none",
    cursor: "pointer",
  },
  submit: {
    background: colors.PURPLE(),
    color: "#fff",
  },
  added: {
    background: "rgba(19, 145, 26, .2)",
    color: "rgba(19, 145, 26)",
  },
  removed: {
    background: "rgba(173, 34, 21, .2)",
    color: "rgb(173, 34, 21)",
  },
  image: {
    display: "block",
    maxWidth: "100%",
    maxHeight: 500,
    opacity: 1,
  },
  deleteImage: {
    position: "absolute",
    top: 10,
    right: 10,
    fontSize: 30,
    color: "#fff",
    cursor: "pointer",
    zIndex: 3,
  },
  imageContainer: {
    position: "relative",
    width: "fit-content",
  },
  imageBlock: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  imageOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    opacity: "0%",
    opacity: 1,
    ":hover": {
      background: "linear-gradient(#000 1%, transparent 100%)",
      opacity: "100%",
    },
  },
  iframeContainer: {
    position: "relative",
    paddingBottom: "56.25%",
    paddingTop: 30,
    height: 0,
    overflow: "hidden",
  },
  iframe: {
    width: 543,
    height: 305.5,

    "@media only screen and (max-width: 767px)": {
      width: "100%",
    },
  },
  smallOverlay: {
    height: 60,
  },
  bold: {
    fontWeight: 500,
    color: "#241F3A",
  },
  stickyBottom: {
    position: "sticky",
    backgroundColor: "#fff",
    top: 59,
    zIndex: 3,
  },
  removeStickyToolbar: {
    position: "unset",
  },
  urlToolTip: {
    top: 60,
    bottom: "unset",
  },
  imgToolTip: {
    top: 60,
    bottom: "unset",
  },
  headerOne: {
    fontSize: 22,
    fontWeight: 500,
    paddingBottom: 10,
  },
  headingTwo: {
    fontSize: 20,
    fontWeight: 500,
    paddingBottom: 10,
  },
});

const toolbarStyles = StyleSheet.create({
  buttonActive: {
    color: colors.BLACK(1),
  },
  button: {
    color: "rgb(204, 204, 204)",
    cursor: "pointer",
    marginLeft: 24,
    ":hover": {
      color: colors.BLACK(1),
    },
  },
  requestButton: {
    background: colors.PURPLE_LIGHT(),
    ":hover": {
      opacity: 0.9,
      background: colors.PURPLE_LIGHT(),
    },
  },
  answerButton: {
    background: colors.NEW_GREEN(),
    ":hover": {
      opacity: 0.9,
      background: colors.NEW_GREEN(),
    },
  },
  toolbarSummary: {
    borderBottom: "1px solid",
    borderTop: 0,
    borderColor: "rgb(235, 235, 235)",
    background: "#fff",
    paddingLeft: 0,
  },
  toolbar: {
    // borderTop: "1px solid",
    borderColor: "rgb(235, 235, 235)",
    paddingTop: 15,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 8,
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    background: "#fff",
  },
  iconRow: {
    display: "flex",
    flexWrap: "wrap",
    marginBottom: 0,
    whiteSpace: "nowrap",
    alignSelf: "center",
  },
  submit: {
    background: colors.PURPLE(1),
    color: "#fff",
    border: "none",
    padding: "12px 36px",
    fontSize: 16,
    cursor: "pointer",
    outline: "none",
    borderRadius: 4,
  },
  first: {
    marginLeft: 0,
  },
  cancelButton: {
    color: colors.MEDIUM_GREY2(),
    fontSize: 15,
    marginRight: 25,
    cursor: "pointer",
  },
  postButtonLabel: {
    fontWeight: 500,
  },
  postButtonStyle: {
    height: 30,
    width: "auto",
    fontSize: 16,
    marginLeft: "auto",
    padding: "17px 30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    borderRadius: 4,
    userSelect: "none",
    minWidth: 95,
    background: colors.NEW_BLUE(),
    ":hover": {
      opacity: 0.9,
      background: colors.NEW_BLUE(),
    },
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      minHeight: "unset",
      minWidth: 95,
      height: 30,
    },
  },
  ripples: {
    flex: 1,
  },
  divider: {
    width: 10,
  },
});

const mapStateToProps = (state) => {
  return {
    currentUser: getCurrentUserLegacy(state),
  };
};

const mapDispatchToProps = {
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
  openRecaptchaPrompt: ModalActions.openRecaptchaPrompt,
};

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
