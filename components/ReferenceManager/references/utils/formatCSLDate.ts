import { isEmpty } from "~/config/utils/nullchecks";

export type CSLDateParts = {
  "date-parts": array;
};

export const datePartsToDateString = (dateParts: CSLDateParts): array => {
  if (typeof dateParts === "string") {
    return dateParts;
  }
  if (isEmpty(dateParts)) {
    return [];
  }

  const date = dateParts["date-parts"];

  if (date) {
    return date.join("-");
  }
  return [];
};

export const stringToDateParts = (dateString: string): CSLDateParts => {
  const dateParts = dateString.split(/[-/]/);
  if (dateParts.length === 0) {
    return {};
  }
  return { "date-parts": dateParts };
};
