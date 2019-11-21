import { combineReducers } from "redux";

import discussionReducer from "./discussion/reducer";
import paperReducer from "./paper/reducer";
import permissionReducer from "./permission/reducer";
import modalReducer from "./modals";
import authReducer from "./auth";
import voteReducer from "./vote/reducer";
import messageReducer from "./message";
import authorReducer from "./author/reducer";
import hubReducer from "./hub";
import universityReducer from "./universities";

export default combineReducers({
  modals: modalReducer,
  discussion: discussionReducer,
  message: messageReducer,
  paper: paperReducer,
  permission: permissionReducer,
  auth: authReducer,
  vote: voteReducer,
  author: authorReducer,
  hubs: hubReducer,
  universities: universityReducer,
});
