import { isEmpty } from "~/config/utils/nullchecks";
import { fetchUserSuggestions } from "~/components/SearchSuggestion/lib/api";
import { ID, NullableString } from "~/config/types/root_types";
import { ReactElement, SyntheticEvent, useState } from "react";
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
  onFetchLoad,
  onInputChange,
  onFetchSucess,
}) => {
  let debounceRef: NodeJS.Timeout | null = null;
  return async (event: SyntheticEvent, queryString: string) => {
    event.preventDefault();
    onInputChange(queryString);
    if (!isEmpty(onFetchLoad) && !isEmpty(queryString)) {
      onFetchLoad(queryString);
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
  const [isLookupLoading, setIsLookupLoading] = useState<boolean>(false);

  const handleInputChange = getDebouncedHandleInputChange({
    debounceTime: 500,
    onInputChange: setInputValue,
    onFetchSucess: (suggestedUsers: SuggestedUser[]) => {
      setIsLookupLoading(false);
      setSuggestedUsers(suggestedUsers);
    },
    onFetchLoad: (_queryString: string) => {
      setIsLookupLoading(true);
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
      getOptionLabel={
        /* Utilizing renderOption instead. Keeping this to avoid MUI errors */
        (option: SuggestedUser): string => option.firstName
      }
      inputValue={inputValue}
      loading={isLookupLoading}
      loadingText={"Looking for users ..."}
      noOptionsText={isEmpty(inputValue) ? "" : "No user(s) found"}
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
      renderOption={(
        _props,
        userOption: SuggestedUser,
        _state
      ): ReactElement<typeof ReferenceItemRhUserLookupInputTag> => {
        const { id, firstName, lastName, reputation } = userOption;
        return (
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
