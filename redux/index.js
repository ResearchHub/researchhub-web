import { combineReducers } from "redux";
import paperReducer from "./paper";

export default combineReducers({
  paper: paperReducer,
});
