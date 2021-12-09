import {
  FormPublishedDate,
  ModifiedDateType,
} from "../types/UploadComponentTypes";
import * as Options from "../../../../config/utils/options";
import {
  isNullOrUndefined,
  nullthrows,
} from "../../../../config/utils/nullchecks";

export const parseDate = (dateParts: string[]): FormPublishedDate => {
  // NOTE: calvinhlee - below is a weird assumption. Migrating from prev logic
  return {
    day: dateParts.length > 2 ? dateParts[2] : "01",
    month: dateParts.length > 1 ? dateParts[1] : "01",
    year: dateParts[0],
  };
};

type FormmatDateToDropdownOptionsResult = {
  day: ModifiedDateType | null;
  month: ModifiedDateType | null;
  year: ModifiedDateType | null;
};
// Refer to Note(100) - calvinhlee
export const formatDateToDropdownOptions = (
  parsedDate: FormPublishedDate
): FormmatDateToDropdownOptionsResult => {
  const { day: parsedDay, month: parsedMonth, year: parsedYr } = parsedDate;
  return {
    day: !isNullOrUndefined(parsedDay)
      ? { label: `${parsedDay}`, value: `${parsedDay}` }
      : null,
    month: !isNullOrUndefined(parsedMonth)
      ? Options.months.find(
          (month) => nullthrows(month).value === parsedMonth
        ) || Options.months[0]
      : null,
    year: { label: `${parsedYr || ""}`, value: `${parsedYr || ""}` },
  };
};
