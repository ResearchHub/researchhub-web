import { createContext } from "react";
import { ID, NullableString } from "~/config/types/root_types";
import { ValidCitationType } from "../Hypothesis/Citation/modal/AddNewSourceBodySearch";
import { WizardBodyTypes } from "../Paper/UploadWizard/types/PaperUploadWizardTypes";

// TODO: calvinhlee - reorganize these context values to better represent currently available post-types
export type NewPostButtonContextValues = {
  doi?: NullableString;
  hypothesis: {
    citationType: ValidCitationType;
    hypothesisID: ID;
    isUploadForHypothesis: boolean;
  };
  isOpen: boolean;
  isQuestionType?: boolean;
  isWithDOI?: boolean;
  paperID?: ID;
  submissionID?: ID;
  type?: string;
  wizardBodyType: WizardBodyTypes | null;
};

export type NewPostButtonContextType = {
  values: NewPostButtonContextValues;
  setValues: (NewPostButtonContextValues: NewPostButtonContextValues) => void;
};

export const DEFAULT_POST_BUTTON_VALUES: NewPostButtonContextValues = {
  doi: undefined,
  hypothesis: {
    citationType: null,
    hypothesisID: null,
    isUploadForHypothesis: false,
  },
  isOpen: false,
  isQuestionType: false,
  isWithDOI: false,
  paperID: undefined,
  submissionID: undefined,
  wizardBodyType: null,
};

export const NewPostButtonContext = createContext<NewPostButtonContextType>({
  values: DEFAULT_POST_BUTTON_VALUES,
  setValues: () => {},
});
