import { Store, createConnectedStore } from "undux";
import { EditorState } from "draft-js";
import { ID, ValueOf } from "../../../config/types/root_types";
import { EXTRACTOR_TYPE } from "../util/PaperDraftUtilConstants";

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
  const currEditorState = paperDraftStore.get("editorState");
  if (currEditorState != null) {
    paperDraftStore.set("editorState")(
      EditorState.forceSelection(
        currEditorState,
        currEditorState.getSelection().merge({
          anchorOffset: 0,
          focusOffset: 0,
          isBackward: false,
          hasFocus: false,
        })
      )
    );
  }
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
