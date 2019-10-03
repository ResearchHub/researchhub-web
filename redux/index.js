import { combineReducers } from "redux";

import discussionReducer from "./discussion/reducer";
import paperReducer from "./paper/reducer";
import modalReducer from "./modals";
import authReducer from "./auth";

export default combineReducers({
  modals: modalReducer,
  discussion: discussionReducer,
  paper: paperReducer,
  auth: authReducer,
});
