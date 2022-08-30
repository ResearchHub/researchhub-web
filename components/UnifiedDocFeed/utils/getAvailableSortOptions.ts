import { sortOpts } from "../constants/UnifiedDocFilters";

export const getAvailableSortOptions = ({ type, valuesOnly = false }) => {
  const availableSortOpts = Object.values(sortOpts).filter((sortObj) =>
    sortObj.availableFor.includes(type)
  );

  if (valuesOnly) {
    return availableSortOpts.map((obj) => obj.value);
  } else {
    return availableSortOpts;
  }
};
