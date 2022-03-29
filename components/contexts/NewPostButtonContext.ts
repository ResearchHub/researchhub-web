import { createContext } from "react";
import { ID } from "~/config/types/root_types";

export type NewPostButtonContextValues = { isOpen: boolean; paperID?: ID };

export type NewPostButtonContextType = {
  values: NewPostButtonContextValues;
  setValues: (NewPostButtonContextValues) => void;
};

export const DEFAULT_POST_BUTTON_VALUES = { isOpen: false, paperID: null };

export const NewPostButtonContext = createContext<NewPostButtonContextType>({
  values: DEFAULT_POST_BUTTON_VALUES,
  setValues: () => {},
});
