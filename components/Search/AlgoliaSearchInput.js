import React, { useState, useCallback } from "react";
import { InstantSearch, Hits, connectSearchBox } from "react-instantsearch-dom";
import { debounce } from "underscore";

const SearchInput = ({ refine, delay, onChange }) => {
  const [currentQuery, setCurrentQuery] = useState("");

  const doSearch = useCallback(debounce((value) => refine(value), delay), []);

  const handleChange = (event) => {
    const newQuery = event.currentTarget.value;

    setCurrentQuery(newQuery);
    doSearch(newQuery);
    onChange(newQuery);
  };

  return (
    <input
      value={currentQuery}
      onChange={handleChange}
      placeholder="Search..."
    />
  );
};

export default connectSearchBox(SearchInput);
