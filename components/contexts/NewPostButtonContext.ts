import { createContext } from "react";
import { ID, NullableString } from "~/config/types/root_types";
import { WizardBodyTypes } from "../Paper/UploadWizard/types/PaperUploadWizardTypes";

export type NewPostButtonContextValues = {
  doi?: NullableString;
  isOpen: boolean;
  isWithDOI?: boolean;
  paperID?: ID;
  submissionID?: ID;
  wizardBodyType: WizardBodyTypes;
};

export type NewPostButtonContextType = {
  values: NewPostButtonContextValues;
  setValues: (NewPostButtonContextValues: NewPostButtonContextValues) => void;
};

export const DEFAULT_POST_BUTTON_VALUES: NewPostButtonContextValues = {
  doi: undefined,
  isOpen: false,
  isWithDOI: false,
  paperID: undefined,
  submissionID: undefined,
  wizardBodyType: "url_upload",
};

export const NewPostButtonContext = createContext<NewPostButtonContextType>({
  values: DEFAULT_POST_BUTTON_VALUES,
  setValues: () => {},
});
