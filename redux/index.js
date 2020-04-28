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
import transactionReducer from "./transaction";
import notificationReducer from "./notification";
import flagReducer from "./flags";
import bulletReducer from "./bullets";
import bannerReducer from "./banner";
import limitationsReducer from "./limitations";

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
  transactions: transactionReducer,
  livefeed: notificationReducer,
  flags: flagReducer,
  bullets: bulletReducer,
  banners: bannerReducer,
  limitations: limitationsReducer,
});
