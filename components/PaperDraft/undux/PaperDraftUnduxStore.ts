import { Store, createConnectedStore } from "undux";
import { EditorState } from "draft-js";

export type ID = string | number | null;
export type PaperDraftStore = Store<State>;
export type State = {
  editorState: EditorState | null;
  initEditorState: EditorState | null;
  lastSavePaperTime: number | null;
  paperID: ID;
  shouldSavePaper: boolean; // trigger save paper behind the scene
};

const initialState: State = {
  editorState: EditorState.createEmpty(),
  initEditorState: EditorState.createEmpty(),
  lastSavePaperTime: null,
  paperID: null,
  shouldSavePaper: false,
};

export function clearSelection({
  paperDraftStore,
}: {
  paperDraftStore: PaperDraftStore;
}): void {
  const currEditorState = paperDraftStore.get("editorState");
  if (currEditorState != null) {
    // omg im genius
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

export default createConnectedStore(initialState);
