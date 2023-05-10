import { isEmpty } from "~/config/utils/nullchecks";
import { fetchUserSuggestions } from "~/components/SearchSuggestion/lib/api";
import { ID, NullableString } from "~/config/types/root_types";
import {
  Fragment,
  ReactElement,
  ReactNode,
  SyntheticEvent,
  useState,
} from "react";
import { SuggestedUser } from "~/components/SearchSuggestion/lib/types";
import Autocomplete from "@mui/material/Autocomplete";
import ReferenceItemRhUserLookupInputTag from "./ReferenceItemRhUserLookupInputTag";
import TextField from "@mui/material/TextField";

export type InputProps = {
  disabled?: boolean;
  filterUserIDs: ID[];
  label?: NullableString;
  onUserSelect?: (user: SuggestedUser) => void;
  placeholder?: string;
  required?: boolean;
  selectedUser?: SuggestedUser;
  shouldClearOnSelect?: boolean;
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
    } else if (isEmpty(queryString)) {
      onFetchSucess([]);
      debounceRef && clearTimeout(debounceRef);
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
  shouldClearOnSelect,
  filterUserIDs,
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
    shouldClearOnSelect && setInputValue("");
  };

  return (
    <Autocomplete
      fullWidth
      clearOnEscape
      clearOnBlur
      blurOnSelect
      selectOnFocus
      getOptionDisabled={() => true}
      getOptionLabel={
        /* Utilizing renderOption instead. Keeping this to avoid MUI errors */
        (option: SuggestedUser): string => option.firstName
      }
      inputValue={inputValue}
      loading={isLoading}
      loadingText={"Looking for users ..."}
      noOptionsText={
        isEmpty(inputValue) ? "Enter user name" : "No user(s) found"
      }
      onInputChange={handleInputChange}
      options={isEmpty(inputValue) ? [] : suggestedUsers}
      renderInput={(params) => (
        <TextField
          {...params}
          disabled={disabled}
          InputProps={{
            ...params.InputProps,
            type: "search",
          }}
          label={label}
          placeholder={placeholder}
        />
      )}
      filterOptions={(options: SuggestedUser[]): SuggestedUser[] => {
        return options.filter(
          (option: SuggestedUser): boolean => !filterUserIDs.includes(option.id)
        );
      }}
      renderOption={(_props, userOption: SuggestedUser, _state): ReactNode => {
        const { id, firstName, lastName, reputation } = userOption;
        return (
          // Wrapping in Fragment allows proper mouse behaviors for MUI components
          <ReferenceItemRhUserLookupInputTag
            isSelectable
            onSelect={(event: SyntheticEvent): void => {
              event.preventDefault();
              handleSelect(userOption);
            }}
            key={`RhUserLookup-Input-User-${id}-${firstName}-${lastName}-${reputation}`}
            user={userOption}
          />
        );
      }}
      size="small"
    />
  );
}
