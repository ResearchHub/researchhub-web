import { useState, useCallback, useRef } from "react";
import FormSelect from "../../Form/FormSelect";
import { StyleSheet, css } from "aphrodite";
import { fetchAllSuggestions } from "~/components/SearchSuggestion/lib/api";
import debounce from "lodash/debounce";
import colors from "~/config/themes/colors";
import { PaperSuggestion, PostSuggestion, Suggestion } from "~/components/SearchSuggestion/lib/types";
import { components } from "react-select";

interface Props {
  onSelect: (suggestion: PaperSuggestion | PostSuggestion) => void;
  containerStyle?: object;
  inputContainerStyle?: object;
}

const SearchDocumentsSuggester = ({ onSelect, containerStyle, inputContainerStyle }: Props) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchSuggestions = useCallback(async (inputValue: string) => {
    if (!inputValue || inputValue.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      setIsLoading(true);
      const fetchedSuggestions = await fetchAllSuggestions(inputValue);
      const filteredSuggestions = fetchedSuggestions.filter(
        (suggestion) => suggestion.suggestionType === "paper" || suggestion.suggestionType === "post"
      );
      setSuggestions(filteredSuggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedFetch = useCallback(
    debounce((value) => handleFetchSuggestions(value), 250),
    [handleFetchSuggestions]
  );

  // Format suggestions for FormSelect
  const formattedOptions = suggestions.map((suggestion) => {
    const data = suggestion.data as (PaperSuggestion | PostSuggestion);
    return {
      value: data.id,
      label: data.title,
      data: data,
      customOptionComponent: () => (
        <div className={css(styles.optionContent)}>
          <div className={css(styles.optionTitle)}>{data.title}</div>
          <div className={css(styles.optionMeta)}>
            {data.authors.map((author, index) => (
              <span key={author.id}>
                {author.firstName} {author.lastName}
                {index < data.authors.length - 1 ? ", " : ""}
              </span>
            ))}
            <span className={css(styles.optionDate)}>
              {data.publishedDate || data.createdDate}
            </span>
          </div>
        </div>
      ),
    };
  });

  const customComponents = {
    Option: ({ children, ...props }) => {
      const CustomOption = props.data.customOptionComponent;
      return (
        <components.Option {...props}>
          <CustomOption />
        </components.Option>
      );
    },
  };

  return (
    <div style={containerStyle}>
      <FormSelect
        placeholder="Search for papers..."
        isSearchable={true}
        isClearable={true}
        isLoading={isLoading}
        options={formattedOptions}
        containerStyle={inputContainerStyle}
        onInputChange={(value) => {
          debouncedFetch(value);
        }}
        onChange={(_id, selected) => {
          if (selected) {
            onSelect(selected.data);
          }
        }}
        noOptionsMessage={({ inputValue }) => 
          inputValue.length < 3 
            ? "Type at least 3 characters to search" 
            : "No results found"
        }
        selectComponents={customComponents}
        reactSelect={{
          styles: {
            option: {
              padding: "12px 16px",
            },
          },
        }}
      />
    </div>
  );
};

const styles = StyleSheet.create({
  optionContent: {
    padding: "4px 0",
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 4,
    color: colors.BLACK(0.9),
  },
  optionMeta: {
    fontSize: 12,
    color: colors.BLACK(0.6),
  },
  optionDate: {
    marginLeft: 8,
    ":before": {
      content: "•",
      marginRight: 8,
    },
  },
});

export default SearchDocumentsSuggester;
