import { emptyFunction } from "./util/PaperDraftUtils";
import InlineCommentUnduxStore from "../PaperDraftInlineComment/undux/InlineCommentUnduxStore";
import { getDecorator } from "./util/PaperDraftDecoratorFinders";
import {
  getBlockStyleFn,
  getHandleKeyCommand,
} from "./util/PaperDraftTextEditorUtil";
import { handleBlockStyleToggle } from "../PaperDraftInlineComment/util/PaperDraftInlineCommentUtil";
import { INLINE_COMMENT_MAP } from "./util/PaperDraftTextEditorUtil";
import { inlineCommentFetchAll } from "../InlineCommentDisplay/api/InlineCommentFetch";
import { paperFetchHook } from "./api/PaperDraftPaperFetch";
import PaperDraft from "./PaperDraft";
import PaperDraftUnduxStore from "./undux/PaperDraftUnduxStore";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { savePaperSilentlyHook } from "./api/PaperDraftSilentSave";

function getIsGoodTimeInterval(unixTimeInMilliSec) {
  return unixTimeInMilliSec === null
    ? true
    : Date.now() - unixTimeInMilliSec > 500; // 300-500 millisec is ui convention
}

function getIsReadyForNewInlineComment({
  editorState,
  isDraftInEditMode,
  unduxStore,
}) {
  const currSelection = editorState.getSelection();
  const isGoodTimeInterval = getIsGoodTimeInterval(
    unduxStore.get("lastPromptRemovedTime")
  );
  const hasActiveCommentPrompt = unduxStore.get("promptedEntityKey") != null;
  return (
    !isDraftInEditMode &&
    isGoodTimeInterval &&
    !hasActiveCommentPrompt &&
    currSelection != null &&
    !currSelection.isCollapsed()
  );
}

function getShouldSavePaperSilently({ isDraftInEditMode, unduxStore }) {
  const isGoodTimeInterval = getIsGoodTimeInterval(
    unduxStore.get("lastSavePaperTime")
  );
  return (
    !isDraftInEditMode &&
    isGoodTimeInterval &&
    unduxStore.get("paperID") != null &&
    unduxStore.get("shouldSavePaper")
  );
}

// Container to fetch documents & convert strings into a disgestable format for PaperDraft.
export default function PaperDraftContainer({
  isViewerAllowedToEdit,
  paperDraftExists,
  paperDraftSections,
  paperId,
  setActiveSection,
  setPaperDraftExists,
  setPaperDraftSections,
}) {
  const paperDraftStore = PaperDraftUnduxStore.useStore();
  const inlineCommentStore = InlineCommentUnduxStore.useStore();
  const editorState = paperDraftStore.get("editorState");
  const initEditorState = paperDraftStore.get("initEditorState");
  const setEditorState = (updatedEditorState) =>
    paperDraftStore.set("editorState")(updatedEditorState);
  const setInitEditorState = (updatedInitStore) =>
    paperDraftStore.set("initEditorState")(updatedInitStore);

  const [isDraftInEditMode, setIsDraftInEditMode] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [seenEntityKeys, setSeenEntityKeys] = useState({});

  useEffect(() => {
    /* TODO: calvinhlee - discuss actual UI behavior & refactor this out */
    inlineCommentFetchAll({
      paperId,
      onSuccess: (results) => {
        const inlineComments = results.map((result) => {
          const { block_key, entity_key, id } = result;
          return {
            blockKey: block_key,
            entityKey: entity_key,
            commentThreadID: id,
          };
        });
        inlineCommentStore.set("inlineComments")(inlineComments);
      },
    });
  }, [paperId]);

  const decorator = useMemo(
    () =>
      getDecorator({
        seenEntityKeys,
        setActiveSection,
        setSeenEntityKeys,
      }),
    [seenEntityKeys, setActiveSection, setSeenEntityKeys]
  );

  useEffect(
    /* backend fetch */
    () => {
      paperDraftStore.set("paperID")(paperId);
      inlineCommentStore.set("paperID")(paperId);
      /* calvinhlee: the way decorator is attached to parsing here for waypoint needs to be taken out */
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

  const shouldSavePaperSilently = getShouldSavePaperSilently({
    isDraftInEditMode,
    unduxStore: paperDraftStore,
  });
  useEffect(() => {
    if (shouldSavePaperSilently) {
      savePaperSilentlyHook({
        editorState,
        onError: (error) => emptyFunction(error),
        onSuccess: () => {
          paperDraftStore.set("lastSavePaperTime")(Date.now());
          paperDraftStore.set("shouldSavePaper")(false);
          setInitEditorState(editorState);
        },
        paperDraftSections,
        paperId,
      });
    }
  }, [shouldSavePaperSilently]);

  const isReadyForNewInlineComment = getIsReadyForNewInlineComment({
    editorState,
    isDraftInEditMode,
    unduxStore: inlineCommentStore,
  });
  useEffect(() => {
    /* listener to deal with editor selection & inline commenting */
    if (isReadyForNewInlineComment) {
      const updatedEditorState = handleBlockStyleToggle({
        editorState,
        onInlineCommentPrompt: (entityKey) =>
          inlineCommentStore.set("promptedEntityKey")(entityKey),
        toggledStyle: INLINE_COMMENT_MAP.TYPE_KEY,
      });
      setEditorState(updatedEditorState);
    }
  }, [editorState, isReadyForNewInlineComment]);

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
        spellCheck: isDraftInEditMode,
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
