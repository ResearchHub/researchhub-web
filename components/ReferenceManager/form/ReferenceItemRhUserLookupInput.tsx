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
  label?: NullableString;
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
    debounceRef && clearTimeout(debounceRef);
    debounceRef = setTimeout(async () => {
      onFetchSucess(await fetchUserSuggestions(queryString));
    }, debounceTime);
  };
};
export default function ReferenceItemRhUserLookupInput({
  disabled,
  label,
  onUserSelect,
  placeholder,
  required,
  shouldClearOnSelect,
}: InputProps): ReactElement {
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = getDebouncedHandleInputChange({
    debounceTime: 500,
    onInputChange: setInputValue,
    onFetchSucess: (suggestedUsers: SuggestedUser[]) => {
      setIsLoading(false);
      setSuggestedUsers(suggestedUsers);
    },
    onLoad: (_queryString: string) => {
      setIsLoading(true);
    },
  });

  const handleSelect = (selectedUser: SuggestedUser): void => {
    onUserSelect && onUserSelect(selectedUser);
    shouldClearOnSelect;
  };

  return (
    <Autocomplete
      // onSelect={handleSelect}
      disableCloseOnSelect
      inputValue={inputValue}
      renderOption={(props, userOption: SuggestedUser, state): ReactNode => {
        if (userOption.id === -1) {
          return <div>LOADING</div>;
        } else {
          return <div>HI</div>;
        }
      }}
      onInputChange={handleInputChange}
      options={isLoading ? [LOADING_SUGGESTION] : suggestedUsers}
      fullWidth
      size="small"
      renderInput={(params) => (
        <TextField
          {...params}
          disabled={disabled}
          InputProps={{
            ...params.InputProps,
            type: "search",
          }}
        />
      )}
    />
  );
}
