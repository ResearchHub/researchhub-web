interface SearchAutoSuggestProps {
  onSearchSuggestionSelect: Function;
}

const SearchAutoSuggest = ({ onSearchSuggestionSelect }: SearchAutoSuggestProps) => {

  return (
    <div>
      {searchSuggestion.map((suggestion, index) => (
        <div key={index} onClick={() => onSearchSuggestionSelect(suggestion)}>
          {suggestion}
        </div>
      ))}
    </div>
  );
}

export default SearchAutoSuggest;
