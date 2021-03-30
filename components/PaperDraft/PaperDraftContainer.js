import { CompositeDecorator, EditorState } from "draft-js";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Helpers } from "@quantfive/js-web-config";
import InlineCommentUnduxStore from "../PaperDraftInlineComment/undux/InlineCommentUnduxStore";
import { fetchPaperDraft } from "~/config/fetch";
import {
  getBlockStyleFn,
  getHandleKeyCommand,
} from "./util/PaperDraftTextEditorUtil";
import {
  handleBlockStyleToggle,
  INLINE_COMMENT_MAP,
} from "../PaperDraftInlineComment/util/PaperDraftInlineCommentUtil";
import {
  findInlineCommentEntity,
  findWayPointEntity,
} from "./util/PaperDraftDecoratorFinders";
import {
  emptyFunction,
  formatBase64ToEditorState,
  formatRawJsonToEditorState,
} from "./util/PaperDraftUtils";
import PaperDraft from "./PaperDraft";
import PaperDraftInlineCommentTextWrap from "../PaperDraftInlineComment/PaperDraftInlineCommentTextWrap";
import WaypointSection from "./WaypointSection";

function getDecorator({ seenEntityKeys, setActiveSection, setSeenEntityKeys }) {
  return new CompositeDecorator([
    {
      component: (props) => (
        <WaypointSection {...props} onSectionEnter={setActiveSection} />
      ),
      strategy: findWayPointEntity(seenEntityKeys, setSeenEntityKeys),
    },
    {
      component: (props) => <PaperDraftInlineCommentTextWrap {...props} />,
      strategy: findInlineCommentEntity,
    },
  ]);
}

function paperFetchHook({
  decorator,
  paperId,
  setEditorState,
  setInitEditorState,
  setIsFetching,
  setPaperDraftExists,
  setPaperDraftSections,
}) {
  const handleFetchSuccess = (data) => {
    const onFormatSuccess = ({ sections }) => {
      /* logical ordering */
      setPaperDraftSections(sections);
      setPaperDraftExists(true);
      setIsFetching(false);
    };
    let digestibleFormat = null;
    if (typeof data !== "string") {
      digestibleFormat = formatRawJsonToEditorState({
        rawJson: data,
        decorator,
        onSuccess: onFormatSuccess,
      });
    } else {
      digestibleFormat = formatBase64ToEditorState({
        base64: data,
        decorator,
        onSuccess: onFormatSuccess,
      });
    }
    setInitEditorState(digestibleFormat);
    setEditorState(digestibleFormat);
  };

  const handleFetchError = (_err) => {
    setPaperDraftExists(false);
    setPaperDraftSections([]);
    setIsFetching(false);
  };

  fetchPaperDraft({ paperId })
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then(handleFetchSuccess)
    .catch(handleFetchError);
}

// Container to fetch documents & convert strings into a disgestable format for PaperDraft.
function PaperDraftContainer({
  isViewerAllowedToEdit,
  paperDraftExists,
  paperDraftSections,
  paperId,
  setActiveSection,
  setPaperDraftExists,
  setPaperDraftSections,
}) {
  const inlineCommentStore = InlineCommentUnduxStore.useStore();
  const [isDraftInEditMode, setIsDraftInEditMode] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [initEditorState, setInitEditorState] = useState(
    EditorState.createEmpty()
  );
  const [isFetching, setIsFetching] = useState(true);
  const [seenEntityKeys, setSeenEntityKeys] = useState({});

  const decorator = useMemo(
    () =>
      getDecorator({
        seenEntityKeys,
        setActiveSection,
        setEditorState,
        setSeenEntityKeys,
      }),
    [seenEntityKeys, setSeenEntityKeys, setActiveSection]
  );

  useEffect(
    /* backend fetch */
    () => {
      inlineCommentStore.set("paperID")(paperId);
      paperFetchHook({
        decorator,
        paperId,
        setEditorState,
        setInitEditorState,
        setIsFetching,
        setPaperDraftExists,
        setPaperDraftSections,
      });
    },
    [paperId] /* intentionally hard enforcing only on paperID. */
  );

  const currSelection = editorState.getSelection();
  useEffect(() => {
    /* listener to deal with editor selection & inline commenting */
    if (currSelection != null && !currSelection.isCollapsed()) {
      const updatedEditorState = handleBlockStyleToggle({
        editorState,
        toggledStyle: INLINE_COMMENT_MAP.TYPE_KEY,
      });
      setEditorState(updatedEditorState);
    }
  }, [currSelection]);

  const handleKeyCommand = useCallback(
    ({ editorState, setEditorState }) => {
      if (isDraftInEditMode) {
        return getHandleKeyCommand({
          editorState,
          setEditorState,
        });
      } else {
        return () => {};
      }
    },
    [editorState, isDraftInEditMode, setEditorState]
  );

  return (
    <PaperDraft
      textEditorProps={{
        blockStyleFn: getBlockStyleFn,
        editorState,
        handleKeyCommand: handleKeyCommand({ editorState, setEditorState }),
        initEditorState,
        isInEditMode: isDraftInEditMode,
        onChange: setEditorState,
        setInitEditorState,
        setIsInEditMode: setIsDraftInEditMode,
        spellCheck: true,
      }}
      inlineCommentStore={inlineCommentStore}
      isFetching={isFetching}
      isViewerAllowedToEdit={isViewerAllowedToEdit}
      paperDraftExists={paperDraftExists}
      paperDraftSections={paperDraftSections}
      paperId={paperId}
    />
  );
}

export default PaperDraftContainer;
