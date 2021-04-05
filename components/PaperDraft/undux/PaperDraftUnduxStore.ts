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

export default createConnectedStore(initialState);
