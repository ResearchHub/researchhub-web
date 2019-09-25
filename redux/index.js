import { combineReducers } from "redux";
import paperReducer from "./paper";
import modals from "./modals";

export default combineReducers({
  modals,
  paper: paperReducer,
});
