import { createConnectedStore, Store } from "undux";
import { EditorState } from "draft-js";
import { EXTRACTOR_TYPE } from "../util/PaperDraftUtilConstants";
import { ID, ValueOf } from "../../../config/types/root_types";
import { nullthrows } from "../../../config/utils/nullchecks";

export type PaperDraftStore = Store<State>;
export type State = {
  editorState: EditorState | null;
  extractorType: ValueOf<typeof EXTRACTOR_TYPE> | null;
  initEditorState: EditorState | null;
  lastSavePaperTime: number | null;
  paperID: ID;
  savedEditorState: EditorState | null /* used as a "saved" state for the editor state to get reverted back to */;
  shouldSavePaper: boolean; // trigger save paper behind the scene
};

const initialState: State = {
  editorState: EditorState.createEmpty(),
  extractorType: EXTRACTOR_TYPE.ENGRAFO,
  initEditorState: EditorState.createEmpty(),
  lastSavePaperTime: null,
  paperID: null,
  savedEditorState: EditorState.createEmpty(),
  shouldSavePaper: false,
};

export function clearSelection({
  paperDraftStore,
}: {
  paperDraftStore: PaperDraftStore;
}): void {
  paperDraftStore.set("editorState")(
    clearSelectionFromState({
      editorState: nullthrows(
        paperDraftStore.get("editorState"),
        "EditorState must be present for be able to clear its selection"
      ),
    })
  );
}

export function clearSelectionFromState({
  editorState,
}: {
  editorState: EditorState;
}): EditorState {
  return EditorState.forceSelection(
    editorState,
    editorState.getSelection().merge({
      anchorOffset: 0,
      focusOffset: 0,
      isBackward: false,
      hasFocus: false,
    })
  );
}

export function revertBackToSavedState({
  paperDraftStore,
}: {
  paperDraftStore: PaperDraftStore;
}): void {
  paperDraftStore.set("editorState")(
    clearSelectionFromState({
      editorState:
        paperDraftStore.get("savedEditorState") ||
        paperDraftStore.get("editorState") ||
        EditorState.createEmpty(),
    })
  );
}

export default createConnectedStore(initialState);
