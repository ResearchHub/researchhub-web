import { FormErrorState, FormState } from "../types/UploadComponentTypes";

export const getIsFormValid = ({
  formState,
  formErrors,
  setFormErrors,
}: {
  formState: FormState;
  formErrors: FormErrorState;
  setFormErrors: (errors: FormErrorState) => void;
}) => {
  for (const key in formErrors) {
    if (formErrors[key]) {
      return false;
    }
  }

  let result = true;
  const { hubs: selectedHubs } = formState;
  const newErrors = { ...formErrors };
  if (selectedHubs.length < 1) {
    result = false;
    newErrors.hubs = true;
  }
  // NOTE: calvinhlee - previoulsy we had a check for published date as well. It's deprecated
  setFormErrors(newErrors);
  return result;
};
