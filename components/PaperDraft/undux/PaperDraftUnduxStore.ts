import { Store, createConnectedStore } from "undux";
import { EditorState } from "draft-js";
import { emptyFunction } from "../util/PaperDraftUtils";

export type ID = string | number | null;
export type PaperDraftStore = Store<State>;
export type State = {
  editorState: EditorState | null;
  setEditorState: Function | null;
  lastSavePaperTime: number | null;
  paperID: ID;
  shouldSavePaper: boolean; // trigger save paper behind the scene
};

const initialState: State = {
  lastSavePaperTime: null,
  paperID: null,
  editorState: EditorState.createEmpty(),
  setEditorState: emptyFunction,
  shouldSavePaper: false,
};

export default createConnectedStore(initialState);
