import { emptyFncWithMsg } from "~/config/utils/nullchecks";
import {
  getIsReadyForNewInlineComment,
  getShouldSavePaperSilently,
} from "./util/PaperDraftUtils";
import InlineCommentUnduxStore, {
  cleanupStoreAndCloseDisplay,
} from "../PaperDraftInlineComment/undux/InlineCommentUnduxStore";
import { getDecorator } from "./util/PaperDraftDecoratorFinders";
import {
  getBlockStyleFn,
  getHandleKeyCommand,
} from "./util/PaperDraftTextEditorUtil";
import { handleBlockStyleToggle } from "../PaperDraftInlineComment/util/PaperDraftInlineCommentUtil";
import { ENTITY_KEY_TYPES } from "./util/PaperDraftUtilConstants";
import { paperFetchHook } from "./api/PaperDraftPaperFetch";
import PaperDraft from "./PaperDraft";
import PaperDraftInlineCommentRelativeWrap from "../PaperDraftInlineComment/PaperDraftInlineCommentRelativeWrap";
import PaperDraftUnduxStore from "./undux/PaperDraftUnduxStore";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { savePaperSilentlyHook } from "./api/PaperDraftSilentSave";

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
  const paperExtractorType = paperDraftStore.get("extractorType");
  const setEditorState = (updatedEditorState) =>
    paperDraftStore.set("editorState")(updatedEditorState);
  const setInitEditorState = (updatedInitStore) =>
    paperDraftStore.set("initEditorState")(updatedInitStore);
  const [isDraftInEditMode, setIsDraftInEditMode] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [seenEntityKeys, setSeenEntityKeys] = useState({});

  const decorator = useMemo(
    () =>
      getDecorator({
        paperExtractorType,
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
        paperExtractorType,
      });
    },
    [
      /* intentionally limited memoization */
      paperExtractorType,
      paperId,
    ]
  );

  const shouldSavePaperSilently = getShouldSavePaperSilently({
    isDraftInEditMode,
    paperDraftStore,
  });
  useEffect(() => {
    if (shouldSavePaperSilently) {
      savePaperSilentlyHook({
        editorState,
        onError: (error) => emptyFncWithMsg(error),
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
    inlineCommentStore,
    isDraftInEditMode,
  });
  useEffect(() => {
    /* listener to deal with editor selection & inline commenting */
    if (isReadyForNewInlineComment) {
      paperDraftStore.set("savedEditorState")(editorState);
      cleanupStoreAndCloseDisplay({
        inlineCommentStore,
      });
      const updatedEditorState = handleBlockStyleToggle({
        editorState,
        onInlineCommentPrompt: ({ blockKey, entityKey }) => {
          inlineCommentStore.set("preparingInlineComment")({
            blockKey,
            entityKey,
          });
          inlineCommentStore.set("promptedEntityKey")(entityKey);
        },
        toggledStyle: ENTITY_KEY_TYPES.INLINE_COMMENT,
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
    <PaperDraftInlineCommentRelativeWrap>
      <PaperDraft
        textEditorProps={{
          // TODO: Calvinhlee. should be getting the extractor type from the backend
          blockStyleFn: getBlockStyleFn(paperExtractorType),
          editorState,
          handleDrop: () => true /* disallows dragging within editor */,
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
    </PaperDraftInlineCommentRelativeWrap>
  );
}
