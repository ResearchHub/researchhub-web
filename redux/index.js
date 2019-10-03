import { combineReducers } from "redux";

import discussionReducer from "./discussion/reducer";
import paperReducer from "./paper";

export default combineReducers({
  discussion: discussionReducer,
  paper: paperReducer,
});
