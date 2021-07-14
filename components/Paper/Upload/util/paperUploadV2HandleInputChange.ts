import { isNullOrUndefined } from "../../../../config/utils/nullchecks";
import {
  ComponentState,
  FormErrorState,
  FormState,
} from "../types/UploadComponentTypes";

type InitArgs = {
  currFormData: FormState;
  currFormErrors: FormErrorState;
  currComponentState: ComponentState;
  setComponentState: (state: ComponentState) => void;
  setFormData: (data: FormState) => void;
  setFormErrors: (errors: FormErrorState) => void;
};

export const getHandleInputChange = ({
  currFormData,
  currFormErrors,
  currComponentState,
  setComponentState,
  setFormData,
  setFormErrors,
}: InitArgs) => (id: string, value: any): void => {
  const keys = id.split(".");
  const firstKey = keys[0];
  const newFormData = { ...currFormData };
  const newFormErrors = { ...currFormErrors };
  // NOTE: calvinhlee - simplified legacy logic. Leaving as is to avoid refactoring FormInput
  if (keys.length === 1) {
    newFormData[firstKey] =
      firstKey === "title"
        ? !isNullOrUndefined(value)
          ? (value[0] || "").toUpperCase() + value.slice(1)
          : ""
        : value;
  } else {
    newFormData[firstKey][keys[1]] = value;
    firstKey === "published" ? (newFormErrors[keys[1]] = false) : null; // removes red border on select fields
  }
  setComponentState({ ...currComponentState, isFormEdited: true });
  setFormData(newFormData);
  setFormErrors(newFormErrors);
};
