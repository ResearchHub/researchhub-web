import { createContext } from "react";
import { ID, NullableString } from "~/config/types/root_types";
import { WizardBodyTypes } from "../Paper/UploadWizard/types/PaperUploadWizardTypes";

// TODO: calvinhlee - reorganize these context values to better represent currently available post-types
export type NewPostButtonContextValues = {
  doi?: NullableString;
  hypothesis?: {
    isUploadForHypothesis: boolean;
    onPaperUpdateComplete?: ({
      exitPaperUploadModal,
      postedPaperUniDocID,
    }: {
      exitPaperUploadModal: () => void;
      postedPaperUniDocID: ID;
    }) => void;
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
    isUploadForHypothesis: false,
    onPaperUpdateComplete: undefined,
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
