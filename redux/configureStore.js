import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import logger from "redux-logger";
import thunkMiddleware from "redux-thunk";
import reducer from "./index";

export function configureStore(initialState = {}) {
  const middleware = [thunkMiddleware];

  if (process.env.NODE_ENV === "development") {
    middleware.push(logger); // Logger must be the last item in middleware
  }

  let store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
  );
  return store;
}
