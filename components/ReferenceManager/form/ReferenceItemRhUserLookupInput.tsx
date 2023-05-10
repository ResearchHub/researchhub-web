import { ReactElement, ReactNode, SyntheticEvent, useState } from "react";
import { SuggestedUser } from "~/components/SearchSuggestion/lib/types";
import Autocomplete from "@mui/material/Autocomplete";
import OutlinedInput from "@mui/material/OutlinedInput";
import TextField from "@mui/material/TextField";
import { debounce } from "@mui/material";
import { emptyFncWithMsg, isEmpty } from "~/config/utils/nullchecks";
import { fetchUserSuggestions } from "~/components/SearchSuggestion/lib/api";
import { NullableString } from "~/config/types/root_types";
import SuggestUsers from "~/components/SearchSuggestion/SuggestUsers";
import { Cancelable } from "@mui/utils/debounce";
import { event } from "react-ga";

export type InputProps = {
  disabled?: boolean;
  formID: string;
  label: string;
  onInputChange?: (value: any) => void;
  onUserSelect?: (user: SuggestedUser) => void;
  placeholder?: string;
  required?: boolean;
  selectedUser?: SuggestedUser;
  shouldClearOnSelect?: boolean;
};

const LOADING_SUGGESTION: SuggestedUser = {
  firstName: "loading",
  lastName: "loading",
  id: -1,
  reputation: 0,
  authorProfile: {
    isClaimed: false,
    url: "",
    description: "",
    headline: "",
  },
};

const getDebouncedHandleInputChange = ({
  debounceTime = 500,
  onLoad,
  onInputChange,
  onFetchSucess,
}) => {
  let debounceRef: NodeJS.Timeout | null = null;
  return async (event: SyntheticEvent, queryString: string) => {
    event.preventDefault();
    onInputChange(queryString);
    if (!isEmpty(onLoad) && !isEmpty(queryString)) {
      onLoad(queryString);
    }
    // debounceRef && debounceRef.clear();
    debounceRef = setTimeout(async () => {
      debugger;
      onFetchSucess(await fetchUserSuggestions(queryString));
    }, debounceTime);
  };
};
export default function ReferenceItemRhUserLookupInput({
  disabled,
  formID,
  label,
  onInputChange,
  onUserSelect,
  placeholder,
  required,
  shouldClearOnSelect,
}: InputProps): ReactElement {
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // NOTE: calvinhlee - this way of debouncing looks off. Need to look into this
  const handleInputChange = getDebouncedHandleInputChange({
    debounceTime: 500,
    onInputChange: setInputValue,
    onFetchSucess: setSuggestedUsers,
    onLoad: (_queryString: string) => {
      setIsLoading(true);
    },
  });
  console.warn("handleInputChange: ", handleInputChange);

  const handleSelect = (selectedUser: SuggestedUser): void => {
    onUserSelect && onUserSelect(selectedUser);
    shouldClearOnSelect;
  };

  return (
    <Autocomplete
      // onSelect={handleSelect}
      disableCloseOnSelect
      inputValue={inputValue}
      renderOption={(props, option: SuggestedUser, state): ReactNode => {
        return <div>HI</div>;
      }}
      onInputChange={handleInputChange}
      options={suggestedUsers}
      fullWidth
      size="small"
      renderInput={(params) => (
        <TextField
          {...params}
          InputProps={{
            ...params.InputProps,
            type: "search",
          }}
        />
      )}
    />
  );
}
