import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import reducer from "./index";
import { persistStore, persistReducer } from "redux-persist";

export function configureStore(initialState = {}) {
  let store;
  let persistor;
  const isClient = typeof window !== "undefined";
  if (isClient) {
    const storage = require("redux-persist/lib/storage").default;
    const persistConfig = {
      key: "root",
      storage,
    };
    store = createStore(
      persistReducer(persistConfig, reducer),
      initialState,
      composeWithDevTools(applyMiddleware(thunkMiddleware))
    );
    store._persistor = persistStore(store);
  } else {
    store = createStore(
      reducer,
      initialState,
      composeWithDevTools(applyMiddleware(thunkMiddleware))
    );
  }
  return store;
}
