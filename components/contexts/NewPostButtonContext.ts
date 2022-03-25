import { createContext } from "react";
import { ID } from "~/config/types/root_types";

export type NewPostButtonContextValues = { isOpen: boolean; paperID?: ID };

export type NewPostButtonContextType = {
  values: NewPostButtonContextValues;
  setValues: (NewPostButtonContextValues) => void;
};

export const NewPostButtonContext = createContext<NewPostButtonContextType>({
  values: { isOpen: false, paperID: null },
  setValues: () => {},
});
