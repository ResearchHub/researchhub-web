import { ReactElement } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import ReferenceItemFieldInput from "./ReferenceItemFieldInput";

const top100Films = [
  { label: "The Shawshank Redemption", year: 1994 },
  { label: "The Godfather", year: 1972 },
  { label: "The Godfather: Part II", year: 1974 },
  { label: "The Dark Knight", year: 2008 },
  { label: "12 Angry Men", year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: "Pulp Fiction", year: 1994 },
];

type User = any;

export type InputProps = {
  disabled?: boolean;
  formID: string;
  label: string;
  onInputChange?: (value: any) => void;
  placeholder?: string;
  required?: boolean;
  onUserSelect?: (user: User) => void;
  selectedUser?: User;
};

export default function ReferenceItemRhUserLookupInput({
  disabled,
  formID,
  label,
  onInputChange,
  onUserSelect,
  placeholder,
  required,
  selectedUser,
}: InputProps): ReactElement {
  return (
    <Autocomplete
      disablePortal
      options={top100Films}
      sx={{ width: 300 }}
      renderInput={(params) => (
        <ReferenceItemFieldInput
          disabled={disabled}
          formID={formID}
          label={label}
          onChange={onInputChange}
          placeholder={placeholder}
          required={required}
        />
      )}
    />
  );
}
