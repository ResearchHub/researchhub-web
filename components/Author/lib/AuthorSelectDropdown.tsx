import { Hub } from "~/config/types/hub";
import Select, { ValueType, OptionTypeBase, components } from "react-select";
import debounce from "lodash/debounce";
import { useCallback, useEffect, useState } from "react";
import { css, StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";
import FormSelect from "~/components/Form/FormSelect";
import { fetchAuthorSuggestions } from "~/components/SearchSuggestion/lib/api";
import { SuggestedAuthor } from "~/components/SearchSuggestion/lib/types";
import HubTag from "~/components/Hubs/HubTag";

interface Props {
  selectedAuthor?: SuggestedAuthor;
  onChange: Function;
  menuPlacement?: "auto" | "top" | "bottom";
  required?: boolean;
  label?: string | null;
  placeholder?: any;
  dropdownStyles?: any;
  containerStyle?: any;
}

export const selectDropdownStyles = {
  multiTagLabelStyle: {
    color: colors.NEW_BLUE(1),
    cursor: "pointer",
  },
  multiTagStyle: {
    border: 0,
    background: colors.NEW_BLUE(0.1),
    padding: "4px 12px",
    height: "unset",
    textDecoration: "none",
    fontWeight: 400,
    borderRadius: 50,
    color: colors.NEW_BLUE(),
  },
  option: {
    width: "auto",
    boxSizing: "border-box",
    textAlign: "center",
    backgroundColor: "unset",
    padding: 0,
    marginTop: 0,
    marginBottom: 8,
    ":nth-child(3n+1)": {
      paddingLeft: 5,
    },
    ":hover": {
      backgroundColor: "unset",
    },
  },
  menuList: {
    display: "flex",
    flexWrap: "wrap",
    columnGap: "10px",
    padding: "7px 7px 0 7px",
  },
  valueContainer: {
    padding: "7px 7px 7px 4px",
  },
};


const AuthorSelectDropdown = ({
  selectedAuthor,
  onChange,
  menuPlacement = "auto",
  required = false,
  label = "Search authors",
  placeholder = "Search hubs",
  dropdownStyles = selectDropdownStyles,
}: Props) => {
  const [suggestedAuthors, setSuggestedAuthors] = useState<SuggestedAuthor[]>([]);

  const handleSuggestedAuthorInputChange = async (value) => {
    if (value.length >= 3) {
      const suggestions = await fetchAuthorSuggestions({ query: value });
      setSuggestedAuthors(suggestions);
    }
  };

  const debouncedHandleInputChange = useCallback(
    debounce(handleSuggestedAuthorInputChange, 250),
    [suggestedAuthors]
  );

  const formattedSelectedAuthor = {
    label: selectedAuthor?.fullName,
    value: selectedAuthor?.id,
  }

  return (
    <div>
      <FormSelect
        containerStyle={formStyles.container}
        id="authors"
        isMulti={false}
        label={label}
        required={required}
        reactStyles={{}}
        inputStyle={formStyles.inputStyle}
        reactSelect={{ styles: dropdownStyles }}
        noOptionsMessage={(value) => {
          return value.inputValue.length >= 3
            ? "No authors found"
            : "Type to search authors";
        }}
        onInputChange={(field, value) => {
          debouncedHandleInputChange(field, value);
        }}
        onChange={(name, values) => {
          console.log('name', name);
            console.log('values', values);
        }}
        // selectComponents={{
        //   Option: TagOnlyOption,
        //   IndicatorsContainer: () => null,
        // }}
        menu={{
          display: "flex",
          flexWrap: "wrap",
        }}
        options={suggestedAuthors}
        placeholder={placeholder}
        value={formattedSelectedAuthor}
        menuPlacement={menuPlacement}
      />
    </div>
  );
};

const formStyles = StyleSheet.create({
  container: {
    minHeight: "auto",
  },
  inputStyle: {},
});

export default AuthorSelectDropdown;
