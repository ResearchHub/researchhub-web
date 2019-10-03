import { combineReducers } from "redux";
import paperReducer from "./paper";
import modalReducer from "./modals";

export default combineReducers({
  modals: modalReducer,
  paper: paperReducer,
});
