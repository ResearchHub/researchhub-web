import { CompositeDecorator, EditorState } from "draft-js";
import React, { useEffect, useMemo, useState } from "react";
import { Helpers } from "@quantfive/js-web-config";
import InlineCommentUnduxStore from "../PaperDraftInlineComment/undux/InlineCommentUnduxStore";
import { fetchPaperDraft } from "~/config/fetch";
import {
  getBlockStyleFn,
  getHandleKeyCommand,
} from "./util/PaperDraftTextEditorUtil";
import {
  findInlineCommentEntity,
  findWayPointEntity,
} from "./util/PaperDraftDecoratorFinders";
import {
  formatBase64ToEditorState,
  formatRawJsonToEditorState,
} from "./util/PaperDraftUtils";
import PaperDraft from "./PaperDraft";
import PaperDraftInlineCommentTextWrap from "../PaperDraftInlineComment/PaperDraftInlineCommentTextWrap";
import WaypointSection from "./WaypointSection";

function getDecorator({
  editorState,
  seenEntityKeys,
  setActiveSection,
  setEditorState,
  setSeenEntityKeys,
}) {
  return new CompositeDecorator([
    {
      component: (props) => (
        <WaypointSection {...props} onSectionEnter={setActiveSection} />
      ),
      strategy: findWayPointEntity(seenEntityKeys, setSeenEntityKeys),
    },
    {
      component: (props) => (
        <PaperDraftInlineCommentTextWrap
          {...props}
          editorState={editorState}
          setEditorState={setEditorState}
        />
      ),
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
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [initEditorState, setInitEditorState] = useState(
    EditorState.createEmpty()
  );
  const [isFetching, setIsFetching] = useState(true);
  const [seenEntityKeys, setSeenEntityKeys] = useState({});

  const decorator = getDecorator({
    editorState,
    seenEntityKeys,
    setActiveSection,
    setEditorState,
    setSeenEntityKeys,
  });

  useEffect(
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

  return (
    <PaperDraft
      textEditorProps={{
        blockStyleFn: getBlockStyleFn,
        editorState,
        handleKeyCommand: getHandleKeyCommand({
          editorState,
          setEditorState,
        }),
        initEditorState,
        onChange: setEditorState,
        setInitEditorState,
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
