import { ReactElement } from "react";
import { SuggestedUser } from "~/components/SearchSuggestion/lib/types";
import Autocomplete from "@mui/material/Autocomplete";
import OutlinedInput from "@mui/material/OutlinedInput";

export type InputProps = {
  disabled?: boolean;
  formID: string;
  label: string;
  onInputChange?: (value: any) => void;
  placeholder?: string;
  required?: boolean;
  onUserSelect?: (user: SuggestedUser) => void;
  selectedUser?: SuggestedUser;
};

export default function ReferenceItemRhUserLookupInput({
  disabled,
  formID,
  label,
  onInputChange,
  onUserSelect,
  placeholder,
  required,
}: InputProps): ReactElement {
  return (
    <Autocomplete
      disablePortal
      onSelect={onUserSelect}
      options={top100Films}
      fullWidth
      size="small"
      // handleClick={() => {}}
      renderInput={(params) => {
        return (
          <OutlinedInput
            {...params}
            disabled={disabled}
            label={label}
            onChange={onInputChange}
            placeholder={placeholder}
            required={required}
          />
        );
      }}
    />
  );
}
