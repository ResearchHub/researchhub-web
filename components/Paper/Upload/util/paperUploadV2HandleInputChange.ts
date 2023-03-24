import { isNullOrUndefined } from "../../../../config/utils/nullchecks";
import {
  ComponentState,
  FormErrorState,
  FormState,
} from "../types/UploadComponentTypes";

type InitArgs = {
  currFormState: FormState;
  currFormErrors: FormErrorState;
  currComponentState: ComponentState;
  setComponentState: (state: ComponentState) => void;
  setFormState: (data: FormState) => void;
  setFormErrors: (errors: FormErrorState) => void;
};

export const getHandleInputChange = ({
  currFormState,
  currFormErrors,
  currComponentState,
  setComponentState,
  setFormState,
  setFormErrors,
}: InitArgs) => (id: string, value: any): void => {
  const keys = id.split(".");
  const firstKey = keys[0];
  const newFormState = { ...currFormState };
  const newFormErrors = { ...currFormErrors };
  // NOTE: calvinhlee - simplified legacy logic. Leaving as is to avoid refactoring FormInput
  if (keys.length === 1) {
    newFormState[firstKey] =
      firstKey === "title"
        ? !isNullOrUndefined(value)
          ? (value[0] || "").toUpperCase() + value.slice(1)
          : ""
        : value || "";
  } else {
    // Refer to Note(100)
    newFormState[firstKey][keys[1]] = value;
    firstKey === "published" ? (newFormErrors[keys[1]] = false) : null; // removes red border on select fields
  }
  setComponentState({ ...currComponentState, isFormEdited: true });
  setFormState(newFormState);
  setFormErrors(newFormErrors);
};
