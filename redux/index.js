import { combineReducers } from "redux";

import discussionReducer from "./discussion/reducer";
import paperReducer from "./paper";
import modalReducer from "./modals";

export default combineReducers({
  modals: modalReducer,
  discussion: discussionReducer,
  paper: paperReducer,
});
